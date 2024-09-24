import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {headers} from "../config/dynamodbConfig"
import {DefaultApprovalListService} from "../service/ApprovalListService"
import multipart from "lambda-multipart-parser";
import path from "path";
import * as os from "os";
import * as fs from "fs";
import * as XLSX from "xlsx";
import {DefaultTeamListService} from "../service/TeamListService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const teamName = event.pathParameters?.teamName

        console.log({teamName})


        if (!teamName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'チーム名が指定されていません。' }),
            };
        }

        const teamListService = new DefaultTeamListService()
        await teamListService.resisterToDynamoDB(event, teamName)

        // const encodedFile = await multipart.parse(event)
        // const file = encodedFile.files.find(file => file.fieldname === 'file')
        // const tempFilePath = path.join(os.tmpdir(), file.filename);
        // fs.writeFileSync(tempFilePath, file.content);
        //
        // const workbook = XLSX.readFile(tempFilePath);
        // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        //
        // const jsonLists = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: true});



        //TeamLicenseTable
        //Primary : team名
        //sort key : ライブラリ名
        //ライセンスの使用可否のOK、NGを取ってくる
        // ogata-teamList
        // temaName
        // libraryName

        // fs.unlinkSync(tempFilePath);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify("teamListの登録"),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: `some error happened : ${err}`,
            }),
        };
    }
};