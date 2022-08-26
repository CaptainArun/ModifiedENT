import { ELabRequestModel } from "./eLabRequestModel";
import { MedicationRequestsModel } from "./medicationRequestsModel";

export class DischargeModel {
  public DischargeSummaryId: number;
  public RecommendedProcedure: string;
  public AdmissionNumber: string;
  public AdmissionDate: Date;
  public AdmittingPhysician: string;
  public PreProcedureDiagnosis: string;
  public PlannedProcedure: string;
  public Urgency: string;
  public AnesthesiaFitnessNotes: string;
  public OtherConsults: string;
  public PostOperativeDiagnosis: string;
  public BloodLossInfo: string;
  public Specimens: string;
  public PainLevelNotes: string;
  public Complications: string;
  public ProcedureNotes: string;
  public AdditionalInfo: string;
  public FollowUpDate: Date;
  public FollowUpDetails: string;
  public DischargeStatus: string;
  public medicationRequest: MedicationRequestsModel;
  public elabRequest: ELabRequestModel;
}
