export class ProcedureModel {
  public procedureId: number;
  public VisitID: number;
  public RecordedDate: Date;
  public RecordedBy: string;
  public PrimaryCPT : string;
  public ChiefComplaint: string;
  public DiagnosisNotes: string;
  public PrimaryICD: string;
  public TreatmentType: string;
  public RequestedprocedureId: number;
  public ProcedureNotes : number;
  public Proceduredate: Date;
  public ProcedureStatus: string;
  public IsReferred: boolean;
  public ReferralNotes: string;
  public FollowUpNotes: string;
  public AdditionalNotes: string;
}
