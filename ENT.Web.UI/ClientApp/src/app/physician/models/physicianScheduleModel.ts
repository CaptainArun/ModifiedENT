import { PhysicianScheduleItemModel } from './physicianScheduleItemModel';

export class PhysicianScheduleModel {

  public ProviderScheduleID: number;
  public ProviderID: number;
  public FacilityID: number;
  public EffectiveDate: Date;
  public TerminationDate: Date;
  public TimeSlotDuration: number;
  public BookingPerSlot: number;
  public AppointmentAllowed: boolean;
  
  public ProviderName: string;
  public FacilityName: string;

  public Items: Array<PhysicianScheduleItemModel> = [];
}
