import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {headers} from "../config/dynamodbConfig"
import {DefaultApprovalListService} from "../service/ApprovalListService"
import multipart from "lambda-multipart-parser";
import path from "path";
import * as os from "os";
import * as fs from "fs";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const approvalListService = new DefaultApprovalListService()
        await approvalListService.resisterToDynamoDB(event)

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify('登録が完了しました'),
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