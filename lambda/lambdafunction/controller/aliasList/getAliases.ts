import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from "../../config/dynamodbConfig";
import {DefaultAliasService} from "../../service/AliasService";

export const lambdaHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const aliasService = new DefaultAliasService()
        const aliases = await aliasService.readAllData()

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(aliases),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
