import { Message } from './message';

export interface PurchaseOrderEvidence {
    id:number,  
    purchaseOrderEvidencePurchaseOrderId: number,
    purchaseOrderEvidencePath: string,
    purchaseOrderEvidenceSize: number,
    purchaseOrderEvidenceActive : boolean,
     
}