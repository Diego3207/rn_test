import { Message } from './message';

export interface QuotationSaleProduct {
    id: number,
    quotationSaleProductQuotationSaleId: number,
    quotationSaleProductProductId: number,
    quotationSaleProductUnit: string,
    quotationSaleProductQuantity: number,    
    quotationSaleProductPrice: number, 
    quotationSaleProductDiscount: number,
    quotationSaleProductIsPercentageDiscount:boolean,    
    quotationSaleProductActive : boolean,    
     
}