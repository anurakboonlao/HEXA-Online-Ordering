import { actionType } from '../actions/case.actions';
import { IApplicationAction, ICallbackResult } from '../type';
import { CaseModeEnum, CaseStatusEnum, iCharmGenderEnum, OrderTypeEnum } from '../../constants/caseManagement';
import { CaseDetailModel, caseDisplayModel, IFavoriteModel, ProductTypeModel, CatalogModel } from '../domains/CaseManagement';


interface ICaseState {
    caseNewPass: string;
    caseMode: CaseModeEnum;
    loadingProductTypeItemList:boolean;
    loadingProductTypeItemType:number;
    productTypeItemList:ProductTypeModel[];

    savingCase:boolean;
    newDraftCaseId:number;
    savingDraft:boolean;
    saveCaseResult: ICallbackResult;
    
    loadingCaseList:boolean;
    caseListResult: ICallbackResult;
    caseList: caseDisplayModel[];
    totalFilterRow: number;

    loadingGetCase:boolean;
    getCaseResult: ICallbackResult;
    caseDetailModel: CaseDetailModel;  
    
    deletingCase:boolean;
    deleteCaseResult: ICallbackResult;

    creatingOrder:boolean;
    createOrderResult: ICallbackResult;

    enableCancelToDeleteCase : boolean;

    favorites: IFavoriteModel[],
    gettingFavorites: boolean,
    getFavoritesResult: ICallbackResult

    addingFavorite: boolean,
    addFavoriteResult: ICallbackResult

    renamingFavorite: boolean,
    renameFavoriteResult: ICallbackResult,

    deletingFavorite: boolean,
    deleteFavoriteResult: ICallbackResult

    isDuplicatingCase: boolean,
    duplicateCaseId: number,
    duplicateCaseResult: ICallbackResult,

    loadingCatalog:boolean,
    catalogs: CatalogModel[],
    loadingCatalogResult: ICallbackResult,
}

const initialState: ICaseState = {
    caseNewPass: OrderTypeEnum.NewCase,
    caseMode: CaseModeEnum.New,
    caseDetailModel: {
        caseId: 0,
        caseName: '',
        patientName: '',
        age:0,
        gender:iCharmGenderEnum.Male,
        dentistName:'',
        clinicName:'',
        dentistId:0,
        clinicId:0,
        memo:'',
        userId:0,
        status: CaseStatusEnum.Draft,
        caseMode:'',
        caseOrderLists: [],
        attachedFileList:[],
        caseTypeId:0,
        caseTypeName: OrderTypeEnum.NewCase,
        referenceOrderNumber:''
    },
    totalFilterRow: 0,
    loadingProductTypeItemList: false,
    loadingProductTypeItemType: 0,
    productTypeItemList:[],

    newDraftCaseId:0,
    savingDraft:false,
    savingCase: false,
    saveCaseResult: { success: true, message: '' },

    loadingCaseList: false,
    caseListResult: { success: true, message: '' },
    caseList: [],

    loadingGetCase: false,
    getCaseResult: { success: true, message: '' },

    deletingCase: false,
    deleteCaseResult: { success: true, message: '' },

    creatingOrder:false,
    createOrderResult: { success: true, message: '' },

    enableCancelToDeleteCase: false,

    favorites: [],
    gettingFavorites: false,
    getFavoritesResult: { success: true, message: '' },

    addingFavorite:false,
    addFavoriteResult: { success: true, message: '' },

    renamingFavorite: false,
    renameFavoriteResult: { success: true, message: '' },

    deletingFavorite: false,
    deleteFavoriteResult: { success: true, message: '' },

    isDuplicatingCase: false,
    duplicateCaseId: 0,
    duplicateCaseResult: { success: true, message: '' },

    loadingCatalog:false,
    catalogs: [],
    loadingCatalogResult: { success: true, message:''}
}

const Case = (state: ICaseState = initialState, action: IApplicationAction) => {
    switch (action.type) {
        case actionType.CASE_PASS_NEW_TYPE:
            return {
                ...state
                , caseNewPass: action.payload
                , caseMode: CaseModeEnum.New
                , caseDetailModel: initialState.caseDetailModel
            }
        case actionType.CASE_REQUEST_GET_PRODUCT_TYPE:
            return {
                ...state
                , loadingProductTypeItemList: true
                , loadingProductTypeItemType: 0
            }
        case actionType.CASE_RECEIVE_GET_PRODUCT_TYPE:
            const productType: ProductTypeModel = action.payload as ProductTypeModel;
            let tempProductTypeItemList:ProductTypeModel[] = state.productTypeItemList;
            if(state.productTypeItemList && state.productTypeItemList.length > 0 && state.productTypeItemList.some(p=>p.id === productType.id)){
                // if duplicate then update 
                let foundIndex = tempProductTypeItemList.findIndex(p=>p.id === productType.id);
                if(foundIndex > -1)
                    tempProductTypeItemList[foundIndex] = productType;
            }
            else{
                //add new
                tempProductTypeItemList.push(productType);
            }
            return {
                ...state
                , productTypeItemList: tempProductTypeItemList
                , loadingProductTypeItemList: false
                , loadingProductTypeItemType: productType.id
            }
        case actionType.CASE_REQUEST_SAVE_CASE:
            return {
                ...state
                , savingCase: true
                , saveCaseResult: initialState.saveCaseResult
            }
        case actionType.CASE_RECEIVE_SAVE_CASE:
            return {
                ...state
                , savingCase: false
                , saveCaseResult: action.payload
            }

        case actionType.CASE_REQUEST_GET_CASE_LIST:
            return {
                ...state
                , loadingCaseList: true
                , caseListResult: initialState.saveCaseResult
                , caseList : [] as caseDisplayModel[]
                , totalFilterRow: 0
            }
        case actionType.CASE_RECEIVE_GET_CASE_LIST:
            return {
                ...state
                , loadingCaseList: false
                , caseListResult: initialState.saveCaseResult
                , caseList:action.payload?.caseList
                , totalFilterRow: action.payload?.totalFilterRow
            }
        case actionType.CASE_RECEIVE_GET_CASE_LIST_ERROR:
            return {
                ...state
                , loadingCaseList: false
                , caseListResult: action.payload
                , caseList: [] as caseDisplayModel[]
                , totalFilterRow: 0
            }

        case actionType.CASE_REQUEST_GET_CASE:
            return {
                ...state
                , caseMode: CaseModeEnum.Edit
                , loadingGetCase: true
                , getCaseResult: initialState.saveCaseResult
                , caseDetailModel: initialState.caseDetailModel
                // , catalogs:[]
            }
        case actionType.CASE_RECEIVE_GET_CASE:
            return {
                ...state
                , caseMode: CaseModeEnum.Edit
                , loadingGetCase: false
                , getCaseResult: initialState.saveCaseResult
                , caseDetailModel:action.payload
            }
        case actionType.CASE_RECEIVE_GET_CASE_ERROR:
            return {
                ...state
                , loadingGetCase: false
                , getCaseResult: action.payload
                , caseDetailModel: initialState.caseDetailModel
            }
        case actionType.CASE_REQUEST_DELETE_CASE:
            return {
                ...state
                , deletingCase: true
                , deleteCaseResult: initialState.deleteCaseResult
            }
        case actionType.CASE_RECEIVE_DELETE_CASE:
            return {
                ...state
                , deletingCase: false
                , deleteCaseResult: action.payload
            }
        case actionType.CASE_REQUEST_CREATE_ORDER:
            return {
                ...state
                , creatingOrder: true
                , createOrderResult: action.payload
            }
        case actionType.CASE_RECEIVE_CREATE_ORDER:
            return {
                ...state
                , creatingOrder: false
                , createOrderResult: action.payload
            }
    
        case actionType.CASE_ENABLE_CANCEL_TO_DELETE_CASE:
            return {
                ...state
                , enableCancelToDeleteCase: action.payload
            }
            

        case actionType.CASE_REQUEST_SAVE_DRAFT_CASE:
            return {
                ...state
                , savingDraft:true
            }
        case actionType.CASE_RECEIVE_SAVE_DRAFT_CASE:
            return {
                ...state
                , savingDraft:false
                , newDraftCaseId: action.payload as number
            }
        case actionType.CASE_RECEIVE_SAVE_DRAFT_CASE_ERROR:
            return {
                ...state
                , savingDraft:false
                , newDraftCaseId: 0
            }
        case actionType.CASE_REQUEST_GET_FAVORITES:
            return { ...state, gettingFavorites: true }
        case actionType.CASE_RECEIVE_GET_FAVORITES:
            return { ...state, gettingFavorites: false, getFavoritesResult: {success: true, message: ''}, favorites: action.payload }
        case actionType.CASE_RECEIVE_GET_FAVORITES_ERROR:
            return { ...state, gettingFavorites: false, getFavoritesResult: {success: false, message: action.payload ?? ''} }
        case actionType.CASE_REQUEST_ADD_FAVORITE:
            return { ...state, addingFavorite: true }
        case actionType.CASE_RECEIVE_ADD_FAVORITE:
            const newFavorite = [...state.favorites];
            newFavorite.push(action.payload);
            return { ...state, addingFavorite: false, addFavoriteResult: {success: true, message: ''}, favorites: newFavorite }
        case actionType.CASE_RECEIVE_ADD_FAVORITE_ERROR:
            return { ...state, addingFavorite: false, addFavoriteResult: {success: false, message: action.payload ?? ''} }
        case actionType.CASE_REQUEST_RENAME_FAVORITE:
            return { ...state, renamingFavorite: true }
        case actionType.CASE_RECEIVE_RENAME_FAVORITE:
            const renamedFavorite = state.favorites.find(i => i.id === action.payload?.id ?? 0);
            if (renamedFavorite) {
                renamedFavorite.name = action.payload?.name ?? '';
            }
            const renamedFavoriteList = state.favorites.map(i => {
                if (i.id === renamedFavorite?.id ?? 0) {
                    return renamedFavorite;
                }
                else {
                    return i
                }
            });
            return { ...state, renamingFavorite: false, renameFavoriteResult: {success: true, message: ''}, favorites: renamedFavoriteList }
        case actionType.CASE_RECEIVE_RENAME_FAVORITE_ERROR:
            return { ...state, renamingFavorite: false, renameFavoriteResult: {success: false, message: action.payload ?? ''} }
        case actionType.CASE_REQUEST_DELETE_FAVORITE:
            return { ...state, deletingFavorite: true }
        case actionType.CASE_RECEIVE_DELETE_FAVORITE:
            return { ...state, deletingFavorite: false, deleteFavoriteResult: {success: true, message: ''}, favorites: state.favorites.filter(i => i.id !== action.payload) }
        case actionType.CASE_RECEIVE_DELETE_FAVORITE_ERROR:
            return { ...state, deletingFavorite: false, deleteFavoriteResult: {success: false, message: action.payload ?? ''} }
        case actionType.CASE_REQUEST_DUPLICATE_CASE:
            return {
                ...state
                , isDuplicatingCase: true
                , duplicateCaseId: 0
                , duplicateCaseResult: { success: true, message: '' }
            }
        case actionType.CASE_RECEIVE_DUPLICATE_CASE:
            return {
                ...state
                , isDuplicatingCase: false
                , duplicateCaseId: action.payload as number
                , duplicateCaseResult: { success: true, message: '' }
            }
        case actionType.CASE_RECEIVE_DUPLICATE_CASE_ERROR:
            return {
                ...state
                , isDuplicatingCase: false
                , duplicateCaseId: 0
                , duplicateCaseResult: { success: false, message: action.payload ?? ''} 
            }

        case actionType.CASE_REQUEST_GET_CATALOG:
            return {
                ...state 
                , loadingCatalog:true
                , loadingCatalogResult: { success: true, message:''}
            }
        case actionType.CASE_RECEIVE_GET_CATALOG:
            return {
                ...state
                , loadingCatalog:false
                , catalogs: action.payload ?? []
                , loadingCatalogResult: { success: true, message:''} 
            }  
        case actionType.CASE_RECEIVE_GET_CATALOG_ERROR:
            return {
                ...state
                , loadingCatalog:false
                , loadingCatalogResult: { success: false,message: action.payload ?? ''} 
            }    
        default:
            return state;
    }
}

export default Case;