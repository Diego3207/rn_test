import { Message } from './message';

export interface QuotationSalePackage {
    id: number,
    quotationSalePackageQuotationSaleId: number,
    quotationSalePackagePackageId: number,
    quotationSalePackageUnit: string,
    quotationSalePackageQuantity: number,      
    quotationSalePackagePrice:number, 
    quotationSalePackageDiscount: number,  
    quotationSalePackageIsPercentageDiscount:boolean, 
    quotationSalePackageActive :boolean, 
     
}