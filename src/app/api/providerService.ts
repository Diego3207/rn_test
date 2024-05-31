import { Message } from './message';

export interface ProviderService {
    id: number,
    providerServiceProviderId: number,
    providerProductServiceId: number,
    providerServiceGuaranteeUnit: number,
    providerServiceGuaranteeUnitMeasure: string,
    providerServiceGuaranteeSpecifications: string,
}
