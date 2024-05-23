import { authFetch, extractErrors, handleError } from '../../utils/apiUtils';
import createAction from './base.actions';
export const actionType = {
    ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_ERROR: 'ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_ERROR',

    ROLE_MANAGEMENT_REQUEST_UPDATE_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_REQUEST_UPDATE_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT_ERROR: 'ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT_ERROR',

    ROLE_MANAGEMENT_REQUEST_DELETE_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_REQUEST_DELETE_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT_ERROR: 'ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT_ERROR',

    ROLE_MANAGEMENT_REQUEST_CREATE_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_REQUEST_CREATE_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT: 'ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT',
    ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT_ERROR: 'ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT_ERROR',

    ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT_BY_ID:"ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT_BY_ID",
    ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID:"ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID",
    ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID_ERROR:"ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID_ERROR",
}

const getErrorMessage = (error: any) => {
    let errorMessage = error?.responseBody?.message;
    if (error?.responseBody?.errors) {
        errorMessage = extractErrors(error?.responseBody?.errors);
    }

    if (errorMessage === "") {
        errorMessage = error.message;
    }
    return errorMessage;
}

export const getRoleManagementData = () => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT));
    return authFetch({
        url: '/AdminUser/GetAllCustomRole',
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
        dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT, response));
    }
    ).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_ERROR, getErrorMessage(error)));
                }
            }
        )
    )
}

export const getRoleDataInUserManagement = () => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT));
    return authFetch({
        url: '/AdminUser/GetAdminAndAllCustomRole',
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
        dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT, response));
    }
    ).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_ERROR, getErrorMessage(error)));
                }
            }
        )
    )
}

export const getRoleManagementDataById = (id: any) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT_BY_ID));
    return authFetch({
        url: `/AdminUser/GetRoleById/${id}`,
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
        dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID, response));
    })
}

export const updateRoleManagementData = (roleManagement: any) => (dispatch: any, getState: any) => {
    
    dispatch(createAction(actionType.ROLE_MANAGEMENT_REQUEST_UPDATE_ROLE_MANAGEMENT));
    return authFetch({
        url: '/AdminUser/UpdateRole',
        state: getState(),
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify(roleManagement)
        },
        requireAuth: true
    }).then(response => {

        // update role management data in store
        dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT, response));

        // getRoleManagementData();
        // dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT, response));
    }
    ).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT_ERROR, getErrorMessage(error)));
                }
            }
        )
    )
}

export const createRoleManagementData = (roleManagement: any) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ROLE_MANAGEMENT_REQUEST_CREATE_ROLE_MANAGEMENT));
    return authFetch({
        url: '/AdminUser/AddNewRole',
        state: getState(),
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify(roleManagement)
        },
        requireAuth: true
    }).then( (response) => {
        if(response){
            getRoleManagementData();
            dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT, response));
        }
    }
    ).catch(
        handleError.bind(null, {
                dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT_ERROR, getErrorMessage(error)));
                }
            }
        )
    )
}

export const deleteRoleManagementData = (id:number) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ROLE_MANAGEMENT_REQUEST_DELETE_ROLE_MANAGEMENT));
    return authFetch({
        url: '/AdminUser/DeleteRoleById/' + id,
        state: getState(),
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
        },
        requireAuth: true
    }).then(response => {
        if (response) {
            let filterData = getState().RoleManagement.roleManagement.filter((e:any) => e.id !== id);
            dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT, filterData)); 
        }
    }
    ).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT_ERROR, getErrorMessage(error)));
                }
            }
        )
    )
}