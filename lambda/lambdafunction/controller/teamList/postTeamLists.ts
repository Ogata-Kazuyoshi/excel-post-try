import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {headers} from "../../config/dynamodbConfig"
import {DefaultTeamListService} from "../../service/TeamListService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const teamName = event.pathParameters?.teamName

        if (!teamName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'チーム名が指定されていません。' }),
            };
        }

        const teamListService = new DefaultTeamListService()
        await teamListService.resisterToDynamoDB(event, teamName)

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