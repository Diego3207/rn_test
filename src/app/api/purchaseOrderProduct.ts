import { Message } from './message';

export interface PurchaseOrderProduct {
    id: number,
    purchaseOrderProductPurchaseOrderId: number,    
    purchaseOrderProductProductId:number,    
    purchaseOrderProductUnit:string,    
    purchaseOrderProductQuantity: number,        
    purchaseOrderProductPrice: number,    
    purchaseOrderProductActive : boolean,

     
}