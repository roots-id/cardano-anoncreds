from typing import List, TypedDict

class RevRegEntryValue(TypedDict):
    accum: str
    prevAccum: str
    issued: List[int]
    revoked: List[int]

class RevRegEntry(TypedDict):
    revocDefType: str
    revocRegDefId: str
    value: RevRegEntryValue