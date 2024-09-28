import axios, { AxiosRequestConfig } from 'axios'

export interface Http {
    get<R> (url: string): Promise<R>
    post<B, R> (url: string, requestBody: B, config?: AxiosRequestConfig): Promise<R>
}

export class DefaultHttp implements Http {

    async get<R> (url: string): Promise<R> {
        return await axios.get(url).then(res => res.data)
    }

    async post<B, R> (url: string, requestBody: B, config?: AxiosRequestConfig): Promise<R> {
        return await axios
            .post(url, requestBody, config)
            .then((res) => res.data)
    }
}
