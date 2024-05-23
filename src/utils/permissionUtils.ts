import { IMenu, SideMenuPermissionEnum, SIDE_MENU, UserRoleEnum } from "../constants/constant";

export const createPermission = () => {
    let permission : { [key: string]: number } ={};
    permission[UserRoleEnum.None] = 0;
    permission[UserRoleEnum.Dentist] = SideMenuPermissionEnum.ClientDashboard | SideMenuPermissionEnum.CaseManagement | SideMenuPermissionEnum.OrderOverview;
    permission[UserRoleEnum.Clinic] = SideMenuPermissionEnum.ClientDashboard | SideMenuPermissionEnum.CaseManagement | SideMenuPermissionEnum.OrderOverview;
    permission[UserRoleEnum.Admin] = SideMenuPermissionEnum.AdminDashboard | SideMenuPermissionEnum.OrderStatus | SideMenuPermissionEnum.OrderReport | SideMenuPermissionEnum.UserManagement | SideMenuPermissionEnum.ProductManagement | SideMenuPermissionEnum.AdvertiseManagement | SideMenuPermissionEnum.RoleManagement;
    permission[UserRoleEnum.Staff] = SideMenuPermissionEnum.AdminDashboard | SideMenuPermissionEnum.OrderStatus | SideMenuPermissionEnum.OrderReport ;
    return permission;
}

const getPermissionRequireFromPathFactory = (paths: IMenu[]) => {
    return (path: string): number => {
        const lowerCasePathPermission = paths.reduce<any>((prev, { permission, path }) => ({
            ...prev,
            [path.toLowerCase()]: permission,
        }), {});
       
        if (!lowerCasePathPermission) {
            throw new Error(`this ${path} route doesn't initial`);
        }

        return lowerCasePathPermission[path.toLowerCase()];
    }
}

export const getPermissionRequiredFromSitePath = getPermissionRequireFromPathFactory(SIDE_MENU);

