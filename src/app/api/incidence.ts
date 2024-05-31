export interface Incidence {
    id: number,
    incidenceCostumerId: number,
    incidenceSourceInformation: string,
    incidenceStartDateAttention: Date,
    incidenceInformant: string,
    incidenceType: string,
    incidenceQuadrant: string,
    incidenceStartDate: Date,
    incidenceEndDate: Date,
    incidenceDescriptionInvolvedPeople: string,
    incidenceDescriptionInvolvedVehicles: string,
    incidenceDependencyId: number,
    incidenceObservation: string,
    incidenceIsPositive: string,
    incidenceEndDateAttention: string,
    incidenceActive: boolean
}
