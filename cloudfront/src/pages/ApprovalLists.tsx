import axios, {AxiosRequestConfig} from "axios";
import {apiGateway} from "../config/ReadEnv.ts";
import {ExcelListsComponent} from "../component/ExcelListsComponent.tsx";
import {useState} from "react";
import Swal from "sweetalert2";

export const ApprovalLists = () => {
    const [file, setFile] = useState<File | undefined>(undefined);

    console.log({apiGateway})



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
            const res = await axios.post(`${apiGateway}/api/lists`, formData, config);
            // const res = await axios.post(`http://localhost:3000/api/excel`, formData, config);
            // const res = await axios.post("https://ogata-api.handson.toro.toyota/Prod/api/excel", formData, config);
            // const res = await axios.post("https://5jsxr20bkc.execute-api.ap-northeast-1.amazonaws.com/Prod/api/excel", formData, config);
            console.log({ res });
        } catch (error) {
            console.error(error);
        } finally {
            Swal.close();
        }

    };




    return <>
        <div>
            <div>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => {
                        if (e.target.files) {
                            setFile(e.target.files![0]);
                        }
                    }}
                />
                <button onClick={handleFileUpload}>
                    エクセルファイルをアップロード
                </button>
            </div>
        </div>
        <div>
            <div>Getメソッドの導通確認</div>
            <button
                onClick={async () => {
                    const res = await axios.get(`${apiGateway}/api/users`);
                    console.log({res});
                }}
            ></button>
        </div>
        <ExcelListsComponent/></>
}