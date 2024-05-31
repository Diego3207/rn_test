export interface SaleOrder {
    id:number,  
    saleOrderQuotationSaleId: string,
    saleOrderCfdiId: string,
    saleOrderPayWayId: string,
    saleOrderPayMethodId: string,
    saleOrderDate: Date,
    saleOrderShippingDate: Date,
    saleOrderShippingAddress:string,
    saleOrderAdditionalComments:string,
    saleOrderTransmitter: number,
    saleOrderSupplies: any,
    saleOrderStatus: string,
    saleOrderProducts: any
}

