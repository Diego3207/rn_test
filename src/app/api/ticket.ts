export interface Ticket {
    id: number,
    ticketFolio: string,
    ticketCostumerId: number,
    ticketUserId:number,
    ticketDescription : string,
    ticketObservation : string,
    ticketStatus :string,
    ticket_active : boolean,
    ticketDevices: any,
    ticketEndDate: string,
}
