# -*- encoding: utf-8 -*-
"""
Cardano Anoncred Method

"""

from blockfrost import BlockFrostApi, ApiError, ApiUrls
from pycardano import * 
from textwrap import wrap
from threading import Timer
from  pprint import pp
import os
import json
import random
import time

# TODO
# not wait for queue


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

    """

    def __init__(self):
        self.pending_tx = []
        self.available_utxos = []
        self.timer = Timer(QUEUE_DURATION, self.flushQueue)

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
            
    def publishAnoncredObject(self, anoncred_object):
        print("Receive Anoncred Object")
        anoncred_object_metadata = {
            "resourceURI": "did:prism:mainnet:db47e78dd57d2043a7a704fbd9586682110a2097ac83b35602f290/resource/1815a6d1b6ecb9c2e1de09d3d18389b641ea34700",
            "resourceName": "degreeSchema",
            "resourceFamily": "anoncreds",
            "resourceType": "SCHEMA",
            "resourceVersion": "v1",    
            "mediaType": "application/json",
            "created": "2020-12-20T19:17:47Z",
            "checkSum": "7b2022636f6e74656e74223a202274657374206461746122207d0ae3b0c44298",
            "publisherId": "did:prism:mainnet:7BPMqYgYLQni258J8JPS8K",
            "publisherSignature": "XXXXXXXXX"
        }

        metadata_prefix = random.randint(0, 2**32-1)
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
            print("Qty of utxo",len(self.available_utxos))
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
        #tx = self.api.transaction(tx_id)
        meta = self.api.transaction_metadata(tx_id, return_type='json')
        print(meta[0]['label'])
        meta_json = json.loads(''.join(meta[0]['json_metadata']))
        pp(meta_json)

    def getRevocationEntries(self, meta_key):
        metas = self.api.metadata_label_json(meta_key, return_type='json')
        
        for m in metas:
            meta_json = ""
            pp(json.loads(''.join(list(m["json_metadata"].values()))))

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
        print(balance, len(utxos))
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

if __name__ == "__main__":
    cardano=Cardano()
    for i in range(30):
        objectId = cardano.publishAnoncredObject("test data"+str(i))
        print("Anoncred Opbejct Id:",objectId)
    #cardano.publishAnoncredObject("test data2")
    #cardano.getObject("87d565a9739dd2c2888e081fe44e635ff1dbc96815228339f7f24352e5cfea05")
    #cardano.getRevocationEntries(2841108030)
