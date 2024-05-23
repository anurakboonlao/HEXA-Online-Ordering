import { toast } from "react-toastify";


import { UserRoleEnum } from '../../constants/constant';
import { authFetch, handleError } from '../../utils/apiUtils';
import { dateToInterFormat } from '../../utils/converter';
import { IDashboardModel } from '../domains/Dashboard';
import createAction from './base.actions';

export const actionType = {
    HOME_REQUEST_FILTER_CLIENT_DASHBOARD: 'HOME_REQUEST_FILTER_CLIENT_DASHBOARD',
    HOME_RECEIVE_FILTER_CLIENT_DASHBOARD: 'HOME_RECEIVE_FILTER_CLIENT_DASHBOARD',
    HOME_RECEIVE_FILTER_CLIENT_DASHBOARD_ERROR: 'HOME_RECEIVE_FILTER_CLIENT_DASHBOARD_ERROR',

    HOME_SET_TOGGLE_SIDE_BAR: 'HOME_SET_TOGGLE_SIDE_BAR',
}

export const callClientDashboard = (fromDate: Date, toDate: Date ) => (dispatch: any, getState: any) => {
    const selectedContactId:number =  Number(getState().User.selectedContactId? getState().User.selectedContactId: 0);
    dispatch(filterClientDashboard(fromDate,toDate, selectedContactId));
}

export const filterClientDashboard = (fromDate: Date, toDate: Date, memberId: number ) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.HOME_REQUEST_FILTER_CLIENT_DASHBOARD));
    if(getState().User?.payload?.role && getState().User?.payload?.ContactId){
        const role = getState().User.payload.role as UserRoleEnum;
        const id = Number(getState().User.payload.ContactId);
        
        const url = (role === UserRoleEnum.Clinic ? '/Dashboard/DashboardClinic/' : '/Dashboard/DashboardDentist/') 
        + id + `?`
        + `&startDate=${ dateToInterFormat(fromDate) }` 
        + `&endDate=${ dateToInterFormat(toDate) }` 
        + (role === UserRoleEnum.Clinic ? `&dentistId=` : `&clinicId=`) + `${ memberId }`
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
            dispatch(createAction(actionType.HOME_RECEIVE_FILTER_CLIENT_DASHBOARD, data));

        }).catch(
            handleError.bind(null, {
                dispatch,
                SERVER_ERROR: (error) => {
                    toast.error('Get Dashboard data error');
                    dispatch(createAction(actionType.HOME_RECEIVE_FILTER_CLIENT_DASHBOARD_ERROR,error?.responseBody?.message));
                }
            })
        );
    }
};

export const setSideBarToggle = (value: boolean ) => (dispatch: any, getState: any) => {
    dispatch(createAction(actionType.HOME_SET_TOGGLE_SIDE_BAR, value));
}
