const PATH = {
  CLIENT: {
    DASHBAORD: "/Home",
    CASE_MANAGEMENT: "/CaseManagement",
    ORDER_OVERVIEW: "/OrderOverview",
    ORDER_OVERVIEW_DETAIL: "/OrderOverview/info/:id",
    ORDER_OVERVIEW_DETAIL_NOINFO: "/OrderOverview/info/",
    CASE_MANAGEMENT_ADD: "/CaseManagement/Add/:type",
    CASE_MANAGEMENT_ADD_NOTYPE: "/CaseManagement/Add/",
    CASE_MANAGEMENT_EDIT: "/CaseManagement/Edit/:id",
    CASE_MANAGEMENT_EDIT_NOTYPE: "/CaseManagement/Edit/",
    EXTERNAL_LOGIN: "/ExternalLogin/:token",
    /**
     * this is special case for edit new case, if press cancel it will delete case
     * so we can handle upload attach file easier
     */
    CASE_MANAGEMENT_EDIT_DELETABLE: "/CaseManagement/EditNew/:id",
    CASE_MANAGEMENT_EDIT_DELETABLE_NOTYPE: "/CaseManagement/EditNew/",
  },
  ADMIN: {
    DASHBAORD: "/AdminDashboard",
    ORDER_STATUS: "/OrderStatus",
    ORDER_STATUS_DETAIL: "/OrderStatus/info/:id",
    ORDER_STATUS_DETAIL_NOINFO: "/OrderStatus/info/",
    ORDER_REPORT: "/OrderReport",
    USER_MANAGEMENT: "/UserManagement",
    PRODUCT_MANAGEMENT: "/AdminManagement",
    ADVERTISE_MANAGEMENT: "/AdvertiseManagement",
    LOGIN: "/Admin/Login",
    ROLE_MANAGEMENT: "/RoleManagement",
  },
  ERROR: {
    SERVER_ERROR: "/Error",
  },
};

export default PATH;
