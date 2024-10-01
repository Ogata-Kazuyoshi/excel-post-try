import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import {useRecoilValue} from "recoil";
import {sortedByAliasListsState} from "../recoil/RecoilStates.ts";
import classes from "./AccordingComponent.module.scss"
import {ApprovalColorName} from "../model/TeamLicenceList.ts";
import {SyntheticEvent, useState} from "react";

export const AccordionComponent = () => {
    const [expanded, setExpanded] = useState<string | false>('');
    const displaySortedByAliasName = useRecoilValue(sortedByAliasListsState)
    const handleChange =
        (panel: string) => (_event: SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <div>
            {displaySortedByAliasName.map(displayAlias => {
                return (
                    <MuiAccordion expanded={expanded === `${displayAlias.aliasName}`} onChange={handleChange(`${displayAlias.aliasName}`)} key={`${displayAlias.aliasName}-${displayAlias.licenseName}`}>
                        <MuiAccordionSummary className={`${classes.summaryArea} ${checkApprovalColor(displayAlias.originalUse)}`}>
                            <div className={classes.summaryText}>
                                {`${displayAlias.aliasName} : ${displayAlias.licenseName} : ${displayAlias.spdx} : ${displayAlias.originalUse}`}
                            </div>
                        </MuiAccordionSummary>
                            {displayAlias.displayLibraries.map((library, i) => {
                                return (
                                    <div key={`${library}-${i}`}>
                                        {library}
                                    </div>
                                )
                            })}
                    </MuiAccordion>
                )
            })}
        </div>
    );
}
const checkApprovalColor = (originalUse: string): string => {
    switch (originalUse) {
        case ApprovalColorName.OK:
            return classes.approvalStatusOK
        case ApprovalColorName.OKASTA:
            return classes.approvalStatusOKAsta
        case ApprovalColorName.NEEDSTUDY:
            return classes.approvalStatusNeedStudy
        case ApprovalColorName.UNKNOWN:
            return classes.approvalStatusNoExisting
        default:
            return ''
    }
}