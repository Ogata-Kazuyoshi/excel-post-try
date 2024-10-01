import {SyntheticEvent, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {selectedTeamState, teamNameListState} from "../recoil/RecoilStates.ts";
import "./HeaderComponent.scss"


export const VerticalNabs =() => {
    const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

    const teamNameLists = useRecoilValue(teamNameListState)
    const setSelectedTeam = useSetRecoilState(selectedTeamState)

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setSelectedTeamIndex(newValue);
        setSelectedTeam(teamNameLists[newValue])
    };

    return (
        <Box
            sx={{ bgcolor: 'background.paper', display: 'flex' }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={selectedTeamIndex}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {teamNameLists.map(temaName => {
                    return (
                        <Tab label={temaName} key={temaName}/>
                    )
                })}
            </Tabs>
        </Box>
    );
}
