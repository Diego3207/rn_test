import { Message } from './message';

export interface QuotationSaleService {
    id: number,
    quotationSaleServiceQuotationSaleId: number,
    quotationSaleServiceServiceId: number,
    quotationSaleServiceUnit: string,
    quotationSaleServiceQuantity: number,    
    quotationSaleServicePrice: number, 
    quotationSaleServiceDiscount: number,  
    quotationSaleServiceIsPercentageDiscount:boolean,  
    quotationSaleServiceActive : boolean,    
     
}