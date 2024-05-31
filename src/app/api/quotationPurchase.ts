import { Message } from './message';

export interface QuotationPurchase {
    id: number,
    quotationPurchaseProviderId: number,
    quotationPurchaseDescription: string,
    quotationPurchaseTimeDelivery: string,
    quotationPurchaseGuaranty: boolean,
    quotationPurchaseStatus: string,
    quotationPurchaseDateStatus: string,
    quotationPurchaseActive:boolean,
     
}