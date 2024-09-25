import {useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import Swal from "sweetalert2";
import {apiGateway} from "../config/ReadEnv.ts";
import {TeamListEntity} from "../model/RouteType.ts";
import classes from "../component/ExcelListsComponent.module.scss";

export const TeamLists = () => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [teamList, setTeamList] = useState<TeamListEntity[]>([])

    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    const handleFileUpload = async () => {
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we generate your music.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            if (!file) return;
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${apiGateway}/api/teamLists/personal`, formData, config)
            console.log({ res });

        } catch (error) {
            console.error(error);
        } finally {
            Swal.close();
        }

    };

    const teamListGet = async () => {
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we generate your music.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const res = await axios.get<TeamListEntity[]>(`${apiGateway}/api/teamLists/personal`).then(elm => elm.data)
            console.log({ res });
            setTeamList(res)
        } catch (error) {
            console.error(error);
        } finally {
            Swal.close();
        }

    }

    return <>
        <div>ここにはチームの情報が格納されます</div>
        <div>
            <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                    if (e.target.files) {
                        setFile(e.target.files![0]);
                    }
                }}
            />
            <button onClick={handleFileUpload}>
                チームのリストcsvをアップロード
            </button>
        </div>
        <div>
            <button onClick={teamListGet}>TeamListをゲットします</button>
        </div>
        <table className={classes.listTable}>
            <thead>
            <tr>
                <th>teamName</th>
                <th>libraryName</th>
                <th>version</th>
                <th>aliasName</th>
                <th>licenseName</th>
                <th>spdx</th>
                <th>originalUse</th>
            </tr>
            </thead>
            <tbody>
            {teamList.map(teamDetail => {
                return (<tr key={teamDetail.libraryName}>
                    <td>{teamDetail.teamName}</td>
                    <td>{teamDetail.libraryName}</td>
                    <td>{teamDetail.version}</td>
                    <td>{teamDetail.aliasName}</td>
                    <td>{teamDetail.licenseName}</td>
                    <td>{teamDetail.spdx}</td>
                    <td>{teamDetail.originalUse}</td>
                </tr>)
            })}
            </tbody>
        </table>
    </>
}