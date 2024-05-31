import { Message } from './message';

export interface PurchaseOrderService {
    id: number,
    purchaseOrderServicePurchaseOrderId: number,    
    purchaseOrderServiceProductId:number,    
    purchaseOrderServiceUnit:string,    
    purchaseOrderServiceQuantity: number,        
    purchaseOrderServicePrice: number,    
    purchaseOrderServiceActive : boolean,

     
}