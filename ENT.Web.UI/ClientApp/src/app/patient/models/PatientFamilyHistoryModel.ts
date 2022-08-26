export class PatientFamilyHistoryModel {
  public FamilyHealthHistoryID: number = 1;
  public VisitID: number = 1;
  public ICDCode: string;
  public RecordedDate: Date;
  public RecordedBy: string;
  public FamilyMemberName: string;
  public FamilyMemberAge: number;
  public Relationship: string;
  public DiagnosisNotes: string;
  public IllnessType: string;
  public ProblemStatus: string;
  public PhysicianName: string;
  public AdditionalNotes: string;
  /*public Createddate: Date;
  public CreatedBy: Date;
  public ModifiedDate: Date;
  public ModifiedBy: string*/
  public RecordedTime: string;
  public visitDateandTime: string;
  public recordedDuring: string;
}
