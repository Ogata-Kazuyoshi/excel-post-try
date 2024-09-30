import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from "../../config/dynamodbConfig";
import {AliasEntity} from "../../model/interface";
import {DefaultAliasService} from "../../service/AliasService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body: AliasEntity = JSON.parse(event.body || '{}') ;
        console.log({body})
        const aliasService = new DefaultAliasService()
        const res = await aliasService.updateAliasRecord(body)

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(
                res
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
