import { UserRoleEnum } from '../../constants/constant';
import { createPermission } from '../../utils/permissionUtils';
import { actionType } from '../actions/user.actions';
import { SubContact, TokenPayload } from '../domains/Auth';
import { IApplicationAction } from '../type';

interface IUserState {
    payload: TokenPayload;
    userRolePermission: number;
    selectedContactId: number;
    selectedContactName: string;
    subContact: SubContact;
}

const initialState: IUserState = {
    payload: {
        Id: "0",
        aud: "",
        exp: 0,
        iat: 0,
        iss: "",
        jti: "",
        nbf: 0,
        role: "",
        sub: "",
        ContactId: "",     
        DisplayImage: '',
        CustomRole: "",
        AdminProductType:[],
    },
    userRolePermission: 0,
    selectedContactId: 0,
    selectedContactName: "",
    subContact: {
        doctors:[],
        clinics:[],
    },

}

const User = (state = initialState, action: IApplicationAction): IUserState => {
    switch (action.type) {
        case actionType.USER_RECEIVER_USER:
            let userPermission = createPermission();
            let userRolePermission: number = userPermission[UserRoleEnum.None]
            if (action.payload) {
                let role :string = (action.payload as TokenPayload).role;
                if (role in UserRoleEnum) {
                    userRolePermission = userPermission[role];
                }
            }
            return {
                ...state
                , payload: action.payload
                , userRolePermission: userRolePermission
            };
        case actionType.USER_RECEIVER_LOGOUT:
            return initialState
        case actionType.USER_SELECT_CONTACT:
            return {
                ...state
                , selectedContactId: action.payload.id
                , selectedContactName: action.payload.text

            }
        case actionType.USER_RECEIVER_CONTACTS:
            let defaultContact : SubContact =  {
                doctors:[],
                clinics:[],
            };
            return {
                ...state,
                subContact: action.payload? (JSON.parse(action.payload) as SubContact) :defaultContact,
            }
        default:
            return state;
    }
}
export default User;


