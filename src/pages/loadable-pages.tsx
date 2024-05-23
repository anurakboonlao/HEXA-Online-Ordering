import { Spinner } from 'react-bootstrap';
import Loadable from 'react-loadable';
import layoutMainHOC from '../layouts/layout-main';
import layoutPlainHOC from '../layouts/layout-plain';

import './../scss/components/_loader.scss';

const DisplayLoadingPage = (
    <div className="loading-custom">
        <Spinner className="Loading-grow" animation="grow" variant="primary" />
        <Spinner className="Loading-grow" animation="grow" variant="primary" />
        <Spinner className="Loading-grow" animation="grow" variant="primary" />
    </div>);

const LoadableHome = Loadable({
    loader: () => import('./home.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableAdminDashboard = Loadable({
    loader: () => import('./admin-dashboard.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableUserManagement = Loadable({
    loader: () => import('./user-management.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableLogin = Loadable({
    loader: () => import('./login.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableNotfound = Loadable({
    loader: () => import('./not-found.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableError = Loadable({
    loader: () => import('./error.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableAdvertiseManagement = Loadable({
    loader: () => import('./advertise-management.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableCaseManagement = Loadable({
    loader: () => import('./case-management.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableOrderOverview = Loadable({
    loader: () => import('./order-overview.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableOrderStatus = Loadable({
    loader: () => import('./admin-order-status.page'),
    loading: () => (DisplayLoadingPage)
});

const LoadableAdminOrderStatus = Loadable({
    loader: () => import('./admin-order-detail.page'),
    loading: () => (DisplayLoadingPage)
})

const LoadableOrderDetail = Loadable({
    loader: () => import('./order-detail.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableCaseDetail = Loadable({
    loader: () => import('./case-detail.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableRoleManagement = Loadable({
    loader: () => import('./role-management.page'),
    loading : () => (DisplayLoadingPage)
});

const LoadableExternalLogin = Loadable({
    loader: () => import('./external-login.page'),
    loading: () => (DisplayLoadingPage)
});

const LoadableOrderReport = Loadable({
    loader: () => import('./admin-report.page'),
    loading: () => (DisplayLoadingPage)
});

export const Home = layoutMainHOC(LoadableHome);
export const UserManagement = layoutMainHOC(LoadableUserManagement);
export const AdminDashboard = layoutMainHOC(LoadableAdminDashboard);
export const Login = layoutPlainHOC(LoadableLogin);
export const Notfound = LoadableNotfound;
export const Error = LoadableError;
export const Advertise = layoutMainHOC(LoadableAdvertiseManagement);
export const CaseManagement = layoutMainHOC(LoadableCaseManagement);
export const CaseDetail = layoutMainHOC(LoadableCaseDetail);
export const OrderOverview = layoutMainHOC(LoadableOrderOverview);
export const OrderStatus = layoutMainHOC(LoadableOrderStatus);
export const OrderDetail = layoutMainHOC(LoadableOrderDetail);
export const AdminOrderDetail = layoutMainHOC(LoadableAdminOrderStatus);
export const ExternalLogin = LoadableExternalLogin;
export const OrderReport = layoutMainHOC(LoadableOrderReport);
export const RoleManagement = layoutMainHOC(LoadableRoleManagement);