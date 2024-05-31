import { Message } from './message';

export interface PurchaseOrder {
    id:number,  
    purchaseOrderProviderId: number,
    purchaseOrderQuotationPurchaseId: number,
    purchaseOrderServicePrice: number;
    purchaseOrderGuaranty: boolean,
    purchaseOrderStatus:string,
    purchaseOrderUserReceivedId:number,
    purchaseOrderDateStatus: Date,
    purchaseOrderStatusObservation: string,
    purchaseOrderActive:boolean
     
}