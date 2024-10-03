import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from "../config/dynamodbConfig";
import axios from "axios";

interface ResponseRepository  {
    name:string,
    path:string,
    sha:string,
    size:string,
    url:string,
    html_url:string,
    git_url:string,
    download_url:string,
    type:string,
}

export const lambdaHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('導通確認のためのエンドポイントいずれ消す')
        const requestUrl = 'https://github.com/mui/material-ui'
        // const requestUrl = 'https://github.com/sindresorhus/yocto-queue'
        // const requestUrl = 'https://github.com/eslint-community/regexpp'
        const extractRepositoryInformation = requestUrl.split('/').slice(3).join('/')
        const requestToGithub = `https://api.github.com/repos/${extractRepositoryInformation}/license`

        // const getData = await axios.get('https://api.github.com/repos/juliangruber/balanced-match/contents/LICENSE.md?ref=master').then(elm => elm.data)
        // const getData = await axios.get<HTMLAllCollection>('https://github.com/juliangruber/balanced-match/blob/master/LICENSE.md').then(elm => elm.data)
        const getData = await axios.get<ResponseRepository>(requestToGithub).then(elm => elm.data)
        const getHtml = await axios.get<HTMLAllCollection>(getData.html_url).then(elm => elm.data)
        // const getData = await axios.get<HTMLAllCollection>('https://github.com/sindresorhus/yocto-queue?tab=MIT-1-ov-file').then(elm => elm.data)

        const regex = /Copyright \(c\) (.*?)(?=\\|\"|$)/;
        const match = getHtml.match(regex);
        const extractedText = match ? match[1] : 'No match found';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ extractedText }),
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
