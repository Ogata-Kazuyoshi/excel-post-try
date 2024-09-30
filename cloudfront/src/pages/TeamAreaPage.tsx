import {VerticalNabs} from "../component/VerticalNabComponent.tsx";
import {TeamLicenseListComponent} from "../component/TeamLicenseListComponent.tsx";
import classes from "./TeamAreaComponent.module.scss"
import {DefaultTeamServise, TeamService} from "../servise/TeamService.ts";
import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import {selectedTeamState, teamNameListState} from "../recoil/RecoilStates.ts";

type Props = {
    teamService?: TeamService
}
export const TeamAreaPage = (
    {
        teamService = new DefaultTeamServise()
    }: Props
) => {

    const setTeamNameList = useSetRecoilState(teamNameListState)
    const setSelectedTeam = useSetRecoilState(selectedTeamState)


    useEffect(() => {
        teamService!.getTeamNames().then(res => {
            setTeamNameList(res)
            setSelectedTeam(res[0])
        })
    }, []);

    return <div className={classes.teamArea}>
        <VerticalNabs />
        <TeamLicenseListComponent />
    </div>
}    