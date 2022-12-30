# -*- encoding: utf-8 -*-
"""
Cardano Anoncred Method

"""

from blockfrost import BlockFrostApi, ApiError, ApiUrls
from pycardano import * 
from textwrap import wrap
from threading import Timer
import os
import json

QUEUE_DURATION = 60
NETWORK = Network.TESTNET
MINIMUN_BALANCE = 5000000
FUNDING_AMOUNT = 30000000
TRANSACTION_AMOUNT = 1000000

class Cardano:
    """
    Environment variables required:
        - BLOCKFROST_API_KEY = API KEY from Blockfrots  https://blockfrost.io
        - CARDANO_ADDRESS_CBORHEX = Private Key of address as CBOR Hex. Must be an Enterprice address (no Staking part) as PaymentSigningKeyShelley_ed25519
    
    """

    def __init__(self):
        self.pending_tx = []
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
            self.payment_signing_key = PaymentSigningKey.from_cbor(os.environ['BLOCKFROST_API_KEY'])
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

    def publishObject(self, anoncred_object):
        print("Adding anoncred object to queue")
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

        metadata_prefix = 123 # make randon uint 32
        object = {
                "ResourceObject": anoncred_object,
                "ResourceObjectMetadata": anoncred_object_metadata
            }
        meta = {
            metadata_prefix: wrap(json.dumps(object), 64)
        }
        self.pending_tx.append(meta)

        if not self.timer.is_alive():
            self.timer = Timer(90, self.flushQueue)
            self.timer.start()

    def flushQueue(self):
        print("Flushing Queue")
        try:
            txs = self.api.address_transactions(self.payment_addr)
            utxos = self.api.address_utxos(self.payment_addr.encode())
            tx_to_remove = []
            for tx in self.pending_tx:
                # Build transaction
                builder = TransactionBuilder(self.context)
                # select utxos
                utxo_sum = 0
                utxo_to_remove = []
                for u in utxos:
                    utxo_sum = utxo_sum + int(u.amount[0].quantity)
                    builder.add_input(
                        UTxO(
                            TransactionInput.from_primitive([u.tx_hash, u.tx_index]),
                            TransactionOutput(address=Address.from_primitive(u.address), amount=int(u.amount[0].quantity))
                        )
                    )
                    utxo_to_remove.append(u)
                    if utxo_sum > (TRANSACTION_AMOUNT + 2000000): break
                for ur in utxo_to_remove: utxos.remove(ur)
                builder.add_output(TransactionOutput(self.payment_addr,Value.from_primitive([TRANSACTION_AMOUNT])))
                builder.auxiliary_data = AuxiliaryData(Metadata(tx))
                signed_tx = builder.build_and_sign([self.payment_signing_key], change_address=self.payment_addr)
                # Submit transaction
                self.context.submit_tx(signed_tx.to_cbor())
                tx_to_remove.append(tx)
            self.pending_tx = []
        except Exception as e:
            for k in tx_to_remove: del self.pending_tx[k]
            self.timer = Timer(90, self.flushQueue)
            self.timer.start()

    def getaddressBalance(self):
        try:
            address = self.api.address(address=self.spending_addr.encode())
            return int(address.amount[0].quantity)
        except ApiError as e:
            return 0

