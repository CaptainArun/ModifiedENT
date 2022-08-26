export class PatientVisitModel {
  public VisitId: number;
  public PatientId: number;
  public VisitDate: Date;
  public Visittime: string;
  public VisitTypeID: number;
  public RecordedDuringID: number;
  public UrgencyTypeID: number;
  public PatientArrivalConditionID: number;
  public FacilityID: number;
  public ToConsult: string;
  public ProviderID: number;
  public ReferringFacility: string;
  public ReferringProvider: string;
  public ConsultationType: string;
  public ChiefComplaint: string;
  public AccompaniedBy: string;
  public TransitionOfCarePatient: boolean;
  public TokenNumber: string;
  public Appointment: string;
  public VisitStatusID: number;
  public PatientNextConsultation: string;
  public AdditionalInformation: string;
  public SkipVisitIntake: boolean;
  public VisitReason: string;
  public VisitNo : string;   
  public patientArrivalCondition: string;
  public urgencyType: string;
  public visitStatus: string;
  public recordedDuring: string;
  public visitType: string;
  public PatientName: string;
  public ProviderName: string;
  public visitDateandTime: string;
  public AppointmentID: number;

}

export class PatientVisitSearchModel{
public FromDate : Date;
public ToDate : Date; 
public PatientId : number; 
public ProviderId : number;  
public VisitNo : string;
public AppointmentNo:string 
public FacilityId : number;
}