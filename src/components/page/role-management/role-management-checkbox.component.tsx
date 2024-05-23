import { FC, useEffect } from "react";
import "../../../scss/page/role-management/_roleManagement.scss";
import { ProductDropDownTypeEnum } from "../../../constants/caseManagement";
import { IRoleManagement, castTypeProductToId } from "../../../constants/roleManagement";
interface IRoleManagementDropdownProps {
  role: IRoleManagement;
  handleSetSelected: (productType: number) => void;
}

const RoleManagementDropdown: FC<IRoleManagementDropdownProps> = ({
  role,
  handleSetSelected,
}) => {
  const checkboxList = Object.values(ProductDropDownTypeEnum).slice(1).map(value => (
    <div className="div-product-type" key={value}>
      <input
        type="checkbox"
        className="checkbox-product-type"
        id={value}
        value={value}
        checked={role.productTypeList && role.productTypeList.some(item => item.id === castTypeProductToId(value) && item.name.toLowerCase() === value.toLowerCase())}
        onChange={() => handleSetSelected(castTypeProductToId(value))}
      ></input>
      <label htmlFor={value} className="text-product-type">{value}</label>
    </div>
  ));

  return (
    <>
      {checkboxList}
    </>
  );
};
export default RoleManagementDropdown;