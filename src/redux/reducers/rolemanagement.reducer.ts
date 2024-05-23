import {  IRoleManagementResponse } from '../domains/RoleManagement';
import {actionType } from '../actions/rolemanagement.action';
import { IApplicationAction } from '../../redux/type'

export interface IRoleManagementState {
    roleManagement: IRoleManagementResponse[];
}

const initialState: IRoleManagementState = {
    roleManagement:[] as IRoleManagementResponse[],
}

const RoleManagement = (state: IRoleManagementState = initialState, action: IApplicationAction) => {
    switch (action.type) {
        case actionType.ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT:
            return { ...state ,isGetting:true, getting:false}
        case actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT:
            return { ...state ,isGetting:false, getting:true, roleManagement: action.payload}
        case actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_ERROR:
            return { ...state , isGetting:false, getting:false, errorMessage: action.payload}
        case actionType.ROLE_MANAGEMENT_REQUEST_GET_ROLE_MANAGEMENT_BY_ID:
            return {...state, isGetting:true, getting:false}
        case actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID:
            return {...state, isGetting:false, getting:true, roleManagement: action.payload}
        case actionType.ROLE_MANAGEMENT_RECEIVE_GET_ROLE_MANAGEMENT_BY_ID_ERROR:
            return {...state, isGetting:false, getting:false, errorMessage: action.payload}
        case actionType.ROLE_MANAGEMENT_REQUEST_CREATE_ROLE_MANAGEMENT:
            return {...state, isAdding: true, added:false}
        case actionType.ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT:
            return {...state, isAdding: false, added:true , roleManagement: [...state.roleManagement, action.payload]}
        case actionType.ROLE_MANAGEMENT_RECEIVE_CREATE_ROLE_MANAGEMENT_ERROR:
            return {...state, isAdding:false, added:false, errorMessage:action.payload}
        case actionType.ROLE_MANAGEMENT_REQUEST_UPDATE_ROLE_MANAGEMENT:
            return {...state, isUpdating: true, updated:false}
        case actionType.ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT:
            const newRoleManagement = state.roleManagement.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload;
                }
                return item;
            }
            );
        return {...state, isUpdating: false, updated:true, roleManagement: newRoleManagement}
        case actionType.ROLE_MANAGEMENT_RECEIVE_UPDATE_ROLE_MANAGEMENT_ERROR:
            return {...state, isUpdating:false, updated:false , errorMessage:action.payload}
        case actionType.ROLE_MANAGEMENT_REQUEST_DELETE_ROLE_MANAGEMENT:
            return {...state, isDeleting: true, deleted:false}
        case actionType.ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT:
            return {...state, isDeleting: false, deleted:true, roleManagement: action.payload}
        case actionType.ROLE_MANAGEMENT_RECEIVE_DELETE_ROLE_MANAGEMENT_ERROR:
            return {...state, isDeleting:false, deleted:false , errorMessage:action.payload}
        default:
            return state;
    }
}

export default RoleManagement;