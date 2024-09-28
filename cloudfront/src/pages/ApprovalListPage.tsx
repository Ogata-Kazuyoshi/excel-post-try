import {TableComponent} from "../component/TableComponent.tsx";
import {ApprovalListServise, DefaultApprovalListServise} from "../servise/ApprovalListServise.ts";
import {useEffect} from "react";
import {approvalListsState} from "../recoil/RecoilStates.ts";
import {useSetRecoilState} from "recoil";
import classes from "./ApprovalListPage.module.scss"

type Props = {
    approvalListService?: ApprovalListServise
}
export const ApprovalListPage = (
    {
        approvalListService = new DefaultApprovalListServise()
    }: Props) => {
    const setApprovalLists = useSetRecoilState(approvalListsState)

    useEffect(() => {
        approvalListService?.getApprovalListTable().then(res => {setApprovalLists(res)})
    }, []);

    return <div className={classes.approvalTableArea}>
        <TableComponent />
    </div>
}