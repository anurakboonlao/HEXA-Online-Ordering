import { toast } from "react-toastify";
import { NOTI_FETCH_LIMIT } from "../../constants/constant";
import { authFetch, handleError } from "../../utils/apiUtils";
import { notificationModel, receiveNotification, receiveNotificationsWithTotal } from "../domains/Notification";
import { GlobalState } from "../reducers";
import createAction from "./base.actions";


export enum ActionType {

    NOTIFICATION_REQUEST_GET_NOTIFICATION = 'NOTIFICATION_REQUEST_GET_NOTIFICATION',
    NOTIFICATION_RECEIVE_GET_NOTIFICATION = 'NOTIFICATION_RECEIVE_GET_NOTIFICATION',
    NOTIFICATION_RECEIVE_GET_NOTIFICATION_ERROR = 'NOTIFICATION_RECEIVE_GET_NOTIFICATION_ERROR',

    NOTIFICATION_REQUEST_READ_NOTIFICATION = 'NOTIFICATION_REQUEST_READ_NOTIFICATION',
    NOTIFICATION_RECEIVE_READ_NOTIFICATION = 'NOTIFICATION_RECEIVE_READ_NOTIFICATION',
    NOTIFICATION_RECEIVE_READ_NOTIFICATION_ERROR = 'NOTIFICATION_RECEIVE_READ_NOTIFICATION_ERROR',
}

export const getNotification = (userId : number, limit = NOTI_FETCH_LIMIT) => (dispatch:any, getState: () => GlobalState) => {

    dispatch(createAction(ActionType.NOTIFICATION_REQUEST_GET_NOTIFICATION));
    const url = "/Notification/GetNotification/"+userId+"?&limit="+limit;

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
        const data = response as receiveNotificationsWithTotal;
        dispatch(createAction(ActionType.NOTIFICATION_RECEIVE_GET_NOTIFICATION, data));

    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                toast.error(error?.responseBody?.message);
                dispatch(createAction(ActionType.NOTIFICATION_RECEIVE_GET_NOTIFICATION_ERROR));
            }
        })
    );
}

export const readNotification = (notiId : number) => (dispatch:any, getState: () => GlobalState) => {
    dispatch(createAction(ActionType.NOTIFICATION_REQUEST_READ_NOTIFICATION));
    
    const url = "/Notification/ReadNotification/"+notiId;
    return authFetch({
        url: url,
        state: getState(),
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        },
        requireAuth: true
    }).then(response => {

        const notiId = response as number;
        const currentNotiList = getState().Notification.notificationList;
        const updatedNotiList:receiveNotification[] = currentNotiList.map(noti => {
            return {
                ...noti,
                read: noti.id === notiId ? true : noti.read
            }
        });

        dispatch(createAction(ActionType.NOTIFICATION_RECEIVE_READ_NOTIFICATION, updatedNotiList));

    }).catch(
        handleError.bind(null, {
            dispatch,
            SERVER_ERROR: (error) => {
                toast.error(error?.responseBody?.message);
                dispatch(createAction(ActionType.NOTIFICATION_RECEIVE_READ_NOTIFICATION_ERROR));
            }
        })
    );
}

export const createNotification = (notification:notificationModel) => (dispatch:any , getState: GlobalState) => {
    // TODO : implement create notification

    /**
     *  notification.title;
     *  notification.message;
     *  .notificationuserId;
     */
}
