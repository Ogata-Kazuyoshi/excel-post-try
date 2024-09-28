import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {headers} from "../../config/dynamodbConfig"
import {DefaultTeamListService} from "../../service/TeamListService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const teamListService = new DefaultTeamListService()
        const teamList = await teamListService.getTeamNames()

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