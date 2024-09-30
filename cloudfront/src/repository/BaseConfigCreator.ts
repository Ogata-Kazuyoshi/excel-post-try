import {ConfigType} from "../model/RepositoryInterface.ts";
import {AxiosRequestConfig} from "axios";

export interface ConfigCreator {
    getConfig(configType: ConfigType): AxiosRequestConfig
}

export abstract class BaseConfigCreator implements ConfigCreator {
    getConfig(configType: ConfigType): AxiosRequestConfig {
        return {
            headers: {
                'Content-Type': configType
            }
        }
    }
}