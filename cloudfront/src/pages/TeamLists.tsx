import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { apiGateway } from '../config/ReadEnv.ts';
import { TeamListEntity } from '../model/RouteType.ts';
import classes from '../component/ExcelListsComponent.module.scss';
import CustomizedAccordions from '../component/AccordionComponent.tsx';

export interface AliasDetail {
  licenseName: string;
  version: string;
  spdx: string;
  originalUse: string;
  libraries: string[];
}
export interface SortByAliasName {
  [key: string]: AliasDetail;
}

export interface DisplaySortedByAliasName {
  aliasName: string;
  originalUse: string;
  spdx: string;
  displayLibraries: string[];
}

export const TeamLists = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [teamList, setTeamList] = useState<TeamListEntity[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('personal');
  const [displaySortedByAliasName, setDisplaySortedByAliasName] = useState<
    DisplaySortedByAliasName[]
  >([]);
  const [isShowAccordion, setIsShowAccordion] = useState(false);

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const handleFileUpload = async () => {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we generate your music.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(
        `${apiGateway}/api/teamLists/personal`,
        formData,
        config
      );
      console.log({ res });
    } catch (error) {
      console.error(error);
    } finally {
      Swal.close();
    }
  };

  const teamListGet = async () => {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we generate your music.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const res = await axios
        .get<TeamListEntity[]>(`${apiGateway}/api/teamLists/personal`)
        .then((elm) => elm.data);
      console.log({ res });
      setTeamList(res);

      const sortByAliasName: SortByAliasName = {};
      const aliasNameLists: string[] = [];
      res.forEach((elm) => {
        const aliasName = elm.aliasName;
        console.log({ aliasName });
        if (!sortByAliasName[aliasName]) {
          sortByAliasName[aliasName] = AliasDetailFixture.build({
            licenseName: elm.licenseName,
            version: elm.version,
            spdx: elm.spdx,
            originalUse: elm.originalUse,
          });
          aliasNameLists.push(aliasName);
        }
        sortByAliasName[aliasName].libraries.push(elm.libraryName);
      });
      const result = aliasNameLists.map((currentAliasName) => {
        const temp = DisplaySortedByAliasNameFixture.build({
          aliasName: currentAliasName,
          originalUse: sortByAliasName[currentAliasName].originalUse,
          spdx: sortByAliasName[currentAliasName].spdx,
          displayLibraries: sortByAliasName[currentAliasName].libraries,
        });
        return temp;
      });
      console.log({ result });
      setDisplaySortedByAliasName(result);
      setIsShowAccordion(true);
    } catch (error) {
      console.error(error);
    } finally {
      Swal.close();
    }
  };

  return (
    <>
      {isShowAccordion && (
        <CustomizedAccordions
          displaySortedByAliasName={displaySortedByAliasName}
        />
      )}
      <div>ここにはチームの情報が格納されます</div>
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files![0]);
            }
          }}
        />
        <button onClick={handleFileUpload}>
          チームのリストcsvをアップロード
        </button>
      </div>
      <div>
        <button onClick={teamListGet}>TeamListをゲットします</button>
      </div>
      <table className={classes.listTable}>
        <thead>
          <tr>
            <th>teamName</th>
            <th>libraryName</th>
            <th>version</th>
            <th>aliasName</th>
            <th>licenseName</th>
            <th>spdx</th>
            <th>originalUse</th>
          </tr>
        </thead>
        <tbody>
          {teamList.map((teamDetail) => {
            return (
              <tr key={teamDetail.libraryName}>
                <td>{teamDetail.teamName}</td>
                <td>{teamDetail.libraryName}</td>
                <td>{teamDetail.version}</td>
                <td>{teamDetail.aliasName}</td>
                <td>{teamDetail.licenseName}</td>
                <td>{teamDetail.spdx}</td>
                <td>{teamDetail.originalUse}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const createLibrariesText = (libraries: string[]) => {
  return libraries.join('<br/>');
};

export class AliasDetailFixture {
  static build(overrides: Partial<AliasDetail> = {}): AliasDetail {
    return {
      licenseName: '',
      version: '',
      spdx: '',
      originalUse: '',
      libraries: [],
      ...overrides,
    };
  }
}

export class DisplaySortedByAliasNameFixture {
  static build(
    overrides: Partial<DisplaySortedByAliasName> = {}
  ): DisplaySortedByAliasName {
    return {
      aliasName: '',
      originalUse: '',
      spdx: '',
      displayLibraries: '',
      ...overrides,
    };
  }
}
