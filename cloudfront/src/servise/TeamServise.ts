import {DefaultTeamRepository} from "../repository/TeamRepository.ts";
import {DisplaySortedByAliasName, SortByAliasName} from "../model/TeamLicenceList.ts";
import {ResponceTeamRawList} from "../model/HttpInterface.ts";

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
        const {sortByAliasName, aliasNameLists} = this.createAliasLists(teamLicenseRawLists);
        return  aliasNameLists.map((currentAliasName) =>  ({
                aliasName: currentAliasName,
                licenseName: sortByAliasName[currentAliasName].licenseName,
                originalUse: sortByAliasName[currentAliasName].originalUse,
                spdx: sortByAliasName[currentAliasName].spdx,
                displayLibraries: sortByAliasName[currentAliasName].libraries,
            })
        )
    }

    private createAliasLists(teamLicenseRawLists: ResponceTeamRawList[]) {
        const sortByAliasName: SortByAliasName = {};
        const aliasNameLists: string[] = [];
        teamLicenseRawLists.forEach((teamLicenseRawList) => {
            const aliasName = teamLicenseRawList.aliasName;
            if (!sortByAliasName[aliasName]) {
                sortByAliasName[aliasName] = {
                    licenseName: teamLicenseRawList.licenseName,
                    version: teamLicenseRawList.version,
                    spdx: teamLicenseRawList.spdx,
                    originalUse: teamLicenseRawList.originalUse,
                    libraries: [teamLicenseRawList.libraryName]
                }
                aliasNameLists.push(aliasName);
            } else {
                sortByAliasName[aliasName].libraries.push(teamLicenseRawList.libraryName);
            }
        });
        return {sortByAliasName, aliasNameLists};
    }
}