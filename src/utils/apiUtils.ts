import { push } from 'react-router-redux';
import Redux from 'redux';
import PATH from '../constants/path';
import { HexaToken } from '../redux/domains/Auth';
import { readToken } from './authUtils';
import { isJsonString } from './jsonHelper';
require('dotenv').config()

export const NOT_REQUIRED = Symbol('NOT_REQUIRED');
export const SERVER_ERROR = Symbol('SERVER_ERROR');
export const UNAUTHORIZED = Symbol('UNAUTHORIZED');
export const NOT_FOUND = Symbol('NOT_FOUND');
export const FORBIDDEN = Symbol('FORBIDDEN');

const authorization = () => {
     const authUser = localStorage.getItem('token') ?? null;
     if (authUser && isJsonString(authUser))
         return (JSON.parse(authUser) as HexaToken).token;
     return authUser;
}

export interface IFetchOptions {
    state: any;
    url: string;
    options?: RequestInit;
    preFetch?: () => void;
    requireAuth?: boolean;
    responseType?: 'object' | 'text' | 'file';
}

export interface JsonErrorResponse {
    statusCode?: number;
    error?: string;
    message?: string;
}

export interface JsonResponse<T> extends JsonErrorResponse {
    data?: T;
}

export interface IResponseError {
    type?: symbol;
    message: string;
    responseBody?: any;
}

export const authFetch = async <T>({
    state,
    url,
    options = {},
    requireAuth = true,
    responseType = 'object'

}: IFetchOptions): Promise<T | JsonResponse<T> | Blob>  => {

    const requestOptions = requireAuth ? {...options,  headers: { ...options.headers,'Authorization': `Bearer ${authorization()}` }} : options
    const requestUrl = `${process.env.REACT_APP_API_URL}${url}`;
    const response: Response = await fetch(
        requestUrl,
        requestOptions
    );
    if (response.ok) {
        if(responseType === 'file'){
            return Promise.resolve(response.blob());
        }
        if(responseType === 'object') {
            const json: JsonResponse<T> = await response.json() ;
            return (Promise.resolve(json) as Promise<JsonResponse<T>>);
        } else {
            const text = await response.text();
            return Promise.resolve(text) as Promise<JsonResponse<T>>;
        }

    } else {

        if(response.status === 404 || response.status === 403 || response.status === 401)
            return Promise.reject(formatResponseError(response, {}));

        const json: JsonResponse<T> = await response.json();
        return Promise.reject(formatResponseError(response, json));
    }
};

const formatResponseError = (response: Response, responseBody: object) => {
    const error: IResponseError = {
        message: `Request failed in authFetch: ${JSON.stringify(response)}`,
        responseBody: responseBody
    };

    const status = response.status.toString();

    switch (true) {
        case /^5/.test(status):
            error.type = SERVER_ERROR;
            break;
        case /404/.test(status):
            error.type = NOT_FOUND;
            break;
        case /40(1|3)/.test(status):
            error.type = UNAUTHORIZED;
            break;
        default:
            error.type = SERVER_ERROR;
    }

    return error;
};

export interface IHandleErrorOptions {
    dispatch: Redux.Dispatch<Redux.Action>;
    NOT_REQUIRED?: (param: IResponseError) => void;
    NOT_FOUND?: (param: IResponseError) => void;
    UNAUTHORIZED?: (param: IResponseError) => void;
    SERVER_ERROR?: (param: IResponseError) => void;
    FORBIDDEN?: (param: IResponseError) => void;
}

export const handleError = (
    options: IHandleErrorOptions,
    error: IResponseError
) => {
    const { dispatch } = options;

    switch (error.type) {
        case NOT_REQUIRED:
            return options['NOT_REQUIRED']
                ? options['NOT_REQUIRED'](error)
                : console.debug(error.message);

        case NOT_FOUND:
            return options['NOT_FOUND']
                ? options['NOT_FOUND'](error)
                : dispatch(push('/404'));

        case UNAUTHORIZED:
            console.log(UNAUTHORIZED);
            if (options['UNAUTHORIZED']) {
                return options['UNAUTHORIZED'](error);
            }

            // Clarify that what type of user are loging on and redirect to the correct path.
            const token = readToken();
            localStorage.removeItem('token');
            localStorage.removeItem('contacts');
            if(token && (token.role === 'Admin' || token.role === 'Staff'))
                return window.location.pathname = PATH.ADMIN.LOGIN;

            return window.location.href = `${process.env.REACT_APP_MARKETING_URL}`

        case SERVER_ERROR:
            return options['SERVER_ERROR']
                ? options['SERVER_ERROR'](error)
                : console.error(error);

        case FORBIDDEN:
            return options['FORBIDDEN']
                ? options['FORBIDDEN'](error)
                : console.error(error);

        default:
            return options['SERVER_ERROR']
                ? options['SERVER_ERROR'](error)
                : console.error(error);
    }
};

export const extractErrors = (obj: any) => {
    let errors = '';
    if(typeof obj === 'string')
        return obj;

    const keys = Object.keys(obj);
    keys.forEach((key: string, i: number) => {

        if (Array.isArray(obj[key])) {
            errors += obj[key].join('|');
        } else {
            errors += obj[key];
        }

        if (i !== keys.length - 1)
            errors += '|';
    });

    return errors;
}
