import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { StaffAddressModel } from '../models/staffAddressModel'
import { StaffEducationModel } from '../models/staffEducationModel';
import { StaffWorkHistoryModel } from '../models/staffWorkHistoryModels'
import { StaffFamilyModel } from '../models/staffFamilyModel'
import { StaffLanguageModel } from '../models/staffLanguageModel';
import { StaffHobbyModel } from '../models/staffHobbyModel';
import { StaffcampusModel } from '../models/staffcampusModel';
import { StaffProfileModel } from '../models/staffProfileModel';
import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
//import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

/*import { StepperSelectionEvent } from '@angular/cdk/stepper';
*/
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
import { StaffAddComponent } from '../staff-add/staff-add.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffAddressComponent } from '../staff-address/staff-address.component';
import { staffEducationComponent } from '../staff-education/staff-education.component';
import { staffWorkComponent } from '../staff-work/staff-work.component';
import { staffFamilyComponent } from '../staff-family/staff-family.component';
import { staffCampusComponent } from '../staff-campus/staff-campus.component';
import { staffHobbyComponent } from '../staff-hobby/staff-hobby.component';
import { clsViewFile } from '../../patient/models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';
import { staffLanguageComponent } from '../staff-language/staff-language.component';

import { imageCropComponent } from 'src/app/image-crop/image-crop.component';
@Component({
 // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.css']
})

export class StaffEditComponent implements OnInit {
  //#region "Property Decleration"
  @ViewChild('profiepic', { static: false }) attachement: any;

  @ViewChild(SelectAutocompleteComponent, { static: true }) multiSelect: SelectAutocompleteComponent;
  @ViewChild('autoCompleteSchedulerDepartment', { static: false, read: MatAutocompleteTrigger }) triggerschedule: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('LanguageInput', { static: true }) LanguageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  @ViewChild('autocompleteTrigger', { static: true }) matACTrigger: MatAutocompleteTrigger;
  maxDate=new Date();
  startDate = new Date((new Date().getFullYear()-20),12,0);
  endDate= new Date((new Date().getFullYear()-80), 12, 0);
  removable = true;
  languageDescription: any = [];
  languageArray: any = [];
  // separatorKeysCodes: number[] = [ENTER, COMMA];
  // preferedlanguage = new FormControl();
  filteredLanguage: Observable<string[]> | string;
  languages: any = [];
  Yeardata: any;
  currentyear: any
  yearindex: any;
  //length = 1970;
  newyear = [new Date().getFullYear()];
  StaffProfileModel: StaffProfileModel = new StaffProfileModel();
  StaffFamilyModel: StaffFamilyModel = new StaffFamilyModel();
  StaffAddressModel: StaffAddressModel = new StaffAddressModel();
  StaffEducationModel: StaffEducationModel = new StaffEducationModel();
  StaffWorkHistoryModel: StaffWorkHistoryModel = new StaffWorkHistoryModel();
  StaffLanguageModel: StaffLanguageModel = new StaffLanguageModel();
  StaffHobbyModel: StaffHobbyModel = new StaffHobbyModel();
  StaffcampusModel: StaffcampusModel = new StaffcampusModel();
  languageModelCollection: any = [];
  workModelCollection: any = [];
  familyModelCollection: any = [];
  addressModelCollection: any = [];
  qualificationmodelCollection: any = [];
  campusCollection: any = [];
  hobbiesmodelCollection: any = [];
  staffeditform: FormGroup;
  personalFormGroup: FormGroup;
  contactFormGroup: FormGroup;
  educationFormGroup: FormGroup;
  workFormGroup: FormGroup;
  familyFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  Address: FormGroup;
  Education: FormGroup;
  WorkHistory: FormGroup;
  FamilyDetail: FormGroup;
  LanguageDetail: FormGroup;
  CampusDetail: FormGroup;
  ExtraActivity: FormGroup;
  FamilyInfoShow = false;
  AddressInfoShow = false;
  QualificationInfoShow = false
  workInfoShow = false
  otherLanguageShow = false
  otherhobbiesShow = false
  otherCampusshow = false
  //tempArray: any;
  Facility: any;
  bindAge: any;
  bindDOB: any;
  role: any;
  salutation: any;
  gender: any;
  Identification: any;
  martialstatus: any;
  bloodgroup: any;
  language: any;
  addresstype: any;
  relation: any;
  contactType: any;
  submitData: any;
  //hide: Array<boolean> = [];
  //addanotherContact: boolean = false;
  //dataindex: any;
  //Educationdisabled: boolean = false;
  //hideeducation: Array<boolean> = [];
  //addanotherWork: boolean = false;
  //hidework: Array<boolean> = [];
  //hidefamily: Array<boolean> = [];
  //AddAnotherFamily: boolean = false;
  //addanotherlanguage: boolean = false;
  //hidelanguage: Array<boolean> = [];
  //hidecampus: Array<boolean> = [];
  //addanothercampus: boolean = false;
  //hideExtraActivity: Array<boolean> = [];
  //ExtraActivity: boolean = false;
  ExtracurricularActivitiesType: any;
  UserType: any;
  department: any;
  departmentToolTip: any;
  SchedulerdepartmentToolTip: any;
  Schedulerdepartment: any;
  Preferedlanguage: any;
 // preferedlanguageTollTip: any;
  filterValue: any = [];
  //languageid: any;
  preferedlanguageid: any = "";
  departmentid: number;
  Scheduledepartmentid: number;
  autoGenerateEmployeeNo: any = "";
  Facilityidvalues: Array<Number> = [];
  employeeId: any;
  userid: any;
  FileUpload: File;
  ViewFileUpload: clsViewFile;
  profilePics: any;
  imageFlag: boolean = true;
  StaffDetailById: any;
  facilitytooltip: any[] = [];
  facilityvalue: any;
  formData: any;
  desVal: any;
  //#endregion
  //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialog, private router: Router, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder, private staffservice: StaffService, private activeRoute: ActivatedRoute, private sanitizer: DomSanitizer) {
  }
  //#endregion
  //#region "ng onInit"
  ngOnInit() {
    this.activeRoute.params.subscribe(param => {
      this.employeeId = param['EmployeeId'];
    });
    this.personalFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.contactFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.educationFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.workFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.familyFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.otherFormGroup = this._formBuilder.group({
      matStepperTab: ["", Validators.required],
    });
    this.staffeditform = this.fb.group({
      Department: [''],
      Role: [''],
      UserType: [''],
      EmployeeNumber: [''],
      DateofJoining: [''],
      SchedulerDepartment: [''],
      AdditionalDetails: [''],
      Salutation: [''],
      Firstname: ['', Validators.required],
      MiddleName: ['', Validators.required],
      //Telephone: [''],
      Lastname: ['', Validators.required],
      //Fax: [''],
      Gender: [''],
      DateofBirth: ['', Validators.required],
      staffAge: ['', Validators.required],
      //MothersMaidenName: [''],
      //WebsiteName: [''],
      Identification: ['', Validators.required],
      PatientIdentificationtypedetails: ['', Validators.required],
      Identificationname: ['', Validators.required],
      PatientIdentificationtypedetailsname: ['', Validators.required],
      MaritalStatus: [''],
      MothersMaidenName: [''],
      preferedlanguage: [''],
      Bloodgroup: [''],
      IsActive: [''],
      newyear: [new Date().getFullYear()],
      facility: ['', Validators.required],
      CellNumber: [''],
      PhoneNumber: [''],
      WhatsAppNumber: [''],
      sameas: [false],
      Email: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
      SalutationContact: [''],
      FirstnameConatct: [''],
      LastName: [''],
      cellNoContact: [''],
      EmergencyNoContact: [''],
      TelephoneNoContact: [''],
      Fax: [''],
      RelationshiptoEmployee: [''],
    });
      this.Address = this._formBuilder.group({
      AddressArray: this._formBuilder.array([
        this.AddressArray(),
      ])
      });
    this.Education = this._formBuilder.group({
      educationArray: this._formBuilder.array([
        this.educationArray(),
      ]),
    });
    this.WorkHistory = this._formBuilder.group({
      WorkArray: this._formBuilder.array([
        this.WorkArray(),
      ]),
    });
    this.FamilyDetail = this._formBuilder.group({
      FamilyArray: this._formBuilder.array([
        this.FamilyArray(),
      ]),
    });
    this.LanguageDetail = this._formBuilder.group({
      languagemodel: this._formBuilder.array([
        this.languagemodel(),
      ]),
    });
    this.CampusDetail = this._formBuilder.group({
      campusmodel: this._formBuilder.array([
        this.campusmodel(),
      ]),
    });
    this.ExtraActivity = this._formBuilder.group({
      hobbies: this._formBuilder.array([
        this.hobbies(),
      ]),
    });
  
    this.staffSetValue();
    const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
    language.controls[0].get('speaktext').disable();
    language.controls[0].get('Readtext').disable();
    language.controls[0].get('Writetext').disable();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.year();
    this.getFacility();
    this.getRole();
    this.getSalutation();
    this.getGender();
    this.getIdentification();
    this.getMartialStatus();
    this.getBloodGroup();
    this.getLanguage();
    this.getAddressType();
    this.getRelation();
    this.getContactType();
    this.getExtracurricularActivitiesType();
    this.getUserType();
    this.getDepartment();
    this.getSchedulerDepartment();
    this.getLanguageMultiselect();
    this.openAddress();
  }
  //#endregion
  ngAfterViewInit() {
    this.trigger.panelClosingActions.subscribe(Department => {
      if (!(Department && Department.source)) {
        this.staffeditform.get('Department').setValue('');
      }
    });
    this.triggerschedule.panelClosingActions.subscribe(ScheduleDepartment => {
      if (!(ScheduleDepartment && ScheduleDepartment.source)) {
        this.staffeditform.get('SchedulerDepartment').setValue('');
      }
    });
    this.matACTrigger.panelClosingActions.subscribe(preferedlanguage => {
      if (!(preferedlanguage && preferedlanguage.source)) {
        // this.staffaddform.get('preferedlanguage').setValue('');
        //this.languages = [];
        this.LanguageInput.nativeElement.value = '';

      }
    });
  }
  //#region "contact"
  AddressArray(): FormGroup {
    return this._formBuilder.group({

      CellNumber: [''],
      PhoneNumber: [''],
      WhatsAppNumber: [''],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      Salutation: [''],
      Firstname: [''],
      LastName: [''],
      EmergencyContactNo: [''],
      RelationshiptoEmployee: [''],
      AddressType: ['', Validators.required],
      AddressTypeDescription: [''],
      Address1: [''],
      Address2: [''],
      Town: [''],
      District: [''],
      PINcode: [''],
      //Yeardatary: [''],
      State: [''],
      ValidFrom: [''],
      ValidTo: [''],
      TelephoneNo: [''],
      Fax: [''],
      Country: [''],
    });
  }
  getdynamicProblemListControls() {
    return <FormArray>this.Address.get("AddressArray");
  }
  //#endregion
  //#region "education"
  educationArray(): FormGroup {
    return this._formBuilder.group({
      University: ['', Validators.required],
      Percentage: [''],
      PlaceOfInstitute: [''],
      InstituteName: ['', Validators.required],
      Branch: ['', Validators.required],
      MainSubject: [''],
      Scholorship: [''],
      Qualification: [''],
      Duration: [''],
      RegistrationAuthority: [''],
      RegistrationNo: [''],
      RegistrationExpiryDate: [''],
      AdditionalInfo: [''],
      Month: ['', Validators.required],
      Year: ['', Validators.required],
      MonthValue: [''],
    });
  }
  getdynamiceducationArray() {
    return <FormArray>this.Education.get("educationArray");
  }
  //#endregion
  //#region "WorkArray"
  WorkArray(): FormGroup {
    return this._formBuilder.group({

      EmployerName: ['', Validators.required],
      ContactPerson: ['', Validators.required],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      CellPhone: [''],
      PhoneNo: [''],
      Address1: [''],
      Address2: [''],
      Town: [''],
      City: [''],
      District: [''],
      State: [''],
      Country: [''],
      PIN: [''],
      FromDate: [''],
      ToDate: [''],
      AdditionalInformation: [''],
    });
  }
  getworkmodel() {
    return <FormArray>this.WorkHistory.get("WorkArray");
  }
  //#endregion
  //#region "family"
  FamilyArray(): FormGroup {
    return this._formBuilder.group({
      Salutation: [''],
      Firstname: ['', Validators.required],
      MiddleName: ['', Validators.required],
      LastName: ['', Validators.required],
      Gender: [''],
      Age: ['', Validators.required],
      CellNumber: [''],
      PhoneNumber: [''],
      WhatsAppNumber: [''],
      samecellno: [''],
      Email: ['', Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")],
      Relationshiptopatient: [''],
      AdditionalInformation: [''],
      Occupation: [''],
      GenderValue: [''],
      Salutationdescription: [''],
      RelationshiptopatientValue: ['']
    });
  }
  getFamilyArray() {
    return <FormArray>this.FamilyDetail.get("FamilyArray");
  }
  //#endregion
  //#region "language"
  languagemodel(): FormGroup {
    return this._formBuilder.group({
      Language: ['', Validators.required],
      IsSpeak: [false],
      speaktext: [0],
      Read: [false],
      Readtext: [0],
      Write: [false],
      Writetext: [0],
      LanguageDescription: ['']
    });
  }
  getlanguagemodel() {
    return <FormArray>this.LanguageDetail.get("languagemodel");
  }
  //#endregion
  //#region "campus"
  campusmodel(): FormGroup {
    return this._formBuilder.group({
      Name: ['', Validators.required],
      Date: [''],
      Details: [''],
    });
  }
  getcampusmodel() {
    return <FormArray>this.CampusDetail.get("campusmodel");
  }
  //#endregion
  //#region "hobbies"
  hobbies(): FormGroup {
    return this._formBuilder.group({
      ActivityType: ['', Validators.required],
      Detailsname: [''],
      ActivityTypeDescription: ['']
    });
  }
  gethobbymodel() {
    return <FormArray>this.ExtraActivity.get("hobbies");
  }
  //#endregion
  //#region "close"
  dialogClose() {
   // this.dialogRef.close();
  }
  //#endregion
  //#region "month"
  Month = [
    { id: 1, Value: '01', month: 'January' },
    { id: 2, Value: '02', month: 'Feburary' },
    { id: 3, Value: '03', month: 'March' },
    { id: 4, Value: '04', month: 'April' },
    { id: 5, Value: '05', month: 'May' },
    { id: 6, Value: '06', month: 'june' },
    { id: 7, Value: '07', month: 'July' },
    { id: 8, Value: '08', month: 'August' },
    { id: 9, Value: '09', month: 'September' },
    { id: 10, Value: '10', month: 'October' },
    { id: 11, Value: '11', month: 'November' },
    { id: 12, Value: '12', month: 'December' },
  ];
  //#endregion
  //#region "Staff Get"
  staffSetValue() {
    this.staffservice.GetEmployeeByID(this.employeeId).then(data => {
      this.userid = data.UserId;
      this.StaffDetailById = data;
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data.StaffImage);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
      this.departmentid = data.EmployeeDepartment     
      this.Scheduledepartmentid = data.SchedulerDepartment
      this.facilitytooltip = data.FacilityName;
      this.staffeditform.get('IsActive').setValue(data.IsActive);
      this.staffeditform.get('Department').setValue(data.EmployeeDepartmentDesc);
      this.staffeditform.get('facility').setValue(data.FacilityArray);
      this.staffeditform.get('Role').setValue(data.RoleId);
      this.staffeditform.get('UserType').setValue(data.EmployeeUserType);
      this.staffeditform.get('EmployeeNumber').setValue(data.EmployeeNo);
      this.staffeditform.get('DateofJoining').setValue(data.DOJ);
      this.staffeditform.get('SchedulerDepartment').setValue(data.SchedulerDepartmentDesc);
      this.staffeditform.get('AdditionalDetails').setValue(data.AdditionalInfo);
      this.staffeditform.get('Salutation').setValue(data.EmergencySalutation);
      this.staffeditform.get('Firstname').setValue(data.EmployeeFirstName);
      this.staffeditform.get('MiddleName').setValue(data.EmployeeMiddleName);
      this.staffeditform.get('Lastname').setValue(data.EmployeeLastName);
      this.staffeditform.get('Gender').setValue(data.Gender);
      this.staffeditform.get('DateofBirth').setValue(data.EmployeeDOB);
      this.staffeditform.get('staffAge').setValue(data.EmployeeAge);
      this.staffeditform.get('Identification').setValue(data.EmployeeIdentificationtype1);
      this.staffeditform.get('PatientIdentificationtypedetails').setValue(data.EmployeeIdentificationtype1details);
      this.staffeditform.get('Identificationname').setValue(data.EmployeeIdentificationtype2);
      this.staffeditform.get('PatientIdentificationtypedetailsname').setValue(data.EmployeeIdentificationtype2details);
      this.staffeditform.get('MaritalStatus').setValue(parseInt(data.MaritalStatus));
      this.staffeditform.get('MothersMaidenName').setValue(data.MothersMaiden);
      this.staffeditform.get('preferedlanguage').setValue(data.Languages);
      this.staffeditform.get('Bloodgroup').setValue(data.Bloodgroup);
      this.staffeditform.get('CellNumber').setValue(data.CellNo);
      this.staffeditform.get('PhoneNumber').setValue(data.PhoneNo);
      this.staffeditform.get('WhatsAppNumber').setValue(data.WhatsAppNo);
      this.staffeditform.get('Email').setValue(data.EMail);
      this.staffeditform.get('SalutationContact').setValue(data.EmergencySalutation);
      this.staffeditform.get('FirstnameConatct').setValue(data.EmergencyFirstName);
      this.staffeditform.get('LastName').setValue(data.EmergencyLastName);
      this.staffeditform.get('cellNoContact').setValue(data.EmergencyContactType);
      this.staffeditform.get('EmergencyNoContact').setValue(data.EmergencyContactNo);
      this.staffeditform.get('TelephoneNoContact').setValue(data.TelephoneNo);
      this.staffeditform.get('Fax').setValue(data.Fax);
      this.staffeditform.get('RelationshiptoEmployee').setValue(data.RelationshipToEmployee);
      this.languages = data.LanguageList;
      this.languageArray = data.LanguageArray;
      if (data.staffAddressDetails != undefined && data.staffAddressDetails != null && data.staffAddressDetails.length>0) {
         this.AddressInfoShow = true;
        this.addressModelCollection = data.staffAddressDetails;
      }
      if (data.staffEducationDetails != undefined && data.staffEducationDetails != null && data.staffEducationDetails.length > 0) {
        this.QualificationInfoShow = true;
        this.qualificationmodelCollection = data.staffEducationDetails;
      }
      if (data.staffWorkDetails != undefined && data.staffWorkDetails != null && data.staffWorkDetails.length > 0) {
        this.workInfoShow = true;
        this.workModelCollection = data.staffWorkDetails;
      }
      if (data.staffFamilyDetails != undefined && data.staffFamilyDetails != null && data.staffFamilyDetails.length > 0) {
        this.FamilyInfoShow = true;
        this.familyModelCollection = data.staffFamilyDetails;
      }
      if (data.staffLanguageDetails != undefined && data.staffLanguageDetails != null && data.staffLanguageDetails.length > 0) {
        this.otherLanguageShow = true;
        this.languageModelCollection = data.staffLanguageDetails;
      }
      if (data.staffCampusDetails != undefined && data.staffCampusDetails != null && data.staffCampusDetails.length > 0) {
        this.otherCampusshow = true;
        this.campusCollection = data.staffCampusDetails;
      }
      if (data.staffHobbyDetails != undefined && data.staffHobbyDetails != null && data.staffHobbyDetails.length > 0) {
        this.otherhobbiesShow = true;
        this.hobbiesmodelCollection = data.staffHobbyDetails;
      }
    });
  }
   //#endregion
  //#region "whatsappNo"
  whatsapp() {
    if (!this.staffeditform.get('sameas').value) {
      this.staffeditform.get('WhatsAppNumber').setValue(this.staffeditform.get('CellNumber').value);
    } else {
      this.staffeditform.get('WhatsAppNumber').setValue("");
    }
  }
  //#endregion
  //#region "Cell No"
  samecell() {
    const family = <FormArray>(this.FamilyDetail.controls["FamilyArray"]);
    if (family.controls[0].get('samecellno').value) {
      family.controls[0].get('WhatsAppNumber').setValue(family.controls[0].get('CellNumber').value);
    } else {
      family.controls[0].get('WhatsAppNumber').setValue("");
    }

  }
  //#endregion
  //#region "Speak"
  onspeak() {
    const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
    if (language.controls[0].get('IsSpeak').value) {
      language.controls[0].get('speaktext').enable();
    } else {
      language.controls[0].get('speaktext').disable();
    }
  }
  //#endregion
  ////#region "Speak"
  //onIsspeak() {
  //  const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
  //  if (language.controls[0].get('IsSpeak').value) {
  //    language.controls[0].get('speaktext').enable();
  //  } else {
  //    language.controls[0].get('speaktext').disable();
  //  }
  //}
  ////#endregion
  //#region "read"
  onread() {
    const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
    if (language.controls[0].get('Read').value) {
      language.controls[0].get('Readtext').enable();
    } else {
      language.controls[0].get('Readtext').disable();
    }
  }
  //#endregion
  ////#region "read"
  //onIsread() {
  //  const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
  //  if (language.controls[0].get('Read').value) {
  //    language.controls[0].get('Readtext').enable();
  //  } else {
  //    language.controls[0].get('Readtext').disable();
  //  }
  //}
  ////#endregion
  //#region "write"
  onwrite() {
    const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
    if (language.controls[0].get('Write').value) {
      language.controls[0].get('Writetext').enable();
    } else {
      language.controls[0].get('Writetext').disable();
    }
  }
  //#endregion
  ////#region "write"
  //onIswrite() {
  //  const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
  //  if (language.controls[0].get('Write').value) {
  //    language.controls[0].get('Writetext').enable();
  //  } else {
  //    language.controls[0].get('Writetext').disable();
  //  }
  //}
  ////#endregion
  //#region "year"
  year() {
    this.Yeardata = []
    this.currentyear = this.newyear;
    for (this.yearindex = this.currentyear; this.yearindex > (this.currentyear - 70); this.yearindex--) {
      this.Yeardata.push(this.yearindex);

    }
  }
  //#endregion
  //#region "Add Family"
  onAddFamilyRow(family?:any) {
    if (this.FamilyDetail.controls['FamilyArray'].valid) {
      this.FamilyInfoShow = true;
      //this.language.push(this.FamilyArray());
      const family = <FormArray>(this.FamilyDetail.controls["FamilyArray"]);
      for (let i = 0; i < family.length; i++) {
        this.StaffFamilyModel = new StaffFamilyModel();
        this.StaffFamilyModel.EmployeeFamilyID = 0;
        this.StaffFamilyModel.EmployeeID = 0;
        this.StaffFamilyModel.Salutation = family.controls[i].get('Salutation').value;
        this.StaffFamilyModel.SalutationDesc = family.controls[i].get('Salutationdescription').value;

        this.StaffFamilyModel.AdditionalInfo = family.controls[i].get('AdditionalInformation').value;
        this.StaffFamilyModel.FirstName = family.controls[i].get('Firstname').value;
        this.StaffFamilyModel.MiddleName = family.controls[i].get('MiddleName').value;

        this.StaffFamilyModel.LastName = family.controls[i].get('LastName').value;
        this.StaffFamilyModel.Gender = family.controls[i].get('Gender').value;
        this.StaffFamilyModel.GenderDesc = family.controls[i].get('GenderValue').value;
        if (family.controls[i].get('Age').value == "") {
          this.StaffFamilyModel.Age = 0;
        } else {
          this.StaffFamilyModel.Age = parseInt(family.controls[i].get('Age').value);
        }
        this.StaffFamilyModel.CellNo = family.controls[i].get('CellNumber').value;
        this.StaffFamilyModel.PhoneNo = family.controls[i].get('PhoneNumber').value;
        this.StaffFamilyModel.WhatsAppNo = family.controls[i].get('WhatsAppNumber').value;

        this.StaffFamilyModel.EMail = family.controls[0].get('Email').value;
        this.StaffFamilyModel.AdditionalInfo = family.controls[0].get('AdditionalInformation').value;
        this.StaffFamilyModel.Occupation = family.controls[0].get('Occupation').value;

        //this.StaffFamilyModel.WhatsAppNumber = family.controls[i].get('WhatsAppNumber').value;
        if (family.controls[i].get('Relationshiptopatient').value == "") {
          this.StaffFamilyModel.RelationshipToEmployee = 0;
        } else {
          this.StaffFamilyModel.RelationshipToEmployee = family.controls[i].get('Relationshiptopatient').value;

        }
        this.StaffFamilyModel.RelationshipToEmployeeDesc = family.controls[i].get('RelationshiptopatientValue').value;

        //this.StaffFamilyModel. = family.controls[i].get('AdditionalInformation').value;

        this.familyModelCollection.push(this.StaffFamilyModel);
      }

      //  this. familyhistory=this.familyModelCollection.push(family.controls[0].value);
      family.controls[0].reset();
    } else {
      if (family == 'submit') {
        this.FamilyDetail.markAllAsTouched();
      }
    }
  }
  //#endregion
  //#region "delete Family"
  deleteFamilyInfo(data) {
    this.familyModelCollection.splice(this.familyModelCollection.indexOf(data), 1);
  }
  //#endregion
  //#region "Add contact"
  onConatctAddRow(Address?:any) {
    if (this.Address.controls['AddressArray'].valid) {
      this.AddressInfoShow = true;

      const contact = <FormArray>(this.Address.controls["AddressArray"]);


      for (let i = 0; i < contact.length; i++) {
        this.StaffAddressModel = new StaffAddressModel();
        this.StaffAddressModel.EmployeeID = 0;
        this.StaffAddressModel.EmployeeAddressId = 0;
        this.StaffAddressModel.AddressType = contact.controls[0].get('AddressType').value;
        this.StaffAddressModel.AddressTypeDesc = contact.controls[i].get('AddressTypeDescription').value;
        this.StaffAddressModel.Address1 = contact.controls[0].get('Address1').value;
        this.StaffAddressModel.Address2 = contact.controls[0].get('Address2').value;

        this.StaffAddressModel.City = contact.controls[0].get('Town').value;

        this.StaffAddressModel.District = contact.controls[0].get('District').value;

        this.StaffAddressModel.Pincode = contact.controls[0].get('PINcode').value;

        this.StaffAddressModel.State = contact.controls[0].get('State').value;

        this.StaffAddressModel.Country = contact.controls[0].get('Country').value;

        this.StaffAddressModel.ValidFrom = contact.controls[0].get('ValidFrom').value;
        this.StaffAddressModel.ValidTo = contact.controls[0].get('ValidTo').value;

        this.addressModelCollection.push(this.StaffAddressModel);
        //}
      }
      //  this. familyhistory=this.familyModelCollection.push(family.controls[0].value);
      contact.controls[0].reset();
    } else {
      if (Address == 'submit') {
        this.Address.markAllAsTouched();

      }
    }
  }
  //#endregion
  //#region "delete Contatct"
  deleteContact(data) {
    this.addressModelCollection.splice(this.addressModelCollection.indexOf(data), 1);
  }
  //#endregion
  //#region "Add Educational"

  onRowEducationAdd(Education?:any) {
    if (this.Education.controls['educationArray'].valid) {
      this.QualificationInfoShow = true;
      const qualification = <FormArray>(this.Education.controls["educationArray"]);
      for (let i = 0; i < qualification.length; i++) {
        this.StaffEducationModel = new StaffEducationModel();
        this.StaffEducationModel.University = qualification.controls[0].get('University').value;
        // this.StaffEducationModel.p = qualification.controls[0].get('PhoneNumber').value;
        this.StaffEducationModel.InstituteName = qualification.controls[0].get('InstituteName').value;

        this.StaffEducationModel.Branch = qualification.controls[0].get('Branch').value;

        this.StaffEducationModel.MainSubject = qualification.controls[0].get('MainSubject').value;

        this.StaffEducationModel.Scholorship = qualification.controls[0].get('Scholorship').value;

        this.StaffEducationModel.Qualification = qualification.controls[0].get('Qualification').value;
        this.StaffEducationModel.Percentage = qualification.controls[0].get('Percentage').value;

        this.StaffEducationModel.Month = parseInt(qualification.controls[0].get('Month').value);
        this.StaffEducationModel.MonthValue = qualification.controls[0].get('MonthValue').value;


        this.StaffEducationModel.Year = qualification.controls[0].get('Year').value;

        this.StaffEducationModel.PlaceOfInstitute = qualification.controls[0].get('PlaceOfInstitute').value;


        //education.controls[0].get('EducationTypeValue').setValue(description);

        this.StaffEducationModel.Duration = qualification.controls[0].get('Duration').value;

        this.StaffEducationModel.RegistrationAuthority = qualification.controls[0].get('RegistrationAuthority').value;
        this.StaffEducationModel.RegistrationNo = qualification.controls[0].get('RegistrationNo').value;

        this.StaffEducationModel.RegistrationExpiryDate = qualification.controls[0].get('RegistrationExpiryDate').value;
        this.StaffEducationModel.AdditionalInfo = qualification.controls[0].get('AdditionalInfo').value;
        this.qualificationmodelCollection.push(this.StaffEducationModel);
        //}
      }
      //  this. familyhistory=this.familyModelCollection.push(family.controls[0].value);
      qualification.controls[0].reset();
    } else {
      if (Education == 'submit') {
        this.Education.markAllAsTouched();
      }
    }
  }
  //#endregion
  //#region "delete Educational"

  deleteAddressqualification(data) {
    this.qualificationmodelCollection.splice(this.addressModelCollection.indexOf(data), 1);

  }
  //#endregion
  //#region "Add Work"
  onRowAddWork(work?:any) {
    if (this.WorkHistory.controls['WorkArray'].valid) {
      this.workInfoShow = true;
      const work = <FormArray>(this.WorkHistory.controls["WorkArray"]);
      for (let i = 0; i < work.length; i++) {
        this.StaffWorkHistoryModel = new StaffWorkHistoryModel();
        this.StaffWorkHistoryModel.EmployeeWorkHistoryId = 0;
        this.StaffWorkHistoryModel.EmployeeID = 0;
        this.StaffWorkHistoryModel.EmployerName = work.controls[0].get('EmployerName').value;
        this.StaffWorkHistoryModel.ContactPerson = work.controls[0].get('ContactPerson').value;
        this.StaffWorkHistoryModel.EMail = work.controls[0].get('Email').value;

        this.StaffWorkHistoryModel.CellNo = work.controls[0].get('CellPhone').value;

        this.StaffWorkHistoryModel.PhoneNo = work.controls[0].get('PhoneNo').value;

        this.StaffWorkHistoryModel.Address1 = work.controls[0].get('Address1').value;

        this.StaffWorkHistoryModel.Address2 = work.controls[0].get('Address2').value;

        this.StaffWorkHistoryModel.Town = work.controls[0].get('Town').value;

        this.StaffWorkHistoryModel.City = work.controls[0].get('City').value;
        this.StaffWorkHistoryModel.District = work.controls[0].get('District').value;

        this.StaffWorkHistoryModel.State = work.controls[0].get('State').value;
        this.StaffWorkHistoryModel.Country = work.controls[0].get('Country').value;

        this.StaffWorkHistoryModel.Pincode = work.controls[0].get('PIN').value;
        this.StaffWorkHistoryModel.FromDate = work.controls[0].get('FromDate').value;

        this.StaffWorkHistoryModel.ToDate = work.controls[0].get('ToDate').value;
        this.StaffWorkHistoryModel.AdditionalInfo = work.controls[0].get('AdditionalInformation').value;
        this.workModelCollection.push(this.StaffWorkHistoryModel);
        //}
      }
      //  this. familyhistory=this.familyModelCollection.push(family.controls[0].value);
      work.controls[0].reset();
    } else {
      if (work == 'submit') {
        this.WorkHistory.markAllAsTouched();
      }
    }
  }
  //#endregion
  //#region "delete Work"
  deleteEducationwork(data) {
    this.workModelCollection.splice(this.workModelCollection.indexOf(data), 1);
  }
  //#endregion
  //#region "Add language"
  onRowLanguage(language?:any) {
    if (this.LanguageDetail.controls['languagemodel'].valid) {
      this.otherLanguageShow = true;
      const other = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
      for (let i = 0; i < other.length; i++) {
        this.StaffLanguageModel = new StaffLanguageModel();
        this.StaffLanguageModel.EmployeeID = 0;
        this.StaffLanguageModel.EmployeeLanguageID = 0;
        this.StaffLanguageModel.Language = other.controls[i].get('Language').value;
        this.StaffLanguageModel.LanguageValue = other.controls[i].get('LanguageDescription').value;
        this.StaffLanguageModel.IsRead = other.controls[i].get('Read').value;
        this.StaffLanguageModel.IsSpeak = other.controls[i].get('IsSpeak').value;
        this.StaffLanguageModel.IsWrite = other.controls[i].get('Write').value;

        // this.StaffLanguageModel.SpeakingLevel = parseInt(other.controls[i].get('speaktext').value);


        // this.StaffLanguageModel.ReadingLevel = parseInt(other.controls[i].get('Readtext').value);

        // this.StaffLanguageModel.Write = other.controls[0].get('Write').value;
        // this.StaffLanguageModel.WritingLevel = parseInt(other.controls[i].get('Writetext').value);

        if (other.controls[i].get('speaktext').value) {
          this.StaffLanguageModel.SpeakingLevel = parseInt(other.controls[i].get('speaktext').value);

        } else {
          this.StaffLanguageModel.SpeakingLevel = 0;
        }
        if (other.controls[i].get('Readtext').value) {
          this.StaffLanguageModel.ReadingLevel = parseInt(other.controls[i].get('Readtext').value);

        } else {
          this.StaffLanguageModel.ReadingLevel = 0;
        }
        if (other.controls[i].get('Writetext').value) {
          this.StaffLanguageModel.WritingLevel = parseInt(other.controls[i].get('Writetext').value);

        } else {
          this.StaffLanguageModel.WritingLevel = 0;
        }

        this.languageModelCollection.push(this.StaffLanguageModel);
        other.controls[0].reset();
        const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
        language.controls[0].get('speaktext').disable();
        language.controls[0].get('Readtext').disable();
        language.controls[0].get('Writetext').disable();

      }
    } else {
      if (language == 'submit') {
        this.LanguageDetail.markAllAsTouched();
      }
    }
  }
  //#endregion
  //#region "Delete language"
  deletelanguage(data) {
    this.languageModelCollection.splice(this.languageModelCollection.indexOf(data), 1);
  }
  //#endregion
  //#region "Add Campus"
  onRowcampus(campus?:any) {
    if (this.CampusDetail.controls['campusmodel'].valid) {
      this.otherCampusshow = true;
      const other = <FormArray>(this.CampusDetail.controls["campusmodel"]);
      for (let i = 0; i < other.length; i++) {
        this.StaffcampusModel = new StaffcampusModel();
        this.StaffcampusModel.EmployeeID = 0;
        this.StaffcampusModel.EmployeeCampusId = 0;
        this.StaffcampusModel.Name = other.controls[i].get('Name').value;
        this.StaffcampusModel.CampusDate = other.controls[i].get('Date').value;
        this.StaffcampusModel.Details = other.controls[0].get('Details').value;
        this.campusCollection.push(this.StaffcampusModel);
        other.controls[0].reset();
      }
    } else {
      if (campus == 'submit') {
        this.CampusDetail.markAllAsTouched();
      }
    }
  }
  //#endregion
  //#region "delete Campus"
  deletecampus(data) {
    this.campusCollection.splice(this.campusCollection.indexOf(data), 1);

  }
  //#endregion
  //#region "Add Hobbies"
  onRowhobbies(hobbies?:any) {
    if (this.ExtraActivity.controls['hobbies'].valid) {
      this.otherhobbiesShow = true;
      const other = <FormArray>(this.ExtraActivity.controls["hobbies"]);
      for (let i = 0; i < other.length; i++) {
        this.StaffHobbyModel = new StaffHobbyModel();
        this.StaffHobbyModel.EmployeeHobbyId = 0;
        this.StaffHobbyModel.EmployeeID = 0;
        this.StaffHobbyModel.ActivityType = other.controls[0].get('ActivityType').value;
        this.StaffHobbyModel.Details = other.controls[0].get('Detailsname').value;
        this.StaffHobbyModel.ActivityTypeDescription = other.controls[0].get('ActivityTypeDescription').value;


        this.hobbiesmodelCollection.push(this.StaffHobbyModel);
        other.controls[0].reset();

      }
    } else {
      if (hobbies == 'submit') {
        this.ExtraActivity.markAllAsTouched();
      }
    }
  }
  //#endregion
  //#region "delete Hobbies"
  deletehobbies(data) {
    this.hobbiesmodelCollection.splice(this.hobbiesmodelCollection.indexOf(data), 1);
  }
  //#endregion
  //#region "Set Hobbies"
  clear() {
    this.staffeditform.reset();
    this.staffSetValue();

  }
  //#endregion
  // #region "Facility"
  getFacility() {
    this.staffservice.getFacility().then(res => {
      this.Facility = res;
    })
  }
  //#endregion
  //#region "Stepper Previous"
  stepChanged(event, stepper) {
    stepper.selected.interacted = false;
    this.onConatctAddRow();
    this.onRowEducationAdd();
    this.onRowAddWork();
    this.onAddFamilyRow();
    this.onRowLanguage();
    this.onRowcampus();
    this.onRowhobbies();
  }
  //#endregion
  //#region "Language Previous Button"
  languageprevious() {
    this.onRowLanguage();
    this.onRowcampus();
    this.onRowhobbies();
  }
  //#endregion
  //#region BindDob
  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.staffeditform.get('DateofBirth').value).getFullYear();
    this.staffeditform.get('staffAge').setValue(this.bindAge);
  }
  //#endregion
  //#region BindAge
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.staffeditform.get('staffAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.staffeditform.get('DateofBirth').setValue(this.bindDOB);
  }
  //#endregion
  //#region Role
  getRole() {
    this.staffservice.getRoleForStaff().then(res => {
      this.role = res;
    })
  }
  //#endregion
  //#region Salutation
  getSalutation() {
    this.staffservice.getSalutation().then(res => {
      this.salutation = res;
    })
  }
  //#endregion
  //#region Gender
  getGender() {
    this.staffservice.getGender().then(res => {
      this.gender = res;
    })
  }
  //#endregion
  //#region "Identification"
  getIdentification() {
    this.staffservice.getIdentification().then(res => {
      this.Identification = res;
    })
  }
  //#endregion
  //#region "Martial"
  getMartialStatus() {
    this.staffservice.getMaritalStatus().then(res => {
      this.martialstatus = res;
    })
  }
  //#endregion
  //#region "BloodGroup"
  getBloodGroup() {
    this.staffservice.getBloodGroup().then(res => {
      this.bloodgroup = res;
    })
  }
  //#endregion
  //#region "Language"
  getLanguage() {
    this.staffservice.getLanguage().then(res => {
      this.language = res;
    })
  }
  //#endregion
  //#region "AddressType"
  getAddressType() {
    this.staffservice.getAddressType().then(res => {
      this.addresstype = res;
    })
  }
  //#endregion
  //#region "Relation"
  getRelation() {
    this.staffservice.getRelation().then(res => {
      this.relation = res;
    })
  }
  //#endregion
  //#region "getContactType"
  getContactType() {
    this.staffservice.getContactType().then(res => {
      this.contactType = res;
    })
  }
  //#endregion
  //#region "getExtracurricularActivitiesType"
  getExtracurricularActivitiesType() {
    this.staffservice.getExtracurricularActivitiesType().then(res => {
      this.ExtracurricularActivitiesType = res;
    })
  }
  //#endregion
  //#region "getUserType"
  getUserType() {
    this.staffservice.getUserType().then(res => {
      this.UserType = res;
    })
  }
  //#endregion
  //#region "Address type Description"
  AddressTypeEvent(description) {
    const contact = <FormArray>(this.Address.controls["AddressArray"]);
    contact.controls[0].get('AddressTypeDescription').setValue(description);
  }
   //#endregion
  //#region "Month value Description"
  Monthvalue(description) {
    const education = <FormArray>(this.Education.controls["educationArray"]);
    education.controls[0].get('MonthValue').setValue(description);
  }
  //#endregion
  //#region "gender value Description"
  genderdescription(description) {
    const family = <FormArray>(this.FamilyDetail.controls["FamilyArray"]);
    family.controls[0].get('GenderValue').setValue(description);
  }
   //#endregion
  //#region "Salutation value Description"
  salutationdescription(description) {
    const family = <FormArray>(this.FamilyDetail.controls["FamilyArray"]);
    family.controls[0].get('Salutationdescription').setValue(description);

  }
   //#endregion
  //#region "Language value Description"
  languagedescription(description) {
    const language = <FormArray>(this.LanguageDetail.controls["languagemodel"]);
    language.controls[0].get('LanguageDescription').setValue(description);

  }
  //#endregion
  //#region "Activity Type Description"
  ActivityType(description) {
    const Hobbies = <FormArray>(this.ExtraActivity.controls["hobbies"]);
    Hobbies.controls[0].get('ActivityTypeDescription').setValue(description);
  }
  //#endregion
  //#region "Department"
  getDepartment() {
    if (this.staffeditform.get('Department').value != null) {
      this.staffeditform.get('Department').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getDepartment(key).then(data => {
              this.department = data;
              //this.staffeditform.get('preferedlanguage').setValue('');

            })
          }
          else {
            this.department = null;
            this.departmentToolTip = null;
          }
        } else {
          this.department = null;
          this.departmentToolTip = null;
        }
      })
    }
  }
  //#endregion
  //#region "Relationship to patient Description"
  RelationshipToPatient(description) {
    const family = <FormArray>(this.FamilyDetail.controls["FamilyArray"]);
    family.controls[0].get('RelationshiptopatientValue').setValue(description);
  }
  //#endregion
  //#region "Set Tooltip"
  setDepartmentToolTip(value, number) {
    this.departmentToolTip = value;
    this.departmentid = number;
  }
  //#endregion "Set Tooltip"
  //#region "Schedule Department"
  getSchedulerDepartment() {
    if (this.staffeditform.get('SchedulerDepartment').value != null) {
      this.staffeditform.get('SchedulerDepartment').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getDepartment(key).then(data => {
              this.Schedulerdepartment = data;
              //this.staffeditform.get('preferedlanguage').setValue('');
            })
          }
          else {
            this.Schedulerdepartment = null;
            this.SchedulerdepartmentToolTip = null;
          }
        } else {
          this.Schedulerdepartment = null;
          this.SchedulerdepartmentToolTip = null;
        }
      })
    }
  }
  //#endregion
  //#region "Set Tooltip"
  setSchedulerDepartmentToolTip(value, number) {
    this.SchedulerdepartmentToolTip = value;
    this.Scheduledepartmentid = number;
  }
  //#endregion "Set Tooltip"
  //#region "MultiSelect"
  getLanguageMultiselect() {
    if (this.staffeditform.get('preferedlanguage').value != null) {
      this.staffeditform.get('preferedlanguage').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getPreferedLanguage(key).then(data => {
              this.Preferedlanguage = data;
              //this.filteredLanguage = data;
             // this.staffeditform.get('preferedlanguage').setValue('');
            })
          } 
        } else {
          this.Preferedlanguage = [];
        }
      })
    }
  }
  //#endregion
  //#region "MultiSelect Remove"
  remove(language: string, i: number): void {
    const index = this.languages.indexOf(language);
    if (index >= 0) {
      this.languages.splice(index, 1);
      if (this.languageArray.length > 0) {
        this.languageArray.splice(index, 1);
      } else {
        this.languageArray = [];
      }
    } if (this.languages.length == 0) {
      this.staffeditform.get('preferedlanguage').setValue(null);
    }
  }
  //#endregion
  //#region "MultiSelect Select"
  selected(event: MatAutocompleteSelectedEvent): void {
    const languageDescription = event.option.value.LanguageDescription;
    const languageid = event.option.value.LanguageId;
    if (this.languages.includes(languageDescription)) {
      this.languages = [...this.languages.filter((language) => language !== languageDescription)];
      this.languageArray = [...this.languageArray.filter((languages) => languages !== languageid)];
    } else {
      this.languages.push(event.option.value.LanguageDescription);
      this.languageArray.push(event.option.value.LanguageId);
    }
    this.LanguageInput.nativeElement.value = '';
    if (this.languages.length == 0) {
      this.Preferedlanguage = [];
    } else {
      requestAnimationFrame(() => {
        this.openAuto(this.matACTrigger);
      });
    }
    //this.staffeditform.get('preferedlanguage').setValue(null);
  }

  //#endregion

  //#region "AutoComplte panel open"
  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
  }
 //#endregion
  //#region "Value changes for refresh doctor card"
  getStaffById(employeeId) {
    this.staffservice.GetEmployeeByID(employeeId).then(data => {
      this.submitData = data;
    });
  }
  setIdentification(description) {
  
    this.desVal = description;
    if( this.staffeditform.get('PatientIdentificationtypedetails').value){this.staffeditform.get('PatientIdentificationtypedetails').reset();
     
    }
  }
  setIdentification1(description) {
  
    this.desVal = description;
    if( this.staffeditform.get('PatientIdentificationtypedetailsname').value){this.staffeditform.get('PatientIdentificationtypedetailsname').reset();
     
    }
  }

  valid()
  {
    if(this.desVal=='Aadhar') {
      this.staffeditform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/));
    }
    else if (this.desVal=='PAN CARD') {
    this.staffeditform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern( /[A-Z]{5}\d{4}[A-Z]{1}/i));
    }
    else if (this.desVal=='DRIVING LICENSE') {
      this.staffeditform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern(/^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/));
     }
    else if (this.desVal=='VOTER ID') {
      this.staffeditform.controls["PatientIdentificationtypedetails"].setValidators(Validators.pattern(/^([a-zA-Z]){3}([0-9]){7}?$/));
    }
    else if (this.desVal=='RATION CARD') {
      this.staffeditform.controls["PatientIdentificationtypedetails"].setValidators(Validators.maxLength(15));
     }
    else if (this.desVal=='STUDENT ID') {
      this.staffeditform.controls["PatientIdentificationtypedetails"].setValidators(Validators.maxLength(10));
   }
  }
  
  valid1()
  {
    if(this.desVal=='Aadhar') {
      this.staffeditform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/));
    }
    else if (this.desVal=='PAN CARD') {
    this.staffeditform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern( /[A-Z]{5}\d{4}[A-Z]{1}/i));
    }
    else if (this.desVal=='DRIVING LICENSE') {
      this.staffeditform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern(/^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/));
     }
    else if (this.desVal=='VOTER ID') {
      this.staffeditform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.pattern(/^([a-zA-Z]){3}([0-9]){7}?$/));
    }
    else if (this.desVal=='RATION CARD') {
      this.staffeditform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.maxLength(15));
     }
    else if (this.desVal=='STUDENT ID') {
      this.staffeditform.controls["PatientIdentificationtypedetailsname"].setValidators(Validators.maxLength(10));
   }
  }
  // clearForm(){
  //   (<HTMLFormElement>document.getElementById("desVal")).reset();
  // }


  //#endregion
  //#region "Submit"
  submit() {
      this.preferedlanguageid = "";
      for (let i = 0; i < this.languageArray.length; i++) {
        let id = this.languageArray[i];
        if ((i + 1) < this.languageArray.length) {
          this.preferedlanguageid += id + ',';
        } else {
          this.preferedlanguageid += id;
        }
    }
    if (this.staffeditform.valid) {
      this.StaffProfileModel.EmployeeId = this.employeeId;
      this.StaffProfileModel.UserId = this.userid;
      this.StaffProfileModel.EmployeeNo = this.staffeditform.get('EmployeeNumber').value;
      this.StaffProfileModel.EmployeeDepartment = this.departmentid;
      this.StaffProfileModel.FacilityId = this.staffeditform.get('facility').value.toString();
      this.StaffProfileModel.RoleId = this.staffeditform.get('Role').value;
      this.StaffProfileModel.UserId = this.staffeditform.get('UserType').value;
      this.StaffProfileModel.DOJ = this.staffeditform.get('DateofJoining').value;
      this.StaffProfileModel.SchedulerDepartment = this.Scheduledepartmentid;
      this.StaffProfileModel.AdditionalInfo = this.staffeditform.get('AdditionalDetails').value;
      this.StaffProfileModel.IsActive = this.staffeditform.get('IsActive').value;
      this.StaffProfileModel.EmployeeUserType = this.staffeditform.get('UserType').value;
      this.StaffProfileModel.EmployeeSalutation = this.staffeditform.get('Salutation').value;
      this.StaffProfileModel.EmployeeFirstName = this.staffeditform.get('Firstname').value;
      this.StaffProfileModel.EmployeeMiddleName = this.staffeditform.get('MiddleName').value;
      this.StaffProfileModel.EmployeeLastName = this.staffeditform.get('Lastname').value;
      this.StaffProfileModel.Gender = this.staffeditform.get('Gender').value;
      this.StaffProfileModel.EmployeeDOB = this.staffeditform.get('DateofBirth').value;
      this.StaffProfileModel.EmployeeAge = this.staffeditform.get('staffAge').value;
      this.StaffProfileModel.EmployeeIdentificationtype1 = this.staffeditform.get('Identification').value;
      this.StaffProfileModel.EmployeeIdentificationtype1details = this.staffeditform.get('PatientIdentificationtypedetails').value;
      this.StaffProfileModel.EmployeeIdentificationtype2 = this.staffeditform.get('Identificationname').value;
      this.StaffProfileModel.EmployeeIdentificationtype2details = this.staffeditform.get('PatientIdentificationtypedetailsname').value;
      this.StaffProfileModel.MaritalStatus = this.staffeditform.get('MaritalStatus').value;
      this.StaffProfileModel.MothersMaiden = this.staffeditform.get('MothersMaidenName').value;
      this.StaffProfileModel.PreferredLanguage = this.preferedlanguageid;
      this.StaffProfileModel.Bloodgroup = this.staffeditform.get('Bloodgroup').value;
      this.StaffProfileModel.CellNo = this.staffeditform.get('CellNumber').value;
      this.StaffProfileModel.PhoneNo = this.staffeditform.get('PhoneNumber').value;
      this.StaffProfileModel.WhatsAppNo = this.staffeditform.get('WhatsAppNumber').value;
      this.StaffProfileModel.EMail = this.staffeditform.get('Email').value;
      this.StaffProfileModel.EmergencySalutation = this.staffeditform.get('SalutationContact').value;
      this.StaffProfileModel.EmergencyFirstName = this.staffeditform.get('FirstnameConatct').value;
      this.StaffProfileModel.EmergencyLastName = this.staffeditform.get('LastName').value;
      this.StaffProfileModel.EmergencyContactType = this.staffeditform.get('cellNoContact').value;
      this.StaffProfileModel.EmergencyContactNo = this.staffeditform.get('EmergencyNoContact').value;
      this.StaffProfileModel.TelephoneNo = this.staffeditform.get('TelephoneNoContact').value;
      this.StaffProfileModel.Fax = this.staffeditform.get('Fax').value;
      this.StaffProfileModel.RelationshipToEmployee = this.staffeditform.get('RelationshiptoEmployee').value;

      this.StaffProfileModel.staffAddressDetails = this.addressModelCollection;
      this.StaffProfileModel.staffEducationDetails = this.qualificationmodelCollection;
      this.StaffProfileModel.staffWorkDetails = this.workModelCollection;
      this.StaffProfileModel.staffFamilyDetails = this.familyModelCollection;
      this.StaffProfileModel.staffLanguageDetails = this.languageModelCollection;
      this.StaffProfileModel.staffCampusDetails = this.campusCollection;
      this.StaffProfileModel.staffHobbyDetails = this.hobbiesmodelCollection;
      this.staffservice.addStaff(this.StaffProfileModel).then((res) => {
        if (this.formData == null || this.formData == undefined) {
          this.util.showMessage('', ' Staff Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
            if (res) {
              this.router.navigate(['/home/staff']);
            }
          });
        }
        // this.staffSetValue();

        if (this.formData != null) {
          // const formData = new FormData();
          // formData.append('file', this.FileUpload, this.FileUpload.name);
          this.staffservice.FileUpload(this.formData, res.EmployeeId, "Staff").then((res) => {
            if (res = "File successfully uploaded") {
              this.util.showMessage('', ' Staff Details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.staffSetValue();
                  this.getStaffById(this.employeeId);
                  this.imageFlag = true;
                  this.router.navigate(['/home/staff']);
                }
              });

            } else {
              this.util.showMessage('', res, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
                if (res) {
                  this.router.navigate(['/home/staff']);

                }
              });
            }
          })
        }


      });
    }
    }
  
//#endregion
   //#region "back"
  back() {
    this.router.navigate(['/home/staff']);
  }
  //#endregion
  //#region "Edit popup"
  openAddressStaff(Addressconatct,i) {
    const dialogRef = this.dialog.open(StaffAddressComponent, {
      data: Addressconatct,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addressModelCollection.splice(i, 1, result);
      } 
     // let staffAddressModel = new StaffAddressModel();
     // staffAddressModel = result;
   //  let a= this.addressModelCollection.indexOf(Addressconatct);
    //  this.addressModelCollection[a] = (result);
      //
    });
  }

  openEducationStaff(Education, i) {
    const dialogRef = this.dialog.open(staffEducationComponent, {
      data: Education,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.qualificationmodelCollection.splice(i, 1, result);
      }
    });
  }
  openWorkStaff(WorkHistory, i) {
    const dialogRef = this.dialog.open(staffWorkComponent, {
      data: WorkHistory,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workModelCollection.splice(i, 1, result);
      }
    });
  }

  openFamilyStaff(FamilyHistory, i) {
    const dialogRef = this.dialog.open(staffFamilyComponent, {
      data: FamilyHistory,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.familyModelCollection.splice(i, 1, result);
      }
    });
  }

  openLanguageStaff(language, i) {
    const dialogRef = this.dialog.open(staffLanguageComponent, {
      data: language,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.languageModelCollection.splice(i, 1, result);
      }
    });
  }

  openCampusStaff(language, i) {
    const dialogRef = this.dialog.open(staffCampusComponent, {
      data: language,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.campusCollection.splice(i, 1, result);
      }
    });
  }
  openHobbyStaff(hobby, i) {
    const dialogRef = this.dialog.open(staffHobbyComponent, {
      data: hobby,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.hobbiesmodelCollection.splice(i, 1, result);
      }
    });
  }
  //#endregion
  //#region "File Upload"
  public imageUpload(file): void {
    this.convertToBase64(file);
    let files = file.target.files
    if (files.length === 0) {
      this.util.showMessage("Error!!", " please choose an image format ", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
      return;
    }
    if (files[0].type.match(/image.*/)) {
      let Temporaryfiles: File = <File>files[0];
      this.FileUpload = (Temporaryfiles);

      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Temporaryfiles.name;
      viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
      this.ViewFileUpload = (viewFile);
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl(this.profilePics);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
      if (this.profilePics) {
        this.imageFlag = false;
      } else {
        this.imageFlag = true;
      }

    } else {
      this.util.showMessage("error!!", "not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);
    }
    this.attachement.nativeElement.value = '';

  }
  //#endregion
//  //#region "Remove"
//  public RemoveFile(): void {
//    this.ViewFileUpload = (null);
//    this.FileUpload = (null);
//    this.profilePics = null;
//    if (this.profilePics) {
//      this.imageFlag = false;
//    } else {
//      this.imageFlag = true;
//    }

//  } RemoveFile
////#endregion
  //#region "File upload"
  convertToBase64(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.profilePics = (<FileReader>event.target).result;
      }
    }
  }
  //#endregion
  //#region "Address"
  openAddress(){
    document.getElementById("Address").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
    document.getElementById("Address").style.color = "#fff";

  }
    //#endregion
   //#region "Set facility"
  setFacility() {
    this.facilitytooltip = [];
    this.facilityvalue = this.staffeditform.get('facility').value;
    for (const option of this.Facility) {
      for (const i of this.facilityvalue) {
        if (i == option.FacilityId) {
          this.facilitytooltip.push(option.FacilityName);
        }
      }
    }
  }
  //#endregion

  openImageCropper() {
    const dialogRef = this.dialog.open(imageCropComponent, {
      data: this.staffeditform.get('Firstname').value,
      height: '450px',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formData = (result.formData);
        this.profilePics = result.image;
        if (this.profilePics) {
          this.imageFlag = false;
        } else {
          this.imageFlag = true;
        }
      }
    });
  }
}
  //setLanguageid(number) {
  // //this.languages.push(number);
  //}

  ////#region "Set Tooltip"
  //setPreferedLanguageTooltip(value) {
  //  this.preferedlanguageTollTip = value;
  //}
  ////#endregion "Set Tooltip"
  //getPreferedLanguage() {
  //  if (this.staffeditform.get('preferedlanguage').value != null) {
  //    this.staffeditform.get('preferedlanguage').valueChanges.subscribe((key: string) => {
  //      if (key != null) {
  //        if (key.length > 2) {
  //          this.staffservice.getPreferedLanguage(key).then(data => {
  //            this.Preferedlanguage = data;
  //          })
  //        }
  //        else {
  //          this.preferedlanguage = null;
  //          this.preferedlanguageTollTip = null;
  //        }
  //      } else {
  //        this.preferedlanguage = null;
  //        this.preferedlanguageTollTip = null;
  //      }
  //    })
  //  }
  //}
  // //#region "Edit Campus"
  //EditCampus(campus, i) {
  //  this.tempArray = campus;
  //  this.hidecampus[i] = true;
  //  this.addanothercampus = true;
  //  const othername = <FormArray>(this.staffeditform.controls["campusmodel"]);

  //  othername.controls[0].get('Name').setValue(this.tempArray.Name);
  //  othername.controls[0].get('Date').setValue(this.tempArray.CampusDate);
  //  othername.controls[0].get('Details').setValue(this.tempArray.Details);
  //}
  ////#endregion
  ////#region "Edit Hobbies"
  //EditHobbies(Hobbies, i) {
  //  this.hideExtraActivity[i] = true;
  //  this.ExtraActivity = true;
  //  this.tempArray = Hobbies;
  //  const othername = <FormArray>(this.staffeditform.controls["hobbies"]);
  //  othername.controls[0].get('ActivityType').setValue(this.tempArray.ActivityType);
  //  othername.controls[0].get('Detailsname').setValue(this.tempArray.Details);

  //}
  ////#endregion
  ////#region "MultiSelect Filter"
 //  this.filteredLanguage = this.staffeditform.get('preferedlanguage').valueChanges.pipe(startWith(null), map((language: string | null) => language ? this._filter(language) : this.Preferedlanguage.slice()));
  //private _filter(value: any): string[] {
  //  if (value.LanguageDescription == undefined) {
  //    const filterValue = value;
  //    for (let i = 0; i < this.Preferedlanguage.LanguageDescription; i++) {
  //      this.languageDescription.push(this.Preferedlanguage[i].LanguageDescription)
  //    }
  //    return this.languageDescription.filter((language) => language.toLowerCase().indexOf(filterValue) >= 0);
  //  } else {
  //    const filterValue = value.LanguageDescription
  //    this.filterValue.push(this.Preferedlanguage[0].LanguageDescription);
  //    return this.filterValue.filter((language) => language.toLowerCase().indexOf(filterValue) >= 0
  //    );
  //  }
  //}
  ////#endregion
