export enum ColumnName  {
    LICENCENAME=1,
    SHORTIDENTIFIER=2,
    FULLNAME=3,
    SPDX=4,
    ORIGINALUSE=8,
    MODIFIED=9
}

export enum CSVList {
    LIBRARYNAME= 0,
    VERSION= 1,
    ARIASNAME= 2
}

export enum LicenseCheker {
    LIBRARYNAME = 0,
    ARIASNAME = 1,
    GITREPOSITORY = 2
}

export interface ExcelEntity {
    id: string
    licenseName: string
    shortIdentifier: string
    fullName: string
    spdx: string
    originalUse: string
    modified: string
    startedAt: string
    updatedAt: string
    aliasName?: string
}

export interface TeamListEntity {
    id: string
    teamName: string
    libraryName: string
    version: string
    aliasName: string
}

export interface RequestAliasChange {
    aliasName: string
    licenseName: string
}

export interface ResponseTeamList extends TeamListEntity{
    licenseName: string
    spdx: string
    originalUse: string
}

export enum CheckResult {
    UNKNOWN = 'unknown'
}

export interface LibraryEntity {
    id: string,
    libraryName: string,
    aliasName: string,
    gitRepository: string,
    ownerYear: string
}
