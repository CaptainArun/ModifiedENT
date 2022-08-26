import { FacilityModel } from './facility.model';

export class RegistrationModel {
  UserFirstName: string;
  UserLastName: string;
  RoleName: string;
  FacilityName: string;
  Gender: string;
  DateofBirth: string;
  Age: number;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  ZipCode: string;
  DRUserPhone: string;
  Email: string;
  LoginPassword: string;
  FacilityID: number;
  DRRoleID: number;
  LoginName: string;
  Deleted: boolean;
  CreatedDate: Date;
  CreatedBy: string;
  ModifiedDate: Date;
  ModifiedBy: string;
  RegistrationDate: Date;
  public userFacilityModel:FacilityModel;
}
