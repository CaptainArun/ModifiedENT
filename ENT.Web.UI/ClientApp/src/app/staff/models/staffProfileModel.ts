import { StaffAddressModel } from '../models/staffAddressModel'
import { StaffEducationModel } from '../models/staffEducationModel';
import { StaffWorkHistoryModel } from '../models/staffWorkHistoryModels'
import { StaffFamilyModel } from '../models/staffFamilyModel'
import { StaffLanguageModel } from '../models/staffLanguageModel';
import { StaffHobbyModel } from '../models/staffHobbyModel';
import { StaffcampusModel } from '../models/staffcampusModel';

export class StaffProfileModel {
  public EmployeeId: number;
  public UserId: string;
  public FacilityId: string;
  public RoleId: number;
  public IsActive: boolean;
  public EmployeeDepartment: number;
  public EmployeeCategory: number;
  public EmployeeUserType: number;
  public EmployeeNo: string;
  public DOJ: Date;
  public SchedulerDepartment: number;
  public AdditionalInfo: string;
  public EmployeeSalutation: number;
  public EmployeeFirstName: string;
  public EmployeeMiddleName: string;
  public EmployeeLastName: string;
  public Gender: number;
  public EmployeeDOB: Date;
  public EmployeeAge: number;
  public EmployeeIdentificationtype1: number;
  public EmployeeIdentificationtype1details: string;
  public EmployeeIdentificationtype2: number;
  public EmployeeIdentificationtype2details: string;
  public MaritalStatus: string;
  public MothersMaiden: string;
  public PreferredLanguage: string;
  public Bloodgroup: string;
  public CellNo: string;
  public PhoneNo: string;
  public WhatsAppNo: string;
  public EMail: string;
  public EmergencySalutation: number;
  public EmergencyFirstName: string;
  public EmergencyLastName: string;
  public EmergencyContactType: number;
  public EmergencyContactNo: string;
  public TelephoneNo: string;
  public Fax: string;
  public RelationshipToEmployee: number;

  public staffAddressDetails: Array<StaffAddressModel> = [];
  public staffEducationDetails: Array<StaffEducationModel> = [];
  public staffWorkDetails: Array<StaffWorkHistoryModel> = [];
  public staffFamilyDetails: Array<StaffFamilyModel> = [];
  public staffLanguageDetails: Array<StaffLanguageModel> = [];
  public staffHobbyDetails: Array<StaffHobbyModel> = [];
  public staffCampusDetails: Array<StaffcampusModel> = [];
}
