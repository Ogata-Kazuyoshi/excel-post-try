export interface DisplaySortedByAliasName {
    aliasName: string;
    originalUse: string;
    spdx: string;
    displayLibraries: string[];
}

export interface TeamRawList {
    teamName: string
    libraryName: string
    version: string
    aliasName: string
    licenseName: string
    spdx: string
    originalUse: string
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