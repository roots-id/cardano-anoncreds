export interface IRevRegAccumKey {
    z: string
}

export interface IRevRegPublicKeys {
    accumKey: IRevRegAccumKey
}

export interface IRevReg {
    type: string
    credDefId: string
    tag: string
    publicKeys: IRevRegPublicKeys
    maxCredNum: number
    tailsLocation: string
    tailsHash: string
}