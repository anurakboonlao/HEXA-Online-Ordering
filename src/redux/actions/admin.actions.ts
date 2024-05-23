import { toast } from "react-toastify";
import { userManagement } from "../../constants/userManagement";

import { authFetch, extractErrors, handleError } from '../../utils/apiUtils';
import { dateToInterFormat } from '../../utils/converter';
import { IDashboardModel } from '../domains/Dashboard';
import createAction from './base.actions';


export const actionType = {
    ADMIN_REQUEST_GET_USERS: 'ADMIN_REQUEST_GET_USERS',
    ADMIN_RECEIVE_GET_USERS: 'ADMIN_RECEIVE_GET_USERS',
    ADMIN_RECEIVE_GET_USERS_ERROR: 'ADMIN_RECEIVE_GET_USERS_ERROR',
    ADMIN_REQUEST_ADD_USER : 'ADMIN_REQUEST_ADD_USER',
    ADMIN_RECEIVE_ADD_USER : 'ADMIN_RECEIVE_ADD_USER',
    ADMIN_REQUEST_EDIT_USER : 'ADMIN_REQUEST_EDIT_USER',
    ADMIN_RECEIVE_EDIT_USER : 'ADMIN_RECEIVE_EDIT_USER',
    ADMIN_REQUEST_DELETE_USER : 'ADMIN_REQUEST_DELETE_USER',
    ADMIN_RECEIVE_DELETE_USER : 'ADMIN_RECEIVE_DELETE_USER',

    ADMIN_REQUEST_FILTER_DASHBOARD: 'ADMIN_REQUEST_FILTER_DASHBOARD',
    ADMIN_RECEIVE_FILTER_DASHBOARD: 'ADMIN_RECEIVE_FILTER_DASHBOARD',
    ADMIN_RECEIVE_FILTER_DASHBOARD_ERROR: 'ADMIN_RECEIVE_FILTER_DASHBOARD_ERROR',
}

export const getUserList = () => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADMIN_REQUEST_GET_USERS));
    return authFetch({
        url: '/adminuser/GetAdminUser',
        state: getState(),
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        },
        requireAuth: true
    }).then(response => {
        dispatch(createAction(actionType.ADMIN_RECEIVE_GET_USERS, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                let errorMessage = error?.responseBody?.message;
                if (error?.responseBody?.errors) {
                    errorMessage = extractErrors(error?.responseBody?.errors);
                }
                if (errorMessage === "")
                    errorMessage = error.message;
                dispatch(createAction(actionType.ADMIN_RECEIVE_GET_USERS_ERROR, { success: false, message: errorMessage}));
            }          
        })
    );
}

export const addUser = (userManagementInput:userManagement) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADMIN_REQUEST_ADD_USER));
    return authFetch({
        url: '/adminuser/adduser',
        state: getState(),
        options: {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({
                username: userManagementInput.username,
                name: userManagementInput.name,
                userRoleId: userManagementInput.userRoleId,
                password: userManagementInput.password,
                confirmPassword: userManagementInput.confirmPassword
            })
        },
        requireAuth: true
    }).then(response => {
        dispatch(createAction(actionType.ADMIN_RECEIVE_ADD_USER, {success: true, message: ""}));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                let errorMessage = error?.responseBody?.message;
                if (error?.responseBody?.errors) {
                    errorMessage = extractErrors(error?.responseBody?.errors);
                }
                if (errorMessage === "")
                    errorMessage = error.message;
                if(!errorMessage)
                    errorMessage = "server error";
                dispatch(createAction(actionType.ADMIN_RECEIVE_ADD_USER, { success: false, message: errorMessage}));
            },

            

        })
    );
}

export const editUser = (userManagementInput:userManagement) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADMIN_REQUEST_EDIT_USER));
    return authFetch({
        url: '/adminuser/updateuser',
        state: getState(),
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({
                userId: userManagementInput.userId,
                username: userManagementInput.username,
                name: userManagementInput.name,
                userRoleId: userManagementInput.userRoleId,
                password: userManagementInput.password,
                confirmPassword: userManagementInput.confirmPassword
            })
        },
        requireAuth: true
    }).then(response => {
        dispatch(createAction(actionType.ADMIN_RECEIVE_EDIT_USER, {success: true, message: ""}));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                let errorMessage = error?.responseBody?.message;
                if (error?.responseBody?.errors) {
                    errorMessage = extractErrors(error?.responseBody?.errors);
                }

                if (errorMessage === "")
                    errorMessage = error.message;
                dispatch(createAction(actionType.ADMIN_RECEIVE_EDIT_USER, { success: false, message: errorMessage}));
            }
        })
    );
}

export const deleteUser = (userId:number) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADMIN_REQUEST_DELETE_USER));
    return authFetch({
        url: '/adminuser/delete/'+ userId,
        state: getState(),
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        },
        requireAuth: true
    }).then(response => {
        dispatch(createAction(actionType.ADMIN_RECEIVE_DELETE_USER, {success: true, message: ""}));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                let errorMessage = error?.responseBody?.message;
                if (error?.responseBody?.errors) {
                    errorMessage = extractErrors(error?.responseBody?.errors);
                }

                if (errorMessage === "")
                    errorMessage = error.message;
                dispatch(createAction(actionType.ADMIN_RECEIVE_DELETE_USER, { success: false, message: errorMessage}));
            }
        })
    );
}

export const filterAdminDashboard = (fromDate: Date, toDate: Date ) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADMIN_REQUEST_FILTER_DASHBOARD));   
        const url = '/Dashboard/DashboardAdmin'
        + `?startDate=${ dateToInterFormat(fromDate) }` 
        + `&endDate=${ dateToInterFormat(toDate) }` 
        return authFetch({
            url: url,
            state: getState(),
            options: {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            },
            requireAuth: true
        }).then(response => {
            const data = response as IDashboardModel[];
            dispatch(createAction(actionType.ADMIN_RECEIVE_FILTER_DASHBOARD, data));

        }).catch(
            handleError.bind(null, {
                dispatch,
                SERVER_ERROR: (error) => {
                    toast.error('Get Dashboard data error');
                    dispatch(createAction(actionType.ADMIN_RECEIVE_FILTER_DASHBOARD_ERROR,error?.responseBody?.message));
                }
            })
        );
    
};
