import { Message } from './message';

export interface IncidenceInvolvedDevice {
        id: number,
    incidenceInvolvedDeviceMonitoringDeviceId:number,
    incidenceInvolvedDeviceIncidenceId: number,
    incidenceInvolvedDeviceFailed: boolean,
    incidenceInvolvedDeviceActive: boolean
     
}