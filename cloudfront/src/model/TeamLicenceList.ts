export interface DisplaySortedByAliasName {
    aliasName: string
    licenseName: string
    originalUse: string
    spdx: string
    displayLibraries: string[]
}

export interface AliasDetail {
    licenseName: string
    version: string
    spdx: string
    originalUse: string
    libraries: string[]
}
export interface SortByAliasName {
    [key: string]: AliasDetail;
}

export enum ApprovalColorName {
    OK = 'OK',
    OKASTA = 'OK※',
    NEEDSTUDY = '要検討',
    UNKNOWN = ''
}


export class DisplaySortedByAliasNameFixture {
    static build(
        overrides: Partial<DisplaySortedByAliasName> = {}
    ): DisplaySortedByAliasName {
        return {
            aliasName: '',
            licenseName: '',
            originalUse: '',
            spdx: '',
            displayLibraries: [],
            ...overrides,
        };
    }
}

export class AliasDetailFixture {
    static build(overrides: Partial<AliasDetail> = {}): AliasDetail {
        return {
            licenseName: '',
            version: '',
            spdx: '',
            originalUse: '',
            libraries: [],
            ...overrides,
        };
    }
}
