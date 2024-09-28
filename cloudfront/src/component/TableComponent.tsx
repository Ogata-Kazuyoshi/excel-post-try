import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useRecoilValue} from "recoil";
import {approvalListsState} from "../recoil/RecoilStates.ts";
import EditIcon from '@mui/icons-material/Edit';

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

export const TableComponent = () => {

    const approvalLists = useRecoilValue(approvalListsState)

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>EditIcon</StyledTableCell>
                        <StyledTableCell align="right">LicenseName</StyledTableCell>
                        <StyledTableCell align="right">ShortIdentifier</StyledTableCell>
                        <StyledTableCell align="right">aliasName</StyledTableCell>
                        <StyledTableCell align="right">fullName</StyledTableCell>
                        <StyledTableCell align="right">spdx</StyledTableCell>
                        <StyledTableCell align="right">originalUse</StyledTableCell>
                        <StyledTableCell align="right">modified</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {approvalLists.map((row) => (
                        <StyledTableRow key={row.licenseName}>
                            <StyledTableCell component="th" scope="row">
                                <EditIcon />
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.licenseName}</StyledTableCell>
                            <StyledTableCell align="right">{row.shortIdentifier}</StyledTableCell>
                            <StyledTableCell align="right">{row.aliasName}</StyledTableCell>
                            <StyledTableCell align="right">{row.fullName}</StyledTableCell>
                            <StyledTableCell align="right">{row.spdx}</StyledTableCell>
                            <StyledTableCell align="right">{row.originalUse}</StyledTableCell>
                            <StyledTableCell align="right">{row.modified}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
