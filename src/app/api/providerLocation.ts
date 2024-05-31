import { Message } from './message';

export interface ProviderLocation {
    id: number,
    providerLocationProviderId: string,
    providerLocationDescription: string,
    providerLocationAdress:string
    providerLocationLng?: string,
    providerLocationLat?: string,
}
