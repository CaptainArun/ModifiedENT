export class radiologyModel {
  public RadiologyID : number;
  public VisitID: number;
  public RecordedDate : Date;
  public RecordedBy: string;
  public OrderingPhysician: string;
  public NarrativeDiagnosis: string;
  public PrimaryICD: string;
  public RadiologyProcedure : string;
  public Type: string;
  public Section: string;
  public ContrastNotes: string;
  public PrimaryCPT: string;
  public ProcedureRequestedDate: Date;
  //public ProcedureRequestTime: string;
  public InstructionsToPatient: string;
  public ProcedureStatus: string;
  public ReferredLab: boolean;
  public ReferredLabValue: string;
  public ReportFormat : string;
  public AdditionalInfo: string;
  public RecordedTime: string;
  //public PatientName: string;
  public visitDateandTime: string;
  public recordedDuring: string;
}
