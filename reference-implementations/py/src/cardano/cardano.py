# -*- encoding: utf-8 -*-
"""
Cardano Anoncreds Method

"""

from blockfrost import BlockFrostApi, ApiError, ApiUrls
from pycardano import * 
from textwrap import wrap
from threading import Timer
from  pprint import pp
import os
import json
import random
from models.schema import Schema
from models.object_metadata import ObjectMetadata
from models.cred_def import CredDef
from models.rev_reg import RevReg
from models.rev_reg_entry import RevRegEntry
import hashlib
from datetime import datetime, timezone
from typing import Optional

NETWORK = Network.TESTNET
MINIMUN_BALANCE = 5000000
TRANSACTION_AMOUNT = 1000000
MINIMUN_UTXO = 20
ALLOWS_ASYNC = True
QUEUE_DURATION = 60

class Cardano:
    """
    Environment variables required:
        - BLOCKFROST_API_KEY = API KEY from Blockfrots  https://blockfrost.io
        - CARDANO_ADDRESS_CBORHEX = Private Key of address as CBOR Hex. Must be an Enterprice address (no Staking part) as PaymentSigningKeyShelley_ed25519
    
        - Support queued operations. No Tx_hash can be retrieved syncronously.
        - To guarantee synchronous operation, enouth UTXOs must be available in the address to process simultaneous operations.
        - If not, the operation will be queued and processed when UTXOs are available. Need to define how to retrieve tx_hash in this case.
        - spreadUTxOs() will spread UTXOs in the address to avoid this situation.

        TODO:
        - validate anoncreds object against models
        - validate signature
        - low balance warning

    """

    def __init__(self):
        self.pending_tx = []
        self.available_utxos = []
        self.timer = Timer(QUEUE_DURATION, self.flushQueue)
        self.ledger_cache = {}

        try:
            blockfrost_project_id=os.environ['BLOCKFROST_API_KEY']
            self.api = BlockFrostApi(
            project_id=blockfrost_project_id,
            base_url=ApiUrls.preview.value
            )
            self.context = BlockFrostChainContext(blockfrost_project_id,NETWORK, ApiUrls.preview.value)
        except KeyError:
             print("Missing environment variable BLOCKFROST_API_KEY")
             exit(1)
        try:
            self.payment_signing_key = PaymentSigningKey.from_cbor(os.environ['CARDANO_ADDRESS_CBORHEX'])
            payment_verification_key = PaymentVerificationKey.from_signing_key(self.payment_signing_key)
            self.payment_addr = Address(payment_verification_key.hash(), None, network=NETWORK)
        except KeyError:
            print("Missing environment variable CARDANO_ADDRESS_CBORHEX")
            exit(1)

        balance = self.getaddressBalance()
        if balance < MINIMUN_BALANCE:
            print("Insuficient funds in address",self.payment_addr.encode())
            exit(1)
        else:
            print("Address",self.payment_addr.encode(),"has",balance,"ADA")
            self.spreadUTxOs()
            
    def registerSchema(self,schema: Schema, publisher_DID: str, signature: str):
        
        if self.validateSignature:
            object_metadata: ObjectMetadata = {
                "resourceURI": "",
                "resourceName": schema["name"],
                "resourceFamily": "anoncreds",
                "resourceType": "SCHEMA",
                "resourceVersion": "v1",
                "mediaType": "application/json",
                "created": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "checkSum": hashlib.md5(json.dumps(schema).encode('utf-8')).hexdigest(),
                "publisherId": publisher_DID,
                "publisherSignature": signature
            }
            tx_id = self.publishAnoncredObject(schema,object_metadata)

            return publisher_DID + "/resources/" + str(tx_id)
        else: return "Invalid Signature"

    def registerCredDef(self,cred_def: CredDef, publisher_DID: str, signature: str):
        if self.validateSignature:
            object_metadata: ObjectMetadata = {
                "resourceURI": "",
                "resourceName": "CL",
                "resourceFamily": "anoncreds",
                "resourceType": "CRED_DEF",
                "resourceVersion": "v1",
                "mediaType": "application/json",
                "created": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "checkSum": hashlib.md5(json.dumps(cred_def).encode('utf-8')).hexdigest(),
                "publisherId": publisher_DID,
                "publisherSignature": signature
            }
            tx_id = self.publishAnoncredObject(cred_def,object_metadata)

            return publisher_DID + "/resources/" + str(tx_id)
        else: return "Invalid Signature"
    
    def registerRevReg(self,rev_reg: RevReg, publisher_DID: str, signature: str):
        if self.validateSignature:
            object_metadata: ObjectMetadata = {
                "resourceURI": "",
                "resourceName": "CL_ACUMM",
                "resourceFamily": "anoncreds",
                "resourceType": "REV_REG",
                "resourceVersion": "v1",
                "mediaType": "application/json",
                "created": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "checkSum": hashlib.md5(json.dumps(rev_reg).encode('utf-8')).hexdigest(),
                "publisherId": publisher_DID,
                "publisherSignature": signature
            }
            tx_id = self.publishAnoncredObject(rev_reg,object_metadata)

            return publisher_DID + "/resources/" + str(tx_id)
        else: return "Invalid Signature"
    
    def registerRevRegEntry(self, rev_reg_entry: RevRegEntry, publisher_DID: str, signature: str):
        if self.validateSignature:
            object_metadata: ObjectMetadata = {
                "resourceURI": "",
                "resourceName": "CL_ACUMM",
                "resourceFamily": "anoncreds",
                "resourceType": "REV_REG_ENTRY",
                "resourceVersion": "v1",
                "mediaType": "application/json",
                "created": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "checkSum": hashlib.md5(json.dumps(rev_reg_entry).encode('utf-8')).hexdigest(),
                "publisherId": publisher_DID,
                "publisherSignature": signature
            }
            rev_reg_id = rev_reg_entry["revocRegDefId"]
            object_id = rev_reg_id.split("/")[-1]
            meta = self.getObject(object_id)
            prefix = int(meta[0]['label'])

            tx_id = self.publishAnoncredObject(rev_reg_entry,object_metadata, prefix)

            return publisher_DID + "/resources/" + str(tx_id)
        else: return "Invalid Signature"

    def resolveObject(self, resource_URI):
        object_id = resource_URI.split("/")[-1]
        meta = self.getObject(object_id)

        meta_json = json.loads(''.join(meta[0]['json_metadata']))

        meta_json["ResourceObjectMetadata"]["resourceURI"] = resource_URI

        # For RevReg also loads all RevRegEntries
        if meta_json["ResourceObjectMetadata"]["resourceType"] == "REV_REG":
            meta_key = meta[0]["label"]
            entries = self.getRevocationEntries(meta_key, resource_URI, meta_json["ResourceObjectMetadata"]["publisherId"])
            meta_json["RevRegEntries"] = entries

        return meta_json

    def queryObject(self, resource_URI):
        return
    
    def publishAnoncredObject(self, anoncred_object,anoncred_object_metadata, metadata_prefix: Optional[int] = None) -> str:
        if not metadata_prefix:  metadata_prefix = random.randint(0, 2**32-1)
        object = {
                "ResourceObject": anoncred_object,
                "ResourceObjectMetadata": anoncred_object_metadata
            }
        meta = {
            metadata_prefix: wrap(json.dumps(object), 64)
        }
        return self.processTransaction(meta)
    
    def processTransaction(self, meta):
        
        if not self.timer.is_alive():
            self.getUTXOs()
            self.pending_tx.append(meta)
            tx_hash = self.submitTransaction(meta)
            self.timer = Timer(90, self.flushQueue)
            self.timer.start()
        elif len(self.available_utxos) > 0:
            self.pending_tx.append(meta)
            tx_hash = self.submitTransaction(meta)
        else:
            tx_hash = "Queued operation"
            if ALLOWS_ASYNC: 
                self.pending_tx.append(meta)
        return tx_hash

    def submitTransaction(self,meta):
        # Build transaction
        try:
            builder = TransactionBuilder(self.context)
            # select utxos
            utxo_sum = 0
            utxo_to_remove = []
            # print("Qty of utxo",len(self.available_utxos))
            for u in self.available_utxos:
                utxo_sum = utxo_sum + int(u.amount[0].quantity)
                builder.add_input(
                    UTxO(
                        TransactionInput.from_primitive([u.tx_hash, u.tx_index]),
                        TransactionOutput(address=Address.from_primitive(u.address), amount=int(u.amount[0].quantity))
                    )
                )
                utxo_to_remove.append(u)
                if utxo_sum > (TRANSACTION_AMOUNT + 2000000): break
            for ur in utxo_to_remove: self.available_utxos.remove(ur)
            builder.add_output(TransactionOutput(self.payment_addr,Value.from_primitive([TRANSACTION_AMOUNT])))
            builder.auxiliary_data = AuxiliaryData(Metadata(meta))
            signed_tx = builder.build_and_sign([self.payment_signing_key], change_address=self.payment_addr)
            # Submit transaction
            self.context.submit_tx(signed_tx.to_cbor())
            self.ledger_cache[str(signed_tx.id)] = [
                {
                    "label": list(meta.keys())[0],
                    "json_metadata": meta[list(meta.keys())[0]]
                }
            ]
            self.pending_tx.remove(meta)
            return signed_tx.id
        except Exception as e:
            print(e)
            self.available_utxos = []

    def flushQueue(self):
        print("Flushing Queue")
        self.getUTXOs()
        for m in self.pending_tx.copy():
            self.submitTransaction(m)

    def getObject(self, tx_id):
        if tx_id in self.ledger_cache:
            meta = self.ledger_cache[tx_id]
        else:
            meta = self.api.transaction_metadata(tx_id, return_type='json')
        return meta

    def getRevocationEntries(self, meta_key, rev_reg_id, publisher_DID):
        metas = self.api.metadata_label_json(meta_key, return_type='json')
        accumulators = []
        
        for m in metas:
            meta_json = json.loads(''.join(list(m["json_metadata"].values())))
            if meta_json["ResourceObjectMetadata"]["resourceType"] == "REV_REG_ENTRY" and meta_json["ResourceObject"]["revocRegDefId"] == rev_reg_id and  meta_json["ResourceObjectMetadata"]["publisherId"] == publisher_DID:
                # TODO VERIFY SIGNATURE
                accumulators.append(meta_json["ResourceObject"])
        return accumulators

    def getaddressBalance(self):
        try:
            address = self.api.address(address=self.payment_addr.encode())
            return int(address.amount[0].quantity)
        except ApiError as e:
            return 0

    def getUTXOs(self):
        try:
            self.available_utxos = self.api.address_utxos(self.payment_addr.encode())
        except ApiError as e:
            print("error",e)

    def spreadUTxOs(self):

        utxos = self.api.address_utxos(self.payment_addr.encode())
        balance = self.getaddressBalance()
        if balance > MINIMUN_BALANCE and len(utxos) < MINIMUN_UTXO:
            print("Spreading UTXOs")
            tx_amount = int((balance - 10000000) / MINIMUN_UTXO)
            print(tx_amount)
            builder = TransactionBuilder(self.context)
            builder.add_input_address(self.payment_addr)
            for _ in range(MINIMUN_UTXO):
                builder.add_output(TransactionOutput(self.payment_addr,Value.from_primitive([tx_amount])))
            signed_tx = builder.build_and_sign([self.payment_signing_key], change_address=self.payment_addr)
            # Submit transaction
            self.context.submit_tx(signed_tx.to_cbor())
    
    def validateSignature(self, object, publisherDID, signature):
        # TODO
        # resolve DID
        # get public key from DID Doc
        # verify signature
        return True

