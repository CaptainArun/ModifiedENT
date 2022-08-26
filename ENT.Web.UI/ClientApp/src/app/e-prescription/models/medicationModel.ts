import { MedicationItemsModel } from "./medicationItemsModel";

export class MedicationModel {
    MedicationId: number;
    VisitID: number;
    AdmissionID: number;
    MedicationPhysician : number;
    TakeRegularMedication: boolean;
    IsHoldRegularMedication: boolean;
    HoldRegularMedicationNotes: string;
    IsDiscontinueDrug: boolean;
    DiscontinueDrugNotes: string;
    IsPharmacist: boolean;
    PharmacistNotes: string;
    IsRefill: boolean;
    RefillCount: number;
    RefillDate: Date;
    RefillNotes: string;
    MedicationStatus: string;
    MedicationNumber: string;
    UserName : string;
    Password : string;
    medicationItems: MedicationItemsModel[];
}