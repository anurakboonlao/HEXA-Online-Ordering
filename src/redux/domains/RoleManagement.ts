export interface IProductType{
    id:number,
    name:string
  }
  
  export interface IRoleManagement {
    id:number,
    name: string;
    userCount?:number,
    productTypeList: IProductType[];
  }
  export interface IRoleManagementResponse {
    id: number,
    roleManagement:IRoleManagement[],
    isDeleteing:boolean,
    deleted:boolean,
    isAdding:boolean,
    added:boolean,
    isGetting:boolean,
    getting:boolean,
    isUpdating:boolean,
    updated:boolean,
    errorMessage:string
  }