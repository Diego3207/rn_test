import { Message } from './message';

export interface QuotationPurchaseProduct {
    id: number,
    quotationPurchaseProductQuotationPurchaseId: number,
    quotationPruchaseProductProductId: number,
    quotationPruchaseProductUnit: string,
    quotationPruchaseProductQuantity:number,      
    quotationPruchaseProductPrice: number,    
    quotationPruchaseProductActive : boolean,  
     
}