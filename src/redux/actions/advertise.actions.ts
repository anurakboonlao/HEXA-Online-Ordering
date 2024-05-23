import { authFetch, extractErrors, handleError } from '../../utils/apiUtils';
import createAction from './base.actions';
import { IAdvertise, IAdvertiseReorder } from '../domains/Advertise';
import { toast } from 'react-toastify';
import { GlobalState } from '../reducers';

export const actionType = {
    ADVERTISE_REQUEST_GET_ADS_LIST: 'ADVERTISE_REQUEST_GET_ADS_LIST',
    ADVERTISE_RECEIVE_GET_ADS_LIST: 'ADVERTISE_RECEIVE_GET_ADS_LIST',
    ADVERTISE_RECEIVE_GET_ADS_LIST_ERROR: 'ADVERTISE_RECEIVE_GET_ADS_LIST_ERROR',

    ADVERTISE_REQUEST_GET_ADS: 'ADVERTISE_REQUEST_GET_ADS',
    ADVERTISE_RECEIVE_GET_ADS: 'ADVERTISE_RECEIVE_GET_ADS',
    ADVERTISE_RECEIVE_GET_ADS_ERROR: 'ADVERTISE_RECEIVE_GET_ADS_ERROR',

    ADVERTISE_REQUEST_ADD_ADS: 'ADVERTISE_REQUEST_ADD_ADS',
    ADVERTISE_RECEIVE_ADD_ADS: 'ADVERTISE_RECEIVE_ADD_ADS',
    ADVERTISE_RECEIVE_ADD_ADS_ERROR: 'ADVERTISE_RECEIVE_ADD_ADS_ERROR',

    ADVERTISE_REQUEST_EDIT_ADS: 'ADVERTISE_REQUEST_EDIT_ADS',
    ADVERTISE_RECEIVE_EDIT_ADS: 'ADVERTISE_RECEIVE_EDIT_ADS',
    ADVERTISE_RECEIVE_EDIT_ADS_ERROR: 'ADVERTISE_RECEIVE_EDIT_ADS_ERROR',

    ADVERTISE_REQUEST_DELETE_ADS: 'ADVERTISE_REQUEST_DELETE_ADS',
    ADVERTISE_RECEIVE_DELETE_ADS: 'ADVERTISE_RECEIVE_DELETE_ADS',
    ADVERTISE_RECEIVE_DELETE_ADS_ERROR: 'ADVERTISE_RECEIVE_DELETE_ADS_ERROR',

    ADVERTISE_REQUEST_GET_DEFAULT_ORDER: 'ADVERTISE_REQUEST_GET_DEFAULT_ORDER',
    ADVERTISE_RECEIVE_GET_DEFAULT_ORDER: 'ADVERTISE_RECEIVE_GET_DEFAULT_ORDER',
    ADVERTISE_RECEIVE_GET_DEFAULT_ORDER_ERROR: 'ADVERTISE_RECEIVE_GET_DEFAULT_ORDER_ERROR',

    ADVERTISE_REQUEST_REORDER: 'ADVERTISE_REQUEST_REORDER',
    ADVERTISE_RECEIVE_REORDER: 'ADVERTISE_RECEIVE_REORDER'
}

const adPath:string = "Signage";

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

export const getAdsList = (isActive?: boolean) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADVERTISE_REQUEST_GET_ADS_LIST));
    return authFetch({
        url: isActive ? `/${adPath}/GetAll?isActive=${isActive}` : `/${adPath}/GetAll`,
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
        dispatch(createAction(actionType.ADVERTISE_RECEIVE_GET_ADS_LIST, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ADVERTISE_RECEIVE_GET_ADS_LIST_ERROR, getErrorMessage(error)));
            }
        })
    );
}

export const getAds = (id: number) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADVERTISE_REQUEST_GET_ADS));
    return authFetch({
        url: '/'+adPath+'/GetAds/' + id,
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
        dispatch(createAction(actionType.ADVERTISE_RECEIVE_GET_ADS, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ADVERTISE_RECEIVE_GET_ADS_ERROR, getErrorMessage(error)));
            }
        })
    );
}

export const addAds = (item: IAdvertise) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADVERTISE_REQUEST_ADD_ADS));

    const form = new FormData();
    Object.entries(item).map(([key, value]) => {
        if (value !== undefined)
            form.append(key, value);
    });

    return authFetch({
        url: '/'+adPath+'/AddAds',
        state: getState(),
        options: {
            method: 'POST',
            headers: {
                'Accept':'application/json'
            },
            body: form
        },
        requireAuth: true
    }).then(response => {
        toast.success('Create advertisement success.')
        dispatch(createAction(actionType.ADVERTISE_RECEIVE_ADD_ADS, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                toast.error(getErrorMessage(error));
                dispatch(createAction(actionType.ADVERTISE_RECEIVE_ADD_ADS_ERROR, getErrorMessage(error)));
            },
        })
    );
}

export const editAds = (item: IAdvertise) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADVERTISE_REQUEST_EDIT_ADS));

    const form = new FormData();
    Object.entries(item).map(([key, value]) => {
        if (value !== undefined)
            form.append(key, value);
    });

    return authFetch({
        url: '/'+adPath+'/EditAds',
        state: getState(),
        options: {
            method: 'PUT',
            headers: {
                'Accept':'application/json'
            },
            body: form
        },
        requireAuth: true
    }).then(response => {
        toast.success('Update advertisement success.')
        dispatch(createAction(actionType.ADVERTISE_RECEIVE_EDIT_ADS, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                toast.error(getErrorMessage(error));
                dispatch(createAction(actionType.ADVERTISE_RECEIVE_EDIT_ADS_ERROR, getErrorMessage(error)));
            }
        })
    );
}

export const deleteAds = (id: number) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADVERTISE_REQUEST_DELETE_ADS));
    return authFetch({
        url: '/'+adPath+'/DeleteAds/' + id,
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
        dispatch(createAction(actionType.ADVERTISE_RECEIVE_DELETE_ADS, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ADVERTISE_RECEIVE_DELETE_ADS_ERROR, getErrorMessage(error)));
            }
        })
    );
}

export const getDefaultOrderNumber = () => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.ADVERTISE_REQUEST_GET_DEFAULT_ORDER));
    return authFetch({
        url: '/'+adPath+'/GetDefaultOrderNumber/',
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
        dispatch(createAction(actionType.ADVERTISE_RECEIVE_GET_DEFAULT_ORDER, response));
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                dispatch(createAction(actionType.ADVERTISE_RECEIVE_GET_DEFAULT_ORDER_ERROR, getErrorMessage(error)));
            }
        })
    );
}

export const reorderAvertisement = (adsOrder: IAdvertiseReorder) => (dispatch: any, getState: () => GlobalState) => {

    return authFetch({
        url: '/'+adPath+'/Reorder',
        state: getState(),
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify(adsOrder)
        },
        requireAuth: true
    }).then(response => {
        dispatch(getAdsList());
    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                toast.error(getErrorMessage(error));
            }
        })
    );
}