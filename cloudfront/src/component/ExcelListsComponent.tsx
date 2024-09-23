import axios, {AxiosRequestConfig} from 'axios';
import classes from "./ExcelListsComponent.module.scss";
import {useState} from "react";
import {apiGateway} from "../config/ReadEnv.ts";
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2"
import _ from 'lodash'



export interface ExcelList {
    id: string
    LicenseName: string
    ShortIdentifier: string
    fullName: string
    spdx: string
    originalUse: string
    modified: string
}

export interface TableDisplay extends ExcelList {
    aliasName?: string
}

interface RequestBody {
    aliasName: string
    originalName: string
    originalId: string
}
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
            const res = await axios.get<ExcelList[]>(`${apiGateway}/api/lists`).then(elm => elm.data)
            const clone = _.cloneDeep(res)
            const sortedRes = clone.sort((a,b) => a.ShortIdentifier.localeCompare(b.ShortIdentifier))
            const aliasLists = await axios.get<RequestBody[]>(`${apiGateway}/api/aliases`).then(elm => elm.data)
            const displayLists: TableDisplay[] = sortedRes.map(elm => ({...elm, aliasName: undefined }))
            aliasLists.forEach(aliasList => {
                const targetIndex = displayLists.findIndex(displayList => displayList.id === aliasList.originalId)
                displayLists[targetIndex].aliasName = aliasList.aliasName
            })
            setExcelLists(displayLists)
        } catch (error) {
            console.error(error);
        } finally {
            Swal.close();
        }
    }

    const handleEditIcon = async (originalName: string, originalId: string) => {
        const { value: aliasName } = await Swal.fire({
            title: "読み替えライセンス名",
            input: "text",
            inputLabel: `ApprovalList(知財のエクセル) : ${originalName}`,
            showCancelButton: true,
        });
        if (aliasName) {
            const request: RequestBody = {
                aliasName,
                originalName,
                originalId
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
                <th>id</th>
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
                return (<tr key={excelList.id}>
                    <td>
                        <EditIcon
                            onClick={() => {handleEditIcon(excelList.ShortIdentifier, excelList.id)}}
                        />
                    </td>
                    <td>{excelList.id}</td>
                    <td>{excelList.LicenseName}</td>
                    <td>{excelList.ShortIdentifier}</td>
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