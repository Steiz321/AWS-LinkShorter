
// Error docs types
export interface Unauthorized {
    StatusCode: 401;
    error: string;
    message: string;
}

export interface Forbidden {
    StatusCode: 403;
    error: string;
    message: string;
}

export interface Conflict {
    message: string;
    errorMsg: string;
    errStack: string;
}

export interface serverError {
    message: string;
    errorMsg: string;
    errStack: any;
}

// Links docs types
export interface ILink {
    linkId: string;
    userId: string;
    originalLink: string;
    shortedLink: string;
    oneTime: boolean;
    creationDate: string;
    expireDate: string;
    visits: number;
}

export interface myLinksResponse {
    StatusCode: 200;
    data: ILink[];
}

export type linkExpireTime = "one-time" | "1d" | "3d" | "7d";

export interface createLink {
    originalLink: string;
    expireTime: linkExpireTime;
}

export interface createLinkResponse {
    message: 'Successfully created a link',
    data: ILink
}

export interface deactivateLinkResponse {
    message: string;
    data: {
        deactivateLink: ILink;
    };
}

export interface reactiveLinkBody {
    expireTime: linkExpireTime;
}

export interface reactiveLinkResponse {
    message: string;
    data: {
        reactivatedLink: ILink;
    }
}


// Auth docs types
export interface IUser {
    userId: string;
    email: string;
    password: string;
}

export interface signUpBody {
    email: string;
    password: string;
}

export interface signUpResponse {
    message: string,
    data: {
        accessToken: string;
        refreshToken: string;
        user: signUpBody;
    }
}

export interface signInBody {
    email: string;
    password: string;
}

export interface signInResponse {
    message: string,
    data: {
        accessToken: string;
        refreshToken: string;
        user: signUpBody;
    }
}