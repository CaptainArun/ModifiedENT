import { TriageMedicationRequestItemsModel } from "./triagemedicationRequestItemsModel";

export class TriageMedicationRequestsModel {
    public MedicationRequestId: number;
    public VisitID: number;
    public AdmissionID: number;
    public TakeRegularMedication: boolean;
    public IsHoldRegularMedication: boolean;
    public HoldRegularMedicationNotes: string;
    public IsDiscontinueDrug: boolean;
    public DiscontinueDrugNotes: string;
    public IsPharmacist: boolean;
    public PharmacistNotes: string;
    public IsRefill: boolean;
    public RefillCount: number;
    public RefillDate: Date;
    public RefillNotes: string;
    public MedicationRequestStatus: string;
    public medicationRequestItems: TriageMedicationRequestItemsModel[];
}