import { getWindowDimensions } from '../../utils/screenUtils';
import { actionType } from '../actions/home.actions';
import { IDashboardModel } from '../domains/Dashboard';
import { IApplicationAction, ICallbackResult } from '../type';

interface IHomeState {
    filteringClientDashboard: boolean;
    filterClientDashboardResult: ICallbackResult;
    clientDashboardData: IDashboardModel;
    isSideBarToggle: boolean;
    isLoadingData:boolean;
}
const startToggle = () =>{
    const { width } = getWindowDimensions();
    return width < 1025;
}

const initialState: IHomeState = {
    filteringClientDashboard: false,
    filterClientDashboardResult: { success: true, message: '' },
    clientDashboardData: {
        dateList: [],
        caseCounts: [],
        orderCounts: [],
        orderProduct: [],
        allGroupsOfProduct:[]
    },
    isSideBarToggle: startToggle(),
    isLoadingData: false,

}

const Home = (state: IHomeState = initialState, action: IApplicationAction) => {

    switch (action.type) {
        case actionType.HOME_REQUEST_FILTER_CLIENT_DASHBOARD:
            return {
                ...state
                , filteringClientDashboard: true
                , filterClientDashboardResult: initialState.filterClientDashboardResult
                , clientDashboardData: initialState.clientDashboardData
                , isLoadingData:true
            }
        case actionType.HOME_RECEIVE_FILTER_CLIENT_DASHBOARD_ERROR:
            return {
                ...state
                , filteringClientDashboard: false
                , filterClientDashboardResult: action.payload
                , clientDashboardData: initialState.clientDashboardData
                , isLoadingData:false
            }
        case actionType.HOME_RECEIVE_FILTER_CLIENT_DASHBOARD:
            return {
                ...state
                , filteringClientDashboard: false
                , filterClientDashboardResult: initialState.filterClientDashboardResult
                , clientDashboardData: action.payload
                , isLoadingData:false
            }
        case actionType.HOME_SET_TOGGLE_SIDE_BAR:
            return {
                ...state
                , isSideBarToggle:action.payload
            }
        default:
            return state;
    }
}

export default Home;