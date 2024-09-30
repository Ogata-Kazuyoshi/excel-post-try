import {TableComponent} from "../component/TableComponent.tsx";
import {ApprovalListService, DefaultApprovalListServise} from "../servise/ApprovalListService.ts";
import {useEffect} from "react";
import {approvalListsState} from "../recoil/RecoilStates.ts";
import {useSetRecoilState} from "recoil";
import classes from "./ApprovalListPage.module.scss"

type Props = {
    approvalListService?: ApprovalListService
}
export const ApprovalListPage = (
    {
        approvalListService = new DefaultApprovalListServise()
    }: Props) => {
    const setApprovalLists = useSetRecoilState(approvalListsState)

    useEffect(() => {
        approvalListService?.getApprovalList().then(res => {setApprovalLists(res)})
    }, []);

    return <div className={classes.approvalTableArea}>
        <TableComponent />
    </div>
}