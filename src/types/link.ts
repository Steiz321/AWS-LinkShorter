export enum linkExpireTime {
    oneTime = "one-time",
    oneDay = "1d",
    threeDays = "3d",
    sevenDays = "7d"
}

export interface ILink {
    linkId: string;
    userId: string;
    originalLink: string;
    shortedLink: string;
    oneTime: boolean;
    creationDate: string;
    expireDate: string;
    isActive: boolean;
    visits: number;
}

export interface ICreateLink {
    originalLink: string;
    expireTime: linkExpireTime;
}

export interface IReactiveLink {
    expireTime: linkExpireTime;
}