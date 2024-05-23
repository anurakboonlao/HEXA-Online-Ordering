import caseIcon from '../assets/svg/case-management.svg';
import orderIcon from '../assets/svg/order-overview.svg';
import dashboardIcon from '../assets/svg/dashboard.svg';
import orderStatusIcon from '../assets/svg/order-status.svg';
import orderReportIcon from '../assets/svg/order-report.svg';
import userManagementIcon from '../assets/svg/user-management.svg';
import productManagementIcon from '../assets/svg/product-management.svg';
import roleManagementIcon from '../assets/svg/role-management.svg';
import PATH from './path';

export enum SideMenuOption {
    Dashboard,
    CaseManagement,
    OrderOverview,
    AdminDashboard,
    OrderStatus,
    OrderReport,
    UserManagement,
    ProductManagement,
    AdvertiseManagement,
    RoleManagement
}

export enum UserRoleEnum {
    None = 'None',
    Dentist = 'Dentist',
    Clinic = 'Clinic',
    Admin = 'Admin',
    Staff = 'Staff'
}
export interface IMenu {
    path: string;
    name: string;
    menuId: SideMenuOption;
    logo:string;
    permission: number;
}

export enum SideMenuPermissionEnum {
    ClientDashboard = 0b100000000,
    CaseManagement = 0b010000000,
    OrderOverview = 0b001000000,
    AdminDashboard = 0b000100000,
    OrderStatus = 0b000010000,
    OrderReport = 0b000001000,
    UserManagement = 0b000000100,
    RoleManagement = 0b000000010,
    ProductManagement = 0b000000000,
    AdvertiseManagement = 0b0000000001
}

export enum PermissionResultEnum {
    Access = 0b1,
    Denied = 0b0,
}

export const SIDE_MENU: IMenu[] = [
    {
        path: PATH.CLIENT.DASHBAORD,
        menuId: SideMenuOption.Dashboard,
        name: 'Dashboard',
        logo: dashboardIcon,
        permission: SideMenuPermissionEnum.ClientDashboard
    },
    {
        path: PATH.CLIENT.CASE_MANAGEMENT,
        menuId: SideMenuOption.CaseManagement,
        name: 'Case Management',
        logo: caseIcon,
        permission: SideMenuPermissionEnum.CaseManagement
    },
    {
        path: PATH.CLIENT.ORDER_OVERVIEW,
        menuId: SideMenuOption.OrderOverview,
        name: 'Order Overview',
        logo: orderIcon,
        permission: SideMenuPermissionEnum.OrderOverview
    },

    {
        path: PATH.ADMIN.DASHBAORD,
        menuId: SideMenuOption.AdminDashboard,
        name: 'Dashboard',
        logo: dashboardIcon,
        permission: SideMenuPermissionEnum.AdminDashboard
    },
    {
        path: PATH.ADMIN.ORDER_STATUS,
        menuId: SideMenuOption.OrderStatus,
        name: 'Order Status',
        logo: orderStatusIcon,
        permission: SideMenuPermissionEnum.OrderStatus
    },
    {
        path: PATH.ADMIN.ORDER_REPORT,
        menuId: SideMenuOption.OrderReport,
        name: 'Order Report',
        logo: orderReportIcon,
        permission: SideMenuPermissionEnum.OrderReport
    },
    {
        path: PATH.ADMIN.ADVERTISE_MANAGEMENT,
        menuId: SideMenuOption.AdvertiseManagement,
        name: 'Ads Management',
        logo: productManagementIcon,
        permission: SideMenuPermissionEnum.AdvertiseManagement
    },
    {
        path: PATH.ADMIN.USER_MANAGEMENT,
        menuId: SideMenuOption.UserManagement,
        name: 'User Management',
        logo: userManagementIcon,
        permission: SideMenuPermissionEnum.UserManagement
    },
    {
        path: PATH.ADMIN.ROLE_MANAGEMENT,
        menuId: SideMenuOption.RoleManagement,
        name: 'Role Management',
        logo: roleManagementIcon,
        permission: SideMenuPermissionEnum.RoleManagement
    },
    {
        path: PATH.ADMIN.PRODUCT_MANAGEMENT,
        menuId: SideMenuOption.ProductManagement,
        name: 'Product Management',
        logo: productManagementIcon,
        permission: SideMenuPermissionEnum.ProductManagement
    }

]

export enum DatePeriodOptionEnum {
    All='All',
    CustomRange='Custom Range',
    Today='Today',
    Yesterday='Yesterday',
    Last7Days='Last 7 Days',
    Last30Days = 'Last 30 Days',
    ThisMonth = 'This Month',
    PreviousMonth='Previous Month'
}


export enum ClientFilterEnum {
    // All='All',
    Patient='Patient',
    // ProductType='Product Type',
    // CaseType='Case Type',

}

export enum ClientReportFilterEnum {
    All='All',
    Patient='Patient',
    Dentist='Dentist',
    Clinic='Clinic/Hospital',
    OrderRef='Order Id',
    Product='Product',
    // CaseType='Case Type',

}

export const FIRST_DATE: Date = new Date(2021,0,1);

export const NOTI_FETCH_LIMIT: number = 30; // limit first fetch notification