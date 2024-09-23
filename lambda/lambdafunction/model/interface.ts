export enum ColumnName  {
    LICENCENAME=0,
    SHORTIDENTIFIER=1,
    FULLNAME=2,
    SPDX=3,
    ORIGINALUSE=7,
    MODIFIED=8
}

export interface ExcelEntity {
    id: string
    LicenseName: string
    ShortIdentifier: string
    fullName: string
    spdx: string
    originalUse: string
    modified: string
}

export interface AliasEntity {
    aliasName: string
    originalName: string
    originalId: string
}
