import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from "../../config/dynamodbConfig";
import {RequestAliasChange} from "../../model/interface";
import {DefaultApprovalListService} from "../../service/ApprovalListService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body: RequestAliasChange = JSON.parse(event.body || '{}') ;
        const approvalListService = new DefaultApprovalListService()
        await approvalListService.createAliasRecord(body)

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(
                '登録しました'
            ),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
