import { Message } from './message';

export interface Provider {
    id: number,
    providerName: string,
    providerNationality:string,
    providerLine: string,
    providerActive:boolean;
  
     
}