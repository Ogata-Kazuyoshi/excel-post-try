import {useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import Swal from "sweetalert2";
import {apiGateway} from "../config/ReadEnv.ts";

export const TeamLists = () => {
    const [file, setFile] = useState<File | undefined>(undefined);

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
            const res = await axios.post(`${apiGateway}/api/teamLists/personal`, formData, config);
            console.log({ res });
        } catch (error) {
            console.error(error);
        } finally {
            Swal.close();
        }

    };

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
    </>
}