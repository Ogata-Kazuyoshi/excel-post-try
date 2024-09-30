import * as React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useRecoilValue} from "recoil";
import {approvalListsState} from "../recoil/RecoilStates.ts";
import EditIcon from '@mui/icons-material/Edit';
import {CustomButton} from "./CustomButton.tsx";
import Swal from "sweetalert2";
import {RequestUpdateAliasName} from "../model/HttpInterface.ts";
import {ApprovalListService, DefaultApprovalListServise} from "../servise/ApprovalListService.ts";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

type Props = {
    approvalListService?: ApprovalListService
}

export const TableComponent = (
    {
        approvalListService = new DefaultApprovalListServise()
    }: Props
) => {

    const approvalLists = useRecoilValue(approvalListsState)

    const onClickCustomButtonClosure =  (licenseName: string) => {
        return async () => {
            const { value: aliasName } = await Swal.fire({
                title: "読み替えライセンス名",
                input: "text",
                inputLabel: `ApprovalList(知財のエクセル) : ${licenseName}`,
                showCancelButton: true,
            });
            if (aliasName) {
                const request: RequestUpdateAliasName = {
                    aliasName,
                    licenseName
                }
                Swal.fire(`読み替えマスターに登録します ${aliasName}`);
                const res = await approvalListService!.registerAliasName(request)
                console.log({res})
            }
        }
    }

    const onClickEditButton = async (licenseName: string, aliasNameArg: string) => {

        const { value: aliasName } = await Swal.fire({
            title: "修正",
            input: "text",
            inputLabel: `${licenseName}`,
            text: aliasNameArg,
            showCancelButton: true,
        });
        if (aliasName) {
            const request: RequestUpdateAliasName = {
                aliasName,
                licenseName
            }
            Swal.fire(`読み替えマスターを更新します :  ${aliasName}`);
            const res = await approvalListService!.updateAliasName(request)
            console.log({res})
        }

    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="right">LicenseName</StyledTableCell>
                        <StyledTableCell align="right">ShortIdentifier</StyledTableCell>
                        <StyledTableCell align="right">aliasName</StyledTableCell>
                        <StyledTableCell align="right">spdx</StyledTableCell>
                        <StyledTableCell align="right">originalUse</StyledTableCell>
                        <StyledTableCell align="right">modified</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {approvalLists.map((approvalList) => (
                        <StyledTableRow key={approvalList.licenseName}>
                            <StyledTableCell align="right">{approvalList.licenseName}</StyledTableCell>
                            <StyledTableCell align="right">{approvalList.shortIdentifier}</StyledTableCell>
                            <StyledTableCell align="right">
                                {approvalList.aliasName ?
                                    <div>
                                        <p>{approvalList.aliasName}</p>
                                        <EditIcon onClick={() => {onClickEditButton(approvalList.licenseName, approvalList.aliasName!)}}/>
                                    </div>
                                    :
                                    <CustomButton
                                        onClick={onClickCustomButtonClosure(approvalList.licenseName)}
                                    >
                                        登録する
                                    </CustomButton>
                                }
                            </StyledTableCell>
                            <StyledTableCell align="right">{approvalList.spdx}</StyledTableCell>
                            <StyledTableCell align="right">{approvalList.originalUse}</StyledTableCell>
                            <StyledTableCell align="right">{approvalList.modified}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
