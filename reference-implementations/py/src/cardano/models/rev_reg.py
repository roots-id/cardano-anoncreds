from typing import List, TypedDict

class RevRegAccumKey(TypedDict):
    z: str

class RevRegPublicKeys(TypedDict):
    accumKey: RevRegAccumKey

class RevReg(TypedDict):
    type: str
    credDefId: str
    tag: str
    publicKeys: RevRegPublicKeys
    maxCredNum: int
    tailsLocation: str
    tailsHash: str