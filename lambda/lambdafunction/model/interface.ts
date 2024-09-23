export enum ColumnName  {
    LICENCENAME=1,
    SHORTIDENTIFIER=2,
    FULLNAME=3,
    SPDX=4,
    ORIGINALUSE=8,
    MODIFIED=9
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
