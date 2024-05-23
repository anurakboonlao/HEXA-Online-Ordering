import createAction from './base.actions';
import { actionType as loggedUserAction } from './user.actions';


import { authFetch, handleError } from '../../utils/apiUtils';
import { readSubContacts, readToken } from '../../utils/authUtils';
import { SubContact, TokenPayload } from '../domains/Auth';
import PATH from '../../constants/path';
import { GlobalState } from '../reducers';

require('dotenv').config();

export const actionType = {
    LOGIN_REQUEST_LOGIN: 'LOGIN_REQUEST_LOGIN',
    LOGIN_RECEIVE_LOGIN: 'LOGIN_RECEIVE_LOGIN',
    LOGIN_RECEIVE_ERROR: 'LOGIN_RECEIVE_ERROR',
    LOGIN_REQUEST_LOGOUT: 'LOGIN_REQUEST_LOGOUT',
    LOGIN_REQUEST_ALIVE: 'LOGIN_REQUEST_ALIVE',
    LOGIN_RECEIVE_ALIVE: 'LOGIN_RECEIVE_ALIVE'
}

export const login = (username: string, password: string) => (dispatch: any, getState: any) => {

    dispatch(createAction(actionType.LOGIN_REQUEST_LOGIN));

    return authFetch({
        url: '/Account/login',
        state: getState(),
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'password',
                username: username,
                password: password,
                scope: ''
            })
        },
        requireAuth: false
    }).then(async (response: any) => {
        localStorage.setItem('token', JSON.stringify(response));
        localStorage.removeItem('contacts');

        const payload: TokenPayload | null = readToken();
        if (payload) {
            dispatch(createAction(loggedUserAction.USER_RECEIVER_USER, payload));
            dispatch(createAction(actionType.LOGIN_RECEIVE_LOGIN, payload));
        }
        else {
            dispatch(createAction(actionType.LOGIN_RECEIVE_ERROR, 'Token Unauthorized'));
        }

    }).catch(
        handleError.bind(null, {
            dispatch,
            UNAUTHORIZED: (error) => {
                // Display error message above login button
                dispatch(createAction(actionType.LOGIN_RECEIVE_ERROR, 'Username or password is not correct'));
            },
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.LOGIN_RECEIVE_ERROR, 'Login Error'));
            }
        })
    );
}

export const logout = () => (dispatch: any, getState: () => GlobalState) => {
    localStorage.removeItem('token');
    localStorage.removeItem('contacts');
    // dispatch(createAction(actionType.LOGIN_REQUEST_LOGOUT, null))
    // dispatch(createAction(loggedUserAction.USER_RECEIVER_LOGOUT, null))
    // Clarify that what type of user are loging on and redirect to the correct path.
    const authUser = getState().User;
    if (authUser.payload.role === 'Admin' || authUser.payload.role === 'Staff')
        window.location.pathname = PATH.ADMIN.LOGIN;
    else
        window.location.href = `${process.env.REACT_APP_MARKETING_URL}`;
}

export const getSubContact = (token: string) => (dispatch: any, getState: () => GlobalState) => {

    dispatch(createAction(actionType.LOGIN_REQUEST_ALIVE));
    return authFetch({
        url: '/Account/subcontact',
        state: getState(),
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        },
        requireAuth: false,
        responseType: 'text'
    }).then(response => {
        dispatch(createAction(actionType.LOGIN_RECEIVE_ALIVE, { valid: true, message: '' }));
        const subContact = (response as SubContact);
        // Issue token to loccal storage and rediect to h dashboard
        localStorage.setItem('token', JSON.stringify({ token: token }));
        if(subContact)
            localStorage.setItem('contacts', JSON.stringify(subContact));
        else
            localStorage.removeItem('contacts');
        const payload: TokenPayload | null = readToken();
        if (payload) {
            dispatch(createAction(loggedUserAction.USER_RECEIVER_USER, payload));
            dispatch(createAction(loggedUserAction.USER_RECEIVER_CONTACTS, readSubContacts()));
            dispatch(createAction(actionType.LOGIN_RECEIVE_LOGIN, payload));
        }
        else {
            dispatch(createAction(actionType.LOGIN_RECEIVE_ERROR, 'Token Unauthorized'));
        }

    }).catch(
        handleError.bind(null, {
            dispatch,
            UNAUTHORIZED: (error) => {
                // Display access denied and redirect back.
                dispatch(createAction(actionType.LOGIN_RECEIVE_ALIVE, {valid: false, message: 'Unauthorized, Please contact your administrator.'}));
            },
            SERVER_ERROR: (error) => {
                // Display error happen and create link back to app
                dispatch(createAction(actionType.LOGIN_RECEIVE_ALIVE, {valid: false, message: 'Something went wrong.'}));
            }
    }))
}