import { Message } from './message'

export interface EvidenceInstallation {
    id:number,  
    evidenceInstallationPath: string,
    evidenceInstallationSize: number,
    evidenceInstallationName: string,
    evidenceInstallationDescription:string,
    evidenceInstallationActive : boolean,
}