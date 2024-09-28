import {useRecoilValue, useSetRecoilState} from "recoil";
import {selectedTeamState, sortedByAliasListsState} from "../recoil/RecoilStates.ts";
import {DefaultTeamServise, TeamServise} from "../servise/TeamServise.ts";
import {useState} from "react";
import {DisplaySortedByAliasName} from "../model/TeamLicenceList.ts";

type Props = {
    teamService?: TeamServise
}

export const TeamLicenseListComponent = (
    {
        teamService = new DefaultTeamServise()
    }: Props
) => {
    const setSortedByAliasLists = useSetRecoilState(sortedByAliasListsState)
    const selectedTeam = useRecoilValue(selectedTeamState)

    console.log("ここは何回")
    const sortByAliasName = async () => {
        const sortedLists = await teamService!.getTeamLicenseList(selectedTeam)
        setSortedByAliasLists(sortedLists)
    }
    sortByAliasName()
    return <>
        <div>{selectedTeam}</div>
    </>
}