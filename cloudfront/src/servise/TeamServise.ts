import {DefaultTeamRepository} from "../repository/TeamRepository.ts";
import {
    AliasDetailFixture,
    DisplaySortedByAliasName,
    DisplaySortedByAliasNameFixture,
    SortByAliasName
} from "../model/TeamLicenceList.ts";

export interface TeamServise {
    getTeamNames(): Promise<string[]>
    getTeamLicenseList(teamName: string): Promise<DisplaySortedByAliasName[]>
}

export class DefaultTeamServise implements TeamServise {
    constructor(
        private teamRepository = new DefaultTeamRepository()
    ) {}

    async getTeamNames(): Promise<string[]> {
        return await this.teamRepository.getTeamNames()
    }

    async getTeamLicenseList(teamName: string): Promise<DisplaySortedByAliasName[]>{
        const teamLicenseRawLists = await this.teamRepository.getTeamLicenseRawLists(teamName)
        const sortByAliasName: SortByAliasName = {};
        const aliasNameLists: string[] = [];
        teamLicenseRawLists.forEach((elm) => {
            const aliasName = elm.aliasName;
            console.log({ aliasName });
            if (!sortByAliasName[aliasName]) {
                sortByAliasName[aliasName] = AliasDetailFixture.build({
                    licenseName: elm.licenseName,
                    version: elm.version,
                    spdx: elm.spdx,
                    originalUse: elm.originalUse,
                });
                aliasNameLists.push(aliasName);
            }
            sortByAliasName[aliasName].libraries.push(elm.libraryName);
        });
        const result = aliasNameLists.map((currentAliasName) => {
            const temp = DisplaySortedByAliasNameFixture.build({
                aliasName: currentAliasName,
                originalUse: sortByAliasName[currentAliasName].originalUse,
                spdx: sortByAliasName[currentAliasName].spdx,
                displayLibraries: sortByAliasName[currentAliasName].libraries,
            });
            return temp;
        });
        return result
    }
}