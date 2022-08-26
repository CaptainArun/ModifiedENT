import { NewPatientRegModel } from 'src/app/patient/models/newPatientRegModel';

export class AppointmentModel {

  public AppointmentID: number;
  public AppointmentDate: Date;
  public PatientID: number;
  public Reason: string;
  public Duration: string;
  public ProviderID: number;
  public FacilityID: number;
  public ToConsult: string;
  public AppointmentTypeID: number;
  public AppointmentStatusID: number;
  public CPTCode: number;
  public AddToWaitList: boolean;
  public IsRecurrence: boolean;
  public RecurrenceId: number;

  public PatientName: string;
  public ProviderName: string;
  public ProvSpeciality: string; 
  public FacilityName: string;
  public Appointmenttype: string;
  public Appointmentstatus: string;
  public AppointmentTime: string;
  public AppointmentFrom: Date;
  public AppointmentTo: Date;
  public AppointmentNo: string;


  //public patientRegModel: NewPatientRegModel;
}
