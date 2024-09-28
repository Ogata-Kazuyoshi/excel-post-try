import {SyntheticEvent, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {Outlet, useNavigate} from "react-router-dom";
import {pathObject, RouteType} from "../model/RouteType.ts";
import "./LabelTabs.scss"


export const LabelTabs =() => {
    const [path, setPath] = useState<string>('1');
    const navigate = useNavigate()

    const handleChange = (_event: SyntheticEvent, pathValue: string) => {
        setPath(pathValue);
        navigate(`/app/${pathObject[pathValue]}`)
    };



    return (
        <>
            <Box sx={{width: '100%', typography: 'body1' }}>
                <TabContext value={path}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Lists" value={RouteType.LISTS} />
                            <Tab label="TeamLists" value={RouteType.TEAMS} />
                            <Tab label="Team-list" value={RouteType.TEAMLIST} />
                        </TabList>
                    </Box>
                </TabContext>
            </Box>
            <Outlet />
        </>
    );
}
