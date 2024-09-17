export type TokenContents = {
    id: string,
    username: string
};

export enum Token {
    Access = 'access',
    Refresh = 'refresh'
};

export type TokenConfig = {
    secretEnvKey: string;
    expiresIn: string;
};
