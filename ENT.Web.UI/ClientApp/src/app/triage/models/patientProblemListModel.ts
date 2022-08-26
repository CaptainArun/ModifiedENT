import { clsViewFile } from "src/app/patient/models/clsViewFile";

export class PatientProblemListModel {
  public ProblemlistId: number;
  public PatientId: number;
  public VisitId: number;
  public RecordedDate: Date;
  public RecordedBy: string;
  public ProblemTypeID: number;
  public ProblemDescription: string;
  public ICD10Code: string;
  public SNOMEDCode: string;
  public Aggravatedby: string;
  public DiagnosedDate: Date;
  public ResolvedDate: Date;
  public Status: string;
  public AttendingPhysican: string;
  public AlleviatedBy: string;
  public FileName: string;
  public Notes: string;
  public ProblemTypeDesc: string;
  public visitDateandTime: string;
  public recordedDuring: string;

  public FileUpload: File[];
  public ViewFileProblemList: Array<clsViewFile> = [];
}
