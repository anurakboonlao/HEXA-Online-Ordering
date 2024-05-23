import { DefaultRootState } from 'react-redux';
import Home from './home.reducer';
import Login from './login.reducer';
import User from './user.reducer';
import Admin from './admin.reducer';
import OrderOverview from './order-overview.reducer';
import Case from './case.reducer';
import Advertise from './advertise.reducer';
import OrderDetail from './order-detail.reducer';
import Notification from './notification.reducer';
import Attachment from './attachment.reducer';
import RoleManagement from './rolemanagement.reducer';
const reducers = { Home, Login, User, Admin, OrderOverview, Case, OrderDetail, Notification, Attachment, Advertise , RoleManagement};

export type GlobalReducers = typeof reducers;

export type GlobalState = DefaultRootState & {
  [K in keyof GlobalReducers]: ReturnType<GlobalReducers[K]>;
};

export default reducers;