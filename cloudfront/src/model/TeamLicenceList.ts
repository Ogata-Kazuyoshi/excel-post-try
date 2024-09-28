export interface DisplaySortedByAliasName {
    aliasName: string;
    originalUse: string;
    spdx: string;
    displayLibraries: string[];
}

export interface AliasDetail {
    licenseName: string;
    version: string;
    spdx: string;
    originalUse: string;
    libraries: string[];
}
export interface SortByAliasName {
    [key: string]: AliasDetail;
}


export class DisplaySortedByAliasNameFixture {
    static build(
        overrides: Partial<DisplaySortedByAliasName> = {}
    ): DisplaySortedByAliasName {
        return {
            aliasName: '',
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
