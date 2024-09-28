import {useRecoilState, useRecoilValue} from "recoil";
import {selectedTeamState, sortedByAliasListsState} from "../recoil/RecoilStates.ts";
import {DefaultTeamServise, TeamServise} from "../servise/TeamServise.ts";
import CustomizedAccordions from "./AccordionComponent.tsx";

type Props = {
    teamService?: TeamServise
}

export const TeamLicenseListComponent = (
    {
        teamService = new DefaultTeamServise()
    }: Props
) => {
    const [sortedByAliasLists,setSortedByAliasLists] = useRecoilState(sortedByAliasListsState)
    const selectedTeam = useRecoilValue(selectedTeamState)

    const sortByAliasName = async () => {
        const sortedLists = await teamService!.getTeamLicenseList(selectedTeam)
        setSortedByAliasLists(sortedLists)
    }
    sortByAliasName()
    return <>
        <div>
            <CustomizedAccordions displaySortedByAliasName={sortedByAliasLists} />
        </div>
    </>
}