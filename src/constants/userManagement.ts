export interface userManagement {
    userId: number;
    username: string;
    name: string;
    password: string;
    userRoleId:number;
    role:string;
    confirmPassword: string;
}

export interface adminRoleDefinition {
    value: string,
    displayText: string
}
export const roleDDL :adminRoleDefinition[]  = [
    {value: '3',displayText:'Admin'},
    {value: '4',displayText:'Staff'}
];