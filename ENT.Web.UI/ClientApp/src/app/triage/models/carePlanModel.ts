export class CarePlanModel {
  public CarePlanId: number;
  public VisitID: number;
  public patientId: number;
  public providerId: number;
  public RecordedDate: Date;
  public RecordedBy: string; 
  public PlanningActivity: string; 
  public Duration: string;
  public StartDate: Date; 
  public EndDate: Date; 
  public CarePlanStatus: string; 
  public Progress: string;
  public NextVisitDate: Date;
  public AdditionalNotes: string; 
}

