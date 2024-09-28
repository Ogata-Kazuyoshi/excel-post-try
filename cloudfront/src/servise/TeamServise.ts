import {DefaultTeamRepository} from "../repository/TeamRepository.ts";
import {DisplaySortedByAliasName} from "../model/TeamLicenceList.ts";

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
        console.log({teamName})
        console.log({teamLicenseRawLists})
        return Promise.resolve([]);
    }



}