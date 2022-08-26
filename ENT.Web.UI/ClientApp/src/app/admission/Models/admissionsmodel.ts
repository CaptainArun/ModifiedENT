export class admissionsmodel {

  public AdmissionID: number;
  public PatientID: number;
  public ProcedureRequestId: number;
  public AdmissionDateTime: Date;
  public AdmissionNo: string;
  public AdmissionOrigin: string;
  public AdmissionType: number;
  public AdmittingPhysician: number;
  public SpecialityID: number;
  public AdmittingReason: string;
  public PreProcedureDiagnosis: string;
  public ICDCode: string;
  public ProcedureType: number;
  public PlannedProcedure: string;
  public ProcedureName: number;
  public CPTCode: string;
  public UrgencyID: number;
  public PatientArrivalCondition: number;
  public PatientArrivalBy: number;
  public PatientExpectedStay: string;
  public AnesthesiaFitnessRequired: boolean;
  public AnesthesiaFitnessRequiredDesc: string;
  public BloodRequired: boolean;
  public BloodRequiredDesc: string;
  public ContinueMedication: boolean;
  public InitialAdmissionStatus: number;
  public InstructionToPatient: string;
  public AccompaniedBy: string;
  public WardAndBed: string;
  public AdditionalInfo: string;
  public FacilityID: number;
}
