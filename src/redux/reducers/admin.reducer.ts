import { actionType } from '../actions/admin.actions';
import { IApplicationAction, ICallbackResult } from '../type';
import { userManagement } from '../../constants/userManagement';
import { IDashboardModel } from '../domains/Dashboard';


interface IAdminState {
    userManagementList: userManagement[];
    userManagementLoading: boolean;
    getUserManagementListResult: ICallbackResult;

    userManagementAdding: boolean;
    addUserManagementResult: ICallbackResult;

    userManagementEditing: boolean;
    editUserManagementResult: ICallbackResult;

    userManagementdeleting: boolean;
    deleteUserManagementResult: ICallbackResult;

    filteringAdminDashboard: boolean;
    filterAdminDashboardResult: ICallbackResult;
    adminDashboardData: IDashboardModel;
}

const initialState: IAdminState = {
    userManagementList: [],
    userManagementLoading: false,
    getUserManagementListResult: { success: true, message: '' },

    userManagementAdding: false,
    addUserManagementResult: { success: true, message: '' },

    userManagementEditing: false,
    editUserManagementResult: { success: true, message: '' },

    userManagementdeleting: false,
    deleteUserManagementResult: { success: true, message: '' },

    filteringAdminDashboard: false,
    filterAdminDashboardResult: { success: true, message: '' },
    adminDashboardData: {
        dateList: [],
        caseCounts: [],
        orderCounts: [],
        orderProduct: [],
        allGroupsOfProduct: [],
    },

}
const Admin = (state: IAdminState = initialState, action: IApplicationAction) => {

    switch (action.type) {
        case actionType.ADMIN_REQUEST_GET_USERS:
            return {
                ...state
                , userManagementLoading: true
                , userManagementList: initialState.userManagementList
                , getUserManagementListResult: initialState.getUserManagementListResult
            }
        case actionType.ADMIN_RECEIVE_GET_USERS:
            return {
                ...state
                , userManagementLoading: false
                , userManagementList: action.payload
                , getUserManagementListResult: { success: true, message: '' }
            }
        case actionType.ADMIN_RECEIVE_GET_USERS_ERROR:
            return {
                ...state
                , userManagementLoading: false
                , userManagementList: initialState.userManagementList
                , getUserManagementListResult: action.payload
            }

        case actionType.ADMIN_REQUEST_ADD_USER:
            return {
                ...state
                , userManagementAdding: true
                , addUserManagementResult: initialState.addUserManagementResult
            }
        case actionType.ADMIN_RECEIVE_ADD_USER:
            return {
                ...state
                , userManagementAdding: false
                , addUserManagementResult: action.payload
            }

        case actionType.ADMIN_REQUEST_EDIT_USER:
            return {
                ...state
                , userManagementEditing: true
                , editUserManagementResult: initialState.editUserManagementResult
            }
        case actionType.ADMIN_RECEIVE_EDIT_USER:
            return {
                ...state
                , userManagementEditing: false
                , editUserManagementResult: action.payload
            }

        case actionType.ADMIN_REQUEST_DELETE_USER:
            return {
                ...state
                , userManagementdeleting: true
                , deleteUserManagementResult: initialState.deleteUserManagementResult
            }
        case actionType.ADMIN_RECEIVE_DELETE_USER:
            return {
                ...state
                , userManagementdeleting: false
                , deleteUserManagementResult: action.payload
            }
        case actionType.ADMIN_REQUEST_FILTER_DASHBOARD:
            return {
                ...state
                , filteringAdminDashboard: true
                , filterAdminDashboardResult: initialState.filterAdminDashboardResult
                , adminDashboardData: initialState.adminDashboardData
            }
        case actionType.ADMIN_RECEIVE_FILTER_DASHBOARD_ERROR:
            return {
                ...state
                , filteringAdminDashboard: false
                , filterAdminDashboardResult: action.payload
                , adminDashboardData: initialState.adminDashboardData
            }
        case actionType.ADMIN_RECEIVE_FILTER_DASHBOARD:
            return {
                ...state
                , filteringAdminDashboard: false
                , filterAdminDashboardResult: initialState.filterAdminDashboardResult
                , adminDashboardData: action.payload
            }
        default:
            return state;
    }
}

export default Admin;