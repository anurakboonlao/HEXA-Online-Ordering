import { IApplicationAction } from "../type";

type ICreateAction = <T extends IApplicationAction>(type: T['type'], payload?: T['payload']) => IApplicationAction;

const createAction: ICreateAction = (type, payload) => ({ type, payload });

export default createAction;
