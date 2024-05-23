import { actionType } from '../actions/login.actions';
import { IApplicationAction } from '../type';
import PATH from '../../constants/path'
import { TokenPayload } from '../domains/Auth';
import { UserRoleEnum } from '../../constants/constant';

interface ILoginState {
    isLoading: boolean;
    errorMessage: string;
    redirectPath: string;
    validating: boolean;
    tokenValid: boolean;
}

const initialState: ILoginState = {
    isLoading: false,
    errorMessage: '',
    redirectPath: PATH.ADMIN.DASHBAORD,
    validating: false,
    tokenValid: false
}

const Login = (state: ILoginState = initialState, action: IApplicationAction) => {

    switch (action.type) {
        case actionType.LOGIN_REQUEST_LOGIN:
            return { ...state, isLoading: true, errorMessage: '' };
        case actionType.LOGIN_RECEIVE_LOGIN:

            const payload = action.payload as TokenPayload;
            const redirectPath = payload.role === UserRoleEnum.Admin || payload.role === UserRoleEnum.Staff
                ? PATH.ADMIN.DASHBAORD
                : PATH.CLIENT.DASHBAORD;

            return {
                ...state, isLoading: false, redirectPath: redirectPath
            };
        case actionType.LOGIN_RECEIVE_ERROR:
            return { ...state, isLoading: false, errorMessage: action.payload };
        case actionType.LOGIN_REQUEST_LOGOUT:
            return initialState;
        case actionType.LOGIN_REQUEST_ALIVE:
            return {
                ...state,
                validating: true,
                tokenValid: false,
                errorMessage: ''
            }
        case actionType.LOGIN_RECEIVE_ALIVE:
            return {
                ...state,
                validating: false,
                tokenValid: action.payload?.valid,
                errorMessage: action.payload?.message
            }
        default:
            return state;
    }
}

export default Login;