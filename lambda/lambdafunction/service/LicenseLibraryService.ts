import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {ExcelEntity, LibraryEntity, LicenseCheker} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";
import {v4 as uuidv4} from 'uuid'
import axios, {AxiosRequestConfig} from "axios";

export interface LicenseLibraryService {
    createLicenseLibrary(event: APIGatewayProxyEvent)
    // getTeamListByName(teamName: string): Promise<ResponseTeamList[]>
    // getTeamNames(): Promise<string[]>
}

export class DefaultLicenseLibraryService extends BaseExcelFileExtractor implements LicenseLibraryService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.LICENSELIST)
    ){
        super()
    }

    async createLicenseLibrary(event: APIGatewayProxyEvent) {
        console.log('ここまでOK')
        const encodedFile = (await multipart.parse(event)).files[0]
        console.log('ここもOK')
        const jsonDataLists = this.jsonListsParser(encodedFile)
        // console.log({jsonDataLists})
        const tasks = jsonDataLists.map(async (data, index) => {
            const libraryName = data[LicenseCheker.LIBRARYNAME];
            const aliasName = data[LicenseCheker.ARIASNAME];
            const gitRepository = data[LicenseCheker.GITREPOSITORY];
            if (!gitRepository) return

            const extractRepositoryInformation = gitRepository.split('/').slice(3).join('/');
            console.log({ extractRepositoryInformation });
            let ownerYear = '';

            if (extractRepositoryInformation !== '') {
                const requestToGithub = `https://api.github.com/repos/${extractRepositoryInformation}/license`;
                console.log({ requestToGithub });

                try {
                    const getData = await axios.get<ResponseRepository>(requestToGithub).then(elm => elm.data);
                    if (getData.html_url) {
                        const getHtml = await axios.get<HTMLAllCollection>(getData.html_url).then(elm => elm.data);
                        const regex = /Copyright \(c\) (.*?)(?=\\|\"|$)/;
                        const match = getHtml.match(regex);
                        ownerYear = match ? match[1] : 'No match found';
                    }
                } catch (e) {
                    if (axios.isAxiosError(e) && e.response?.status === 404) {
                        console.log(`404 error for repository: ${extractRepositoryInformation}, skipping...`);
                        return; // Skip to the next iteration
                    }
                    console.error(`Error fetching license: ${e}`);
                    return; // Skip on error
                }
            }

            const putList: LibraryEntity = {
                id: uuidv4(),
                libraryName: libraryName,
                aliasName: aliasName,
                gitRepository: gitRepository,
                ownerYear: ownerYear
            };

            console.log({ index });
            console.log({ putList });

            await this.repository.putItem(putList);
        });

        await Promise.all(tasks);
    }

    // async getTeamListByName(teamName: string): Promise<ResponseTeamList[]> {
    //     const GSIReq: GSIQueryRequest = {
    //         indexName: TeamListGSI.teamIndexName,
    //         partitionKeyName: TeamListGSI.teamNamePK,
    //         partitionKeyValue: teamName
    //     }
    //     const teamEntities =  await this.teamListRepository.queryItemsByGSI(GSIReq) as TeamListEntity[]
    //     return await this.createResponseTeamList(teamEntities);
    // }
    //
    // private async createResponseTeamList(teamEntities: TeamListEntity[]) {
    //     const temporaryMemoryForAlias:TemporaryMemoryForAlias = {}
    //     const result: ResponseTeamList[] = []
    //     for (const teamEntity of teamEntities) {
    //         const aliasName = teamEntity.aliasName
    //         const GSIReq: GSIQueryRequest = {
    //             indexName: ApprovalListGSI.AliasIndexName,
    //             partitionKeyName: ApprovalListGSI.AliasNamePK,
    //             partitionKeyValue: aliasName
    //         }
    //         const isExistingMemoryForAlias = temporaryMemoryForAlias[aliasName] !== undefined
    //         const currentApprovalListRecords =
    //             isExistingMemoryForAlias? temporaryMemoryForAlias[aliasName] : (await this.approvalListRepository.queryItemsByGSI(GSIReq) as ExcelEntity[])
    //         const isLicenseExisting = currentApprovalListRecords.length !== 0
    //         const modifiedData: ResponseTeamList = {
    //             id: teamEntity.id,
    //             teamName: teamEntity.teamName,
    //             libraryName: teamEntity.libraryName,
    //             version: teamEntity.version,
    //             aliasName,
    //             licenseName: isLicenseExisting ? currentApprovalListRecords[0].licenseName : CheckResult.UNKNOWN,
    //             spdx: isLicenseExisting ? currentApprovalListRecords[0].spdx : '',
    //             originalUse: isLicenseExisting ? currentApprovalListRecords[0].originalUse : '',
    //         }
    //         result.push(modifiedData)
    //         temporaryMemoryForAlias[aliasName] = currentApprovalListRecords
    //     }
    //     return result
    // }
    //
    // async getTeamNames(): Promise<string[]> {
    //     const teamListRecords = await this.teamListRepository.scanParams() as TeamListEntity[]
    //     const teamNameLists = teamListRecords.map(teamListRecord => teamListRecord.teamName)
    //     const uniqueTeamName = [...new Set(teamNameLists)];
    //     return uniqueTeamName
    // }
    //
    // private async readCurrentLicense(teamName: string) {
    //     const GSIReq: GSIQueryRequest = {
    //         indexName: TeamListGSI.teamIndexName,
    //         partitionKeyName: TeamListGSI.teamNamePK,
    //         partitionKeyValue: teamName
    //     }
    //     return (await this.teamListRepository.queryItemsByGSI(GSIReq) as TeamListEntity[])
    // }
}

type TemporaryMemoryForAlias = {
    [key: string]: ExcelEntity[]
}

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