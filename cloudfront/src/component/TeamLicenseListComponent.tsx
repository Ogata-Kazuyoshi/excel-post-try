import {useRecoilValue, useSetRecoilState} from "recoil";
import {selectedTeamState, sortedByAliasListsState} from "../recoil/RecoilStates.ts";
import {DefaultTeamServise, TeamServise} from "../servise/TeamServise.ts";
import {AccordionComponent} from "./AccordionComponent.tsx";
import classes from "./TeamLicenseListComponent.module.scss"

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

    teamService!.getTeamLicenseList(selectedTeam).then(res => setSortedByAliasLists(res))
    return <>
        <div className={classes.teamLicenseArea}>
            <AccordionComponent />
        </div>
    </>
}