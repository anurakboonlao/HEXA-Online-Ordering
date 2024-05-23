

export interface notificationModel {
    title:string;
    message:string;
    userId:number;
}

export interface receiveNotification {
    id:number;
    title:string;
    message:string;
    read:boolean;
    createDate:Date;
    lastUpdateDate:Date;
    userId:number;
}

export interface receiveNotificationsWithTotal {
    notification : receiveNotification[];
    totalNotification : number;
}