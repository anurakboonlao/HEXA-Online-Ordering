export interface IAdvertise {
    id: number;
    name: string;
    filePath: string;
    file?: File;
    disabled: boolean;
    startDate?: Date;
    endDate?: Date;
    orderNumber: number;
    url: string;
}

export interface IAdvertiseReorder {
    avertisementId: number;
    currentOrder: number;
    moveUp: boolean;
}