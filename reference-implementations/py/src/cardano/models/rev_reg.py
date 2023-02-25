from typing import List, TypedDict

class RevRegAccumKey(TypedDict):
    z: str

class RevRegPublicKeys(TypedDict):
    accumKey: RevRegAccumKey

class RevRegValue(TypedDict):
    publicKeys: RevRegPublicKeys
    maxCredNum: int
    tailsLocation: str
    tailsHash: str

class RevReg(TypedDict):
    issuerId: str
    revocDefType: str
    credDefId: str
    tag: str
    value: RevRegValue
