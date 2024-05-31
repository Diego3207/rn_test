import { Message } from './message';

export interface Service {
    id: number,
    serviceDescription: string,
    serviceProviderId: number,
    servicePerDiem:number,
    serviceCoverZone: string,
    serviceReponseTime :number,
    serviceBill: boolean,
    servicePrice:number,
    serviceGuarranty:boolean,
    serviceActive :boolean 
}