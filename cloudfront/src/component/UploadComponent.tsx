import {ReactNode, useState} from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import classes from "./UploadComponent.module.scss"

type Props = {
    handleFileUpload: (file: File | undefined)=> void
    children?: ReactNode
}

export const UploadComponent = (
    {
        handleFileUpload,
        children
    }: Props) => {
    const [file, setFile] = useState<File | undefined>(undefined);

    return (
        <div className={classes.uploadArea}>
            {children}
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                className={classes.uploadButtonArea}
            >
                Upload files
                <input
                    type="file"
                    onChange={(e) => {
                        if (e.target.files) {
                            setFile(e.target.files![0]);
                        }
                    }}
                    className={classes.inputTag}
                    multiple
                />
            </Button>
            <LoadingButton
                size="small"
                onClick={() => {handleFileUpload(file)}}
                endIcon={<SendIcon />}
                loadingPosition="end"
                variant="contained"
                className={classes.sendButtonArea}
            >
                Submit
            </LoadingButton>
        </div>
    );
}
