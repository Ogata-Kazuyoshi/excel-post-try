import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from "../config/dynamodbConfig";
import {DefaultApprovalListService} from "../service/ApprovalListService";

export const lambdaHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const approvalListService = new DefaultApprovalListService()
        const excelList = await approvalListService.readAllData()

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(excelList),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `some error happened : ${err}`,
            }),
        };
    }
};
