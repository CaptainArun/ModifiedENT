export class PatientAllergyModel {
 
  public AllergyId: number;
  public PatientId: number;
  public VisitId: number;
  public RecordedDate: Date;
  public RecordedBy: string;
  public AllergyTypeID: number;
  public Name: string;
  public Allergydescription: string;
  public Aggravatedby: string;
  public Alleviatedby: string;
  public Onsetdate: Date;
  public AllergySeverityID: number;
  public Reaction: string;
  public Status: string;
  public ICD10: string;
  public SNOMED: string;
  public Notes: string;

  public AllergyTypeDesc: string;
  public AllergySeverityDesc: string;

  public recordedDuring: string;
  public visitDateandTime: string;


}
