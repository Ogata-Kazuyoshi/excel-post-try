import {UploadComponent} from "../component/UploadComponent.tsx";
import Swal from "sweetalert2";
import {ApprovalListServise, DefaultApprovalListServise} from "../servise/ApprovalListServise.ts";
import {useState} from "react";
import {ExcelType} from "../model/ApprovalListInterface.ts";
import classes from "./UpdateListsPage.module.scss"


type Props = {
    approvalListService?: ApprovalListServise
}

export const UpdateListsPage = (
    {
        approvalListService = new DefaultApprovalListServise()
    }:Props
) => {
    const [teamName, setTeamName] = useState('')
    const handleFileUpload = (type: ExcelType, teamName?: string) => {
        return async (file: File | undefined) => {
            Swal.fire({
                title: 'Loading...',
                text: 'Please wait ...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                if (!file) {
                    alert('エクセルファイルを選択してください')
                    return
                }
                const unSatisfiedConditionForPost = type === ExcelType.LICENSEFINDER && teamName === ''
                if (unSatisfiedConditionForPost) {
                    alert('チーム名を入力してください')
                    return
                }
                const formData = new FormData();
                formData.append('file', file);
                const isApprovalList = type === ExcelType.APPROVALLIST
                const res =
                    isApprovalList ? await approvalListService?.resisterApprovalList(formData):
                        await approvalListService?.resisterAliasRecord(formData, teamName!)
                console.log({ res });
            } catch (error) {
                console.error(error);
            } finally {
                Swal.close();
            }
        };
    }
    return <div className={classes.updateArea}>
        <div>
            <div>
                <h1>Approvalリスト</h1>
                <UploadComponent handleFileUpload={handleFileUpload(ExcelType.APPROVALLIST)}/>
            </div>
            <div>
                <h1>各チームのライセンスリスト</h1>
                <UploadComponent handleFileUpload={handleFileUpload(ExcelType.LICENSEFINDER, teamName)}>
                    <div className={classes.teamNameInputArea}>
                        <label >チーム名 : </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => {setTeamName(e.target.value)}}
                        />
                    </div>
                </UploadComponent>

            </div>
        </div>
    </div>
}    