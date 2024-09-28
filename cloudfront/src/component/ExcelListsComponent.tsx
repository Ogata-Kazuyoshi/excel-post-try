import axios, {AxiosRequestConfig} from 'axios';
import classes from "./ExcelListsComponent.module.scss";
import {useState} from "react";
import {apiGateway} from "../config/ReadEnv.ts";
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2"
import _ from 'lodash'
import {ResponseAliasList, ResponseApprovalList, TableDisplay} from "../model/HttpInterface.ts";






const config: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export const ExcelListsComponent = () => {
    const [excelLists, setExcelLists] = useState<TableDisplay[]>([])

    const handleListsGet = async () => {
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we generate your music.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await axios.get<ResponseApprovalList[]>(`${apiGateway}/api/lists`).then(elm => elm.data)
            const clone = _.cloneDeep(res)
            const sortedRes = clone.sort((a,b) => a.shortIdentifier.localeCompare(b.shortIdentifier))
            const aliasLists = await axios.get<ResponseAliasList[]>(`${apiGateway}/api/aliases`).then(elm => elm.data)
            const displayLists: TableDisplay[] = sortedRes.map(elm => ({...elm, aliasName: undefined }))
            aliasLists.forEach(aliasList => {
                const targetIndex = displayLists.findIndex(displayList => displayList.licenseName === aliasList.originalName)
                displayLists[targetIndex].aliasName = aliasList.aliasName
            })
            setExcelLists(displayLists)
        } catch (error) {
            console.error(error);
        } finally {
            Swal.close();
        }
    }

    const handleEditIcon = async (originalName: string) => {
        const { value: aliasName } = await Swal.fire({
            title: "読み替えライセンス名",
            input: "text",
            inputLabel: `ApprovalList(知財のエクセル) : ${originalName}`,
            showCancelButton: true,
        });
        if (aliasName) {
            const request: ResponseAliasList = {
                aliasName,
                originalName,
            }
            Swal.fire(`読み替えマスターに登録します ${aliasName}`);
            // const res = await axios.post(`http://localhost:3000/api/aliases`, request, config)
            const res = await axios.post(`${apiGateway}/api/aliases`, request, config)
            console.log({res})
        }
    }

    return <>
        <div>
            <button
                onClick={handleListsGet}
            >
                ListsGetButton
            </button>
        </div>
        <table className={classes.listTable}>
            <thead>
            <tr>
                <th>EditIcon</th>
                <th>LicenseName</th>
                <th>ShortIdentifier</th>
                <th>aliasName</th>
                <th>fullName</th>
                <th>spdx</th>
                <th>originalUse</th>
                <th>modified</th>
            </tr>
            </thead>
            <tbody>
            {excelLists.map(excelList => {
                return (<tr key={excelList.licenseName}>
                    <td>
                        <EditIcon
                            onClick={() => {handleEditIcon(excelList.licenseName)}}
                        />
                    </td>
                    <td>{excelList.licenseName}</td>
                    <td>{excelList.shortIdentifier}</td>
                    <td>{excelList.aliasName}</td>
                    <td>{excelList.fullName}</td>
                    <td>{excelList.spdx}</td>
                    <td>{excelList.originalUse}</td>
                    <td>{excelList.modified}</td>
                </tr>)
            })}
            </tbody>
        </table>
    </>
}