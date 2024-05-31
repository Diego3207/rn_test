import { Message } from './message';

export interface QuotationSale {
    id: number,
    quotationSaleSalesmanId:number,
    quotationSaleGuaranty: boolean,
    quotationSaleStatus: string,
    quotationSaleDateStatus: string,
    quotationSaleCommercialTerms:string,
    quotationSaleDiscount: number,
    quotationSaleIsPercentageDiscount:boolean,
    quotationSaleVAT: number, // traduccion exacta de IVA
    quotationSaleActive: number,
     
}