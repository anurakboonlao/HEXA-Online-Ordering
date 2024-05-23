import { ProductDropDownTypeEnum } from "./caseManagement";

export interface IProductType{
  id:number,
  name:string
}

export interface IRoleManagement {
    id?:number,
    name: string;
    productTypeList: IProductType[];
    userCount:number
}

export const castTypeProductToId = (productEnum: ProductDropDownTypeEnum) => {
    switch(productEnum) {
      case ProductDropDownTypeEnum.CrownAndBridge:
        return 1;
      case ProductDropDownTypeEnum.Removable:
        return 2;
      case ProductDropDownTypeEnum.Orthodontic:
        return 3;
      case ProductDropDownTypeEnum.Orthopedic:
        return 4;
      case ProductDropDownTypeEnum.ICharm:
        return 5;
      default:
        return 0;
    }
  }

export const castIdProductToEnum = (productId: number) => {
    switch(productId) {
      case 1:
        return ProductDropDownTypeEnum.CrownAndBridge;
      case 2:
        return ProductDropDownTypeEnum.Removable;
      case 3:
        return ProductDropDownTypeEnum.Orthodontic;
      case 4:
        return ProductDropDownTypeEnum.Orthopedic;
      case 5:
        return ProductDropDownTypeEnum.ICharm;
      default:
        return ""
    }
  }