export interface IConfigAuth {
    key: string;
}

export interface IConfigApi {
    baseUrl: string;
    auth: IConfigAuth;
}
