export interface Supply {
    id: number,
    supplyProductId: number,
    supplyPurchaseOrderId: number,
    supplySaleOrderId: number,
    supplyKey: string,
    supplyLocationId: number,
    supplyStatus: string,
    supplyAssignedPersonId: number,
    supplyDateSupplied: Date,
    supplyObservation: string,
    supplyIsSelected:boolean,
    supplyActive: number,
}

