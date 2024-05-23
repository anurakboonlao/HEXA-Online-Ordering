import dayjs from "dayjs";

import PATH from "./constants/path";
import { Home, UserManagement, AdminDashboard, Login, Notfound, Error, CaseManagement, CaseDetail, OrderOverview, OrderDetail, ExternalLogin, Advertise, OrderStatus, AdminOrderDetail, OrderReport, RoleManagement } from "./pages/loadable-pages";
import { filterAdminDashboard, getUserList } from "./redux/actions/admin.actions";
import { callClientDashboard } from "./redux/actions/home.actions";
import { clearAttachmentFileState, getAttachmentFile, getAttachmentFileByOrderId } from "./redux/actions/attachment.action";
import { addNewCasePass, loadGetCaseList, getCase, handleCancelToDeleteCase } from "./redux/actions/case.actions";
import { getOrderDetail } from "./redux/actions/order-detail.action";
import { getAllOrders, getOrderOverview, getReportOrders } from "./redux/actions/order-overview.action";
import { getRoleDataInUserManagement, getRoleManagementData } from "./redux/actions/rolemanagement.action";
import { authUser } from "./redux/actions/user.actions";
import { getSubContact } from "./redux/actions/login.actions";
import { getAdsList } from "./redux/actions/advertise.actions";

export interface IRouteConfig {
  path: string;
  component: React.ComponentClass | React.FC;
  documentTitle: string;
  postFetchData?: Array<any>;
  requireAuth?: boolean;
  requirePermissionValidate?: boolean;
  location?: any;
}

export const routes : IRouteConfig[] = [
    {
        path: PATH.CLIENT.DASHBAORD,
        component: Home,
        documentTitle : 'Dashbaord',
        requireAuth: true,
        requirePermissionValidate: true,
        postFetchData: [
          (dispatch: any) => dispatch(authUser()),
          (dispatch: any) => dispatch(callClientDashboard((dayjs(new Date()).add(-7,'day')).toDate(),new Date())),
          (dispatch: any) => dispatch(getAdsList(true))
        ]
    },
    {
      path: PATH.ADMIN.ROLE_MANAGEMENT
      , component: RoleManagement
      , documentTitle : 'Role Management'
      , requireAuth: true
      , requirePermissionValidate: true
      , postFetchData: [
        (dispatch: any) => dispatch(authUser()),
        (dispatch: any) => dispatch(getRoleManagementData())
      ]
    },
    {
        path: PATH.ADMIN.DASHBAORD,
        component: AdminDashboard,
        documentTitle : 'Dashbaord',
        requireAuth: true,
        requirePermissionValidate: true,
        postFetchData: [
          (dispatch: any) => dispatch(authUser()),
          (dispatch: any) => dispatch(filterAdminDashboard((dayjs(new Date()).add(-7,'day')).toDate(),new Date()))
        ]
    },
    {
        path: PATH.ADMIN.USER_MANAGEMENT,
        component:UserManagement,
        documentTitle : 'User Management',
        requireAuth: true,
        requirePermissionValidate: true,
        postFetchData: [
          (dispatch: any) => dispatch(authUser())
          , (dispatch: any) => dispatch(getUserList()),
          (dispatch: any) => dispatch(getRoleDataInUserManagement())
        ]
    },
    {
      path: PATH.ADMIN.ORDER_STATUS,
      component: OrderStatus,
      documentTitle: 'Order Status',
      requireAuth: true,
      requirePermissionValidate: true,
      postFetchData: [
         (dispatch: any) => dispatch(authUser()),
        (dispatch: any) => dispatch(getAllOrders())
      ]
    },
    {
      path: PATH.ADMIN.ORDER_REPORT,
      component: OrderReport,
      documentTitle: 'Order Report',
      requireAuth: true,
      requirePermissionValidate: true,
      postFetchData: [
         (dispatch: any) => dispatch(authUser()),
        (dispatch: any) => dispatch(getReportOrders())
      ]
    },
    {
      path: PATH.ADMIN.ORDER_STATUS_DETAIL,
      component: AdminOrderDetail,
      documentTitle: 'Order Status Detail',
      requireAuth: true,
      requirePermissionValidate: true,
      postFetchData: [
        (dispatch: any) => dispatch(authUser()),
        (dispatch: any, match: any, location: any) => {
          const { params } = match;
          dispatch(getOrderDetail(params.id));
          dispatch(getAttachmentFileByOrderId(params.id));
        }
      ]
    },
    {
        path: PATH.CLIENT.CASE_MANAGEMENT,
        component:CaseManagement,
        documentTitle : 'Case Management',
        requireAuth: true,
        requirePermissionValidate: true,
        postFetchData: [
          (dispatch: any) => dispatch(authUser())
          , (dispatch: any) => dispatch(loadGetCaseList())
        ]
    },
    {
        path: PATH.CLIENT.CASE_MANAGEMENT_ADD,
        component:CaseDetail,
        documentTitle : 'Case Management',
        requireAuth: true,
        requirePermissionValidate: true,
        postFetchData: [
          (dispatch: any) => dispatch(authUser()),
          (dispatch:any) => dispatch(handleCancelToDeleteCase(false)),
          (dispatch: any) => dispatch(clearAttachmentFileState()), // clear attachment file state
          (dispatch: any, match: any, location: any) => {
            const { params } = match;
            dispatch(addNewCasePass(params.type));
            dispatch(getAttachmentFile(params.id));
          }]
    },
    {
        path: PATH.CLIENT.CASE_MANAGEMENT_EDIT,
        component: CaseDetail,
        documentTitle: 'Case Management',
        requireAuth: true,
        requirePermissionValidate: true,
        postFetchData: [(
          dispatch: any) => dispatch(authUser()),
          (dispatch:any) => dispatch(handleCancelToDeleteCase(false)),
          (dispatch: any, match: any, location: any) => {
          const { params } = match;
          dispatch(getCase(params.id));
          dispatch(getAttachmentFile(params.id));
        }]
    },
    {
      path: PATH.CLIENT.CASE_MANAGEMENT_EDIT_DELETABLE,
      component: CaseDetail,
      documentTitle: 'Case Management',
      requireAuth: true,
      requirePermissionValidate: true,
      postFetchData: [(
        dispatch: any) => dispatch(authUser()),
        (dispatch:any) => dispatch(handleCancelToDeleteCase(true)),
        (dispatch:any)=> dispatch(clearAttachmentFileState()),
        (dispatch: any, match: any, location: any) => {
        const { params } = match;
        dispatch(getCase(params.id));
        dispatch(getAttachmentFile(params.id));
      }]
  },
  {
    path: PATH.CLIENT.CASE_MANAGEMENT_EDIT,
    component: CaseDetail,
    documentTitle: 'Case Management',
    requireAuth: true,
    requirePermissionValidate: true,
    postFetchData: [(
      dispatch: any) => dispatch(authUser()),
    (dispatch: any) => dispatch(handleCancelToDeleteCase(false)),
    (dispatch: any, match: any, location: any) => {
      const { params } = match;
      dispatch(getCase(params.id));
      dispatch(getAttachmentFile(params.id));
    }]
  },
  {
    path: PATH.CLIENT.CASE_MANAGEMENT_EDIT_DELETABLE,
    component: CaseDetail,
    documentTitle: 'Case Management',
    requireAuth: true,
    requirePermissionValidate: true,
    postFetchData: [(
      dispatch: any) => dispatch(authUser()),
    (dispatch: any) => dispatch(handleCancelToDeleteCase(true)),
    (dispatch: any) => dispatch(clearAttachmentFileState()),
    (dispatch: any, match: any, location: any) => {
      const { params } = match;
      dispatch(getCase(params.id));
    }]
  }, {
    path: PATH.CLIENT.ORDER_OVERVIEW,
    component: OrderOverview,
    documentTitle: 'Order Overview',
    requireAuth: true,
    requirePermissionValidate: true,
    postFetchData: [
      (dispatch: any) => dispatch(authUser()),
      (dispatch: any) => dispatch(getOrderOverview()),
    ]
  },
  {
    path: PATH.CLIENT.ORDER_OVERVIEW_DETAIL,
    component: OrderDetail,
    documentTitle: 'Order Overview Detail',
    requireAuth: true,
    requirePermissionValidate: true,
    postFetchData: [
      (dispatch: any) => dispatch(authUser()),
      (dispatch: any, match: any, location: any) => {
        const { params } = match;
        dispatch(getOrderDetail(params.id));
        dispatch(getAttachmentFileByOrderId(params.id));
      }
    ]
  },
  {
    path: PATH.CLIENT.EXTERNAL_LOGIN,
    component: ExternalLogin,
    documentTitle: 'Validate User',
    requireAuth: false,
    requirePermissionValidate: false,
    postFetchData: [
      (dispatch: any, match: any) => {
        const { params } = match;
        dispatch(getSubContact(params.token));
      }
    ]
  },
  {
    path: PATH.ADMIN.ADVERTISE_MANAGEMENT,
    component: Advertise,
    documentTitle: 'Advertisement Management',
    postFetchData: [
      (dispatch: any) => dispatch(authUser()),
      (dispatch: any) => dispatch(getAdsList())
    ]
  },
  {
    path: PATH.ADMIN.LOGIN,
    component: Login,
    documentTitle: 'Login'
  },
  {
    path: PATH.ERROR.SERVER_ERROR,
    component: Error,
    documentTitle: 'Error'
  },
  {
    path: '',
    component: Notfound,
    documentTitle: 'Not found Page'
  }
];