from typing import List, TypedDict

class Schema(TypedDict):
    issuerId: str
    name: str
    version: str
    attrNames: List[str]