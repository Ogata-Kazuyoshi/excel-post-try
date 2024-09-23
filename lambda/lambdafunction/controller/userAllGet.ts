import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from "../config/dynamodbConfig";

export const lambdaHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('導通確認のためのエンドポイントいずれ消す')
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify('届いてます!!!!!!!'),
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
