import { actionType } from '../actions/advertise.actions';
import { IApplicationAction } from '../type';
import { IAdvertise } from '../domains/Advertise';

interface IAdvertiseState {
    gettingAdsList: boolean,
    adsList: IAdvertise[],

    gettingAds: boolean,
    adsItem: IAdvertise,

    addingAds: boolean,
    edittingAds: boolean,

    gettingOrderNumber: boolean,
    defaultOrderNumber: number,
}

const initialState: IAdvertiseState = {
    gettingAdsList: false,
    gettingAds: false,
    addingAds: false,
    edittingAds: false,
    gettingOrderNumber: false,
    defaultOrderNumber: 0,
    adsList: [],
    adsItem: {
        id: 0,
        name: '',
        filePath: '',
        disabled: false,
        orderNumber: 0,
        url: ''
    }
}

const Advertise = (state: IAdvertiseState = initialState, action: IApplicationAction) => {
    switch (action.type) {
        case actionType.ADVERTISE_REQUEST_GET_ADS_LIST:
            return { ...state, gettingAdsList: true }
        case actionType.ADVERTISE_RECEIVE_GET_ADS_LIST:
            return { ...state, gettingAdsList: false, adsList: action.payload }
        case actionType.ADVERTISE_RECEIVE_GET_ADS_LIST_ERROR:
            return { ...state, gettingAdsList: false }
        case actionType.ADVERTISE_REQUEST_GET_ADS:
            return { ...state, gettingAds: true }
        case actionType.ADVERTISE_RECEIVE_GET_ADS:
            return { ...state, gettingAds: false, adsItem: action.payload }
        case actionType.ADVERTISE_RECEIVE_GET_ADS_ERROR:
            return { ...state, gettingAds: false }
        case actionType.ADVERTISE_REQUEST_ADD_ADS:
            return { ...state, addingAds: true }
        case actionType.ADVERTISE_RECEIVE_ADD_ADS:
            return { ...state, addingAds: false }
        case actionType.ADVERTISE_RECEIVE_ADD_ADS_ERROR:
            return { ...state, addingAds: false }
        case actionType.ADVERTISE_REQUEST_EDIT_ADS:
            return { ...state, edittingAds: true }
        case actionType.ADVERTISE_RECEIVE_EDIT_ADS:
            return { ...state, edittingAds: false }
        case actionType.ADVERTISE_RECEIVE_EDIT_ADS_ERROR:
            return { ...state, edittingAds: false }
        case actionType.ADVERTISE_RECEIVE_DELETE_ADS:
            return { ...state, adsList: state.adsList.filter(i => i.id !== action.payload ?? 0) }
        case actionType.ADVERTISE_REQUEST_GET_DEFAULT_ORDER:
            return { ...state, gettingOrderNumber: true }
        case actionType.ADVERTISE_RECEIVE_GET_DEFAULT_ORDER:
            return { ...state, gettingOrderNumber: false, defaultOrderNumber: action.payload ?? 0 }
        case actionType.ADVERTISE_RECEIVE_GET_DEFAULT_ORDER_ERROR:
            return { ...state, gettingOrderNumber: false, defaultOrderNumber: 0 }
        default:
            return state;
    }
}

export default Advertise;