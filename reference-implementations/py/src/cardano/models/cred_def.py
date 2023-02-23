from typing import TypedDict

class CredDefPrimary(TypedDict):
    n: str
    r: dict
    rctxt: str
    s: str
    z: str

class CredDefRevocation(TypedDict):
    g: str
    g_dash: str
    h: str
    h0: str
    h1: str
    h2: str
    h_cap: str
    htilde: str
    pk: str
    u: str
    y: str

class CredDefValue(TypedDict, total=False):
    primary: CredDefPrimary
    revocation: CredDefRevocation

class CredDef(TypedDict):
    issuerId: str
    schemaId: str
    type: str
    tag: str
    value: CredDefValue



