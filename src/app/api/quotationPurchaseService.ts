import { Message } from './message';

export interface QuotationPurchaseService {
    id: number,
    quotationPurchaseServiceQuotationPurchaseId: number,
    quotationPurchaseServiceServiceId:number,
    quotationPruchaseServiceUnit: string,
    quotationPruchaseServiceQuantity:number,      
    quotationPruchaseServicePrice: number,    
    quotationPruchaseServiceActive :boolean,  
       
     
}