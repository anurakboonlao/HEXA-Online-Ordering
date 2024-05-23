import { Store } from 'redux';


export interface IApplicationAction {
    type: string;
    payload?: any;
};

export interface ICallbackResult {
    success: boolean;
    message: string;
}

export interface IQueryParams {
    key : string;
    value : string | number;
}

export interface IMoreMenu {
    displayText: string,
    params: any[],
    onClicked: (params: any[]) => void,
    className?: string,
}

// export type IApplicationStore = Store<GlobalState, IApplicationAction>;
