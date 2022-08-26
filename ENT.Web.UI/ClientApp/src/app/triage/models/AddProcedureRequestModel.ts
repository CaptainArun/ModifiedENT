export class AddProcedureRequestModel{
    public ProcedureRequestId : number;
       public VisitID : number;
       public ProcedureRequestedDate : Date;
       public ProcedureType : number;
       public AdmittingPhysician : number;
       public ApproximateDuration : string;
       public UrgencyID : number;
       public PreProcedureDiagnosis : string;
       public ICDCode : string;
       public PlannedProcedure : string;
       public ProcedureName : number;
       public CPTCode : string;
       public AnesthesiaFitnessRequired : boolean;
       public BloodRequired : boolean;
       public ContinueMedication : boolean;
       public StopMedication : boolean;
       public SpecialPreparation : boolean;
       public SpecialPreparationNotes : string;
       public DietInstructions : boolean;
       public DietInstructionsNotes : string;
       public OtherInstructions : boolean;
       public OtherInstructionsNotes : string;
       public Cardiology : boolean;
       public Nephrology : boolean;
       public Neurology : boolean;
       public OtherConsults : boolean; 
       public OtherConsultsNotes : string;
       public AdmissionType : number;
       public PatientExpectedStay : string;
       public InstructionToPatient : string;
       public AdditionalInfo : string;
       public AnesthesiaFitnessRequiredDesc : string;
       public BloodRequiredDesc : string;
       
}
