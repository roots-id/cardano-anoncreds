export interface ICredDefPrimary {
    n: string
    r: any
    rctxt: string
    s: string
    z: string
}


export interface ICredDefRevocation {
    g: string
    g_dash: string
    h: string
    h0: string
    h1: string
    h2: string
    h_cap: string
    htilde: string
    pk: string
    u: string
    y: string
}

export interface ICredDefValue {
    primary: ICredDefPrimary
    revocation?: ICredDefRevocation
}

export interface ICredDef {
    issuerId: string
    schemaId: string
    type: string
    tag: string
    value: ICredDefValue
}