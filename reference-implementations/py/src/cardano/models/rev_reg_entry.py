from typing import List, TypedDict

class RevRegEntry(TypedDict):
    revRegDefId: str
    revocationList: List[int]
    currentAccumulator: str
    timestamp: int