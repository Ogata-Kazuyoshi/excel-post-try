export enum ColumnName  {
    LICENCENAME=1,
    SHORTIDENTIFIER=2,
    FULLNAME=3,
    SPDX=4,
    ORIGINALUSE=8,
    MODIFIED=9
}

export interface ExcelEntity {
    licenseName: string
    shortIdentifier: string
    fullName: string
    spdx: string
    originalUse: string
    modified: string
}

export interface AliasEntity {
    aliasName: string
    originalName: string
}

export enum CSVList {
    LIBRARYNAME= 0,
    VERSION= 1,
    ARIASNAME= 2
}

export interface TeamListEntity {
    teamName: string
    libraryName: string
    version: string
    aliasName: string
    licenseName: string
    spdx: string
    originalUse: string
}
