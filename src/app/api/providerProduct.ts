import { Message } from './message';

export interface ProviderProduct {
    id: number,
    providerProductProviderId: number,
    providerProductProductId: number,
    providerProductGuaranteeUnit: number,
    providerProductGuaranteeUnitMeasure: string,
    providerProductGuaranteeSpecifications: string, 
}
