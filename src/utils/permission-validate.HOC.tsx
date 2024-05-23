import React, { ComponentClass, FC } from "react";
import { connect } from 'react-redux'
import { GlobalState } from "../redux/reducers";
import { IRouteConfig } from "../routes";


import { PermissionResultEnum, UserRoleEnum } from "../constants/constant";
import PATH from "../constants/path";
import { getPermissionRequiredFromSitePath } from "./permissionUtils";

type ValidatePermissionProps = ReturnType<typeof mapStateToProps> & IRouteConfig;

/**
 * This HOC use for validate page
 */
const validatePermissionHOC = (WrappedComponent: ComponentClass | FC) => {
  return class validatePermission extends React.Component<ValidatePermissionProps> {

    componentDidUpdate(prev: ValidatePermissionProps) {

      const { path, userRolePermission, payload } = this.props;
      if (payload) {
        const mainPath = getMainPath(path); // This can be improve later
        const role = payload.role;
        const permission = getPermissionRequiredFromSitePath(mainPath);
        const hasPermission = (userRolePermission & permission) !== PermissionResultEnum.Denied;

        if (!hasPermission) {
          if (role === UserRoleEnum.Admin || role === UserRoleEnum.Staff) {
            window.location.href = PATH.ADMIN.DASHBAORD;
          }
          else if (role === UserRoleEnum.Clinic || role === UserRoleEnum.Dentist) {
            window.location.href = PATH.CLIENT.DASHBAORD;
          }
          else {
            window.location.href = `${process.env.REACT_APP_MARKETING_URL}`;
          }
        }
      }
      else
        window.location.href = `${process.env.REACT_APP_MARKETING_URL}`;
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }
}

const getMainPath = (path: string) => {
  let pathArray = path.split('/');
  if (pathArray && pathArray.length > 1) {
    return "/" + pathArray[1];
  }
  else {
    return path;
  }
}

const mapStateToProps = (state: GlobalState) => {
  const { userRolePermission, payload } = state.User;
  return {
    userRolePermission,
    payload
  };
}

const connectedReduxValidatePermissionHOC = (WrappedComponent: ComponentClass | FC) =>
  connect(mapStateToProps)(validatePermissionHOC(WrappedComponent));

export default connectedReduxValidatePermissionHOC
