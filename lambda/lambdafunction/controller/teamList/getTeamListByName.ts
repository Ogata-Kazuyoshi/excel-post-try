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
        const teamList = await teamListService.getTeamListByName(teamName)

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(teamList),
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