import createAction from "./base.actions";


import { TokenPayload } from '../domains/Auth';
import { readSubContacts, readToken } from '../../utils/authUtils';
import { getNotification } from './notification.action';
import { GlobalState } from '../reducers';

export const actionType = {
    USER_RECEIVER_USER: 'USER_RECEIVER_USER',
    USER_RECEIVER_LOGOUT: 'USER_RECEIVER_LOGOUT',
    USER_SELECT_CONTACT: 'USER_SELECT_CONTACT',
    USER_SELECT_CONTACT_RESULT: 'USER_SELECT_CONTACT',
    USER_RECEIVER_CONTACTS: 'USER_RECEIVER_CONTACTS',
}

export const loggedUser = (auth: TokenPayload) => (dispatch: any, getState: any) => {
  if (auth) {
    dispatch(createAction(actionType.USER_RECEIVER_USER, auth));
  }
};

export const authUser = () => async (dispatch: any, getState: () => GlobalState) => {
    dispatch(createAction(actionType.USER_RECEIVER_USER, readToken()));
    dispatch(createAction(actionType.USER_RECEIVER_CONTACTS, readSubContacts()));
    /**
     * get notification by user Id
     */
    await dispatch(getNotification(parseInt(getState().User?.payload?.Id)));
}


export const selectContact = (contactId: number,name: string) => (dispatch: any, getState: any) => {

    dispatch(createAction(actionType.USER_SELECT_CONTACT,{id:contactId,text:name}));
}

