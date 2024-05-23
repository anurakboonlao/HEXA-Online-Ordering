import { ActionType, IGetAttachmentFile } from '../actions/attachment.action';

export interface IAttachmentRequestData {
    type: ActionType.ATTACHMENT_FILE_REQUEST_GET_ATTACHMENT_FILE;
}

export interface IAttachmentReceiveData {
    type: ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE;
    payload: IGetAttachmentFile[];
}

export interface IAttachmentReceiveDataError {
    type: ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR;
}

export interface IAttachmentRequestUpload {
    type: ActionType.ATTACHMENT_FILE_REQUEST_UPLOAD_ATTACHMENT_FILE;
}

export interface IAttachmentReceiveUpload {
    type: ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE;
    payload: IGetAttachmentFile[];
}

export interface IAttachmentReceiveUploadError {
    type: ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE_ERROR;
}

export interface IAttachmentRequestRemove {
    type: ActionType.ATTACHMENT_FILE_REQUEST_REMOVE_ATTACHMENT_FILE;
}

export interface IAttachmentReceiveRemove {
    type: ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE;
    payload: number;
}

export interface IAttachmentReceiveRemoveError {
    type: ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE_ERROR;
}

export interface IAttachmentClear{
    type: ActionType.ATTACHMENT_FILE_CLEAR_ATTACHMENT_FILE;
}


export type IAttachmentAction = IAttachmentRequestData | IAttachmentReceiveData | IAttachmentReceiveDataError
                                | IAttachmentRequestUpload
                                | IAttachmentReceiveUpload
                                | IAttachmentReceiveUploadError
                                | IAttachmentRequestRemove
                                | IAttachmentReceiveRemove
                                | IAttachmentReceiveRemoveError 
                                | IAttachmentClear;

interface AttachmentState {
    isLoading:boolean;
    isRemoving:boolean;
    isUploading:boolean;

    attachFiles:IGetAttachmentFile[];
}

const initialAttachmentState: AttachmentState = {
    isLoading : false,
    isRemoving : false,
    isUploading : false,
    attachFiles : [],
}

const Attachment = (state = initialAttachmentState, action: IAttachmentAction): AttachmentState => {
    switch (action.type){
        case ActionType.ATTACHMENT_FILE_REQUEST_GET_ATTACHMENT_FILE:
            return { ...state, isLoading: true };
        case ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE:
            return { ...state, isLoading: false, attachFiles: action.payload };
        case ActionType.ATTACHMENT_FILE_RECEIVE_GET_ATTACHMENT_FILE_ERROR:
            return { ...state, isLoading: false };

    
        case ActionType.ATTACHMENT_FILE_REQUEST_UPLOAD_ATTACHMENT_FILE:
            return { ...state, isUploading: true };
        case ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE:
            // TODO : update attachment file in UI
            return { ...state, isUploading: false, attachFiles:action.payload };
        case ActionType.ATTACHMENT_FILE_RECEIVE_UPLOAD_ATTACHMENT_FILE_ERROR:
            return { ...state, isUploading: false };

        
        case ActionType.ATTACHMENT_FILE_REQUEST_REMOVE_ATTACHMENT_FILE:
            return { ...state, isRemoving: true };
        case ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE:
            return { ...state, isRemoving: false, attachFiles: state.attachFiles.filter( file => file.id !== action.payload) };
        case ActionType.ATTACHMENT_FILE_RECEIVE_REMOVE_ATTACHMENT_FILE_ERROR:
            return { ...state, isRemoving: false };     

        case ActionType.ATTACHMENT_FILE_CLEAR_ATTACHMENT_FILE:
            return { ...state, attachFiles: []}

        default: 
            return state;
    }
}

export default Attachment;