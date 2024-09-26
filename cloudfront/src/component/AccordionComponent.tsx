import * as React from 'react';
import {styled} from '@mui/material/styles';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {AccordionSummaryProps,} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {DisplaySortedByAliasName} from "../pages/TeamLists.tsx";

const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type Props = {
    displaySortedByAliasName: DisplaySortedByAliasName[]
}
export default function CustomizedAccordions(
    {
        displaySortedByAliasName
    }: Props) {
    const [expanded, setExpanded] = React.useState<string | false>('');
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <div>
            {displaySortedByAliasName.map(displayAlias => {
                return (
                    <Accordion expanded={expanded === `${displayAlias.aliasName}`} onChange={handleChange(`${displayAlias.aliasName}`)} key={displayAlias.aliasName}>
                        <AccordionSummary aria-controls=" " id=" ">
                            <Typography>{`${displayAlias.aliasName} : ${displayAlias.spdx} : ${displayAlias.originalUse}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {displayAlias.displayLibraries.map(elm => {
                                return (
                                    <Typography key={elm}>
                                        {elm}
                                    </Typography>
                                )
                            })}
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </div>
    );
}