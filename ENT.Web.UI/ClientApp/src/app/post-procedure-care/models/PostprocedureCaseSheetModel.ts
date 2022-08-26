export class PostprocedureCaseSheetModel {
 public PostProcedureID: number;
  public  PreProcedureID: number;
  public  RecordedDate: Date;
  public  RecordedDuring: number;
  public  RecordedBy: string;
  public  ProcedureStartDate: Date;
  public  ProcedureEndDate: Date;
  public  AttendingPhysician: number;
  public  ProcedureNotes: string;
  public  ProcedureName: number;
  public PrimaryCPT: string;
  public  Specimens: string;
  public DiagnosisNotes: string;
  public Complications: string;
  public BloodLossTransfusion: string;
  public  AdditionalInfo: string;
  public  ProcedureStatus: string;
  public  ProcedureStatusNotes: string;
  public  PatientCondition: number;
  public PainLevel: number;
  public  PainSleepMedication: string;
  public SignOffDate: Date;
  public SignOffUser: string;
  public SignOffStatus: boolean;
}
