import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { PhysicianService } from 'src/app/physician/physician.service';
import { StaffService } from 'src/app/staff/staff.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
@Component({
  selector: 'app-signUpComponent',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})

export class signUpComponent implements OnInit {
  @ViewChild('autoCompleteSchedulerDepartment', { static: false, read: MatAutocompleteTrigger }) triggerschedule: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('LanguageInput', { static: true }) LanguageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  @ViewChild('autocompleteTrigger', { static: true }) matACTrigger: MatAutocompleteTrigger;
  addPhysicianForm: FormGroup;
  staffaddform: FormGroup;
  gender: any;
  Facility: any;
  Role: any;
  bindAge: number;
  bindDOB: Date;
  role: any;
  salutation: any;
  Identification: any;
  martialstatus: any;
  bloodgroup: any;
  relation: any;
  contactType: any;
  UserType: any;
  department: any;
  departmentToolTip: any;
  departmentid: any;
  Schedulerdepartment: any;
  SchedulerdepartmentToolTip: any;
  Scheduledepartmentid: any;
  Preferedlanguage: any;
  languages: any = [];
  languageDescription: any = [];
  languageArray: any = [];
  filteredLanguage: Observable<string[]> | string;
  autoGenerateEmployeeNo: any;
  facilitytooltip: any[];
  facilityvalue: any;

  //#region constructor   

  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<signUpComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private physicianservice: PhysicianService, private customHttpSvc: CustomHttpService, private staffservice: StaffService) { }

  //#endregion constructor

  //#region ngOnInit

  ngOnInit(): void {
    this.customHttpSvc.getDbName("VasaneyecareTrichy");
    this.addPhysicianForm = this.fb.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: [''],
      NamePrefix: [''],
      NameSuffix: [''],
      Title: [''],
      BirthDate: [''],
      Gender: ['', Validators.required],
      PersonalEmail: ['', [Validators.required, Validators.pattern("^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")]],
      Language: [''],
      PreferredLanguage: [''],
      MothersMaidenName: [''],
      WebsiteName: [''],
      facility: ['', Validators.required],
      Role: ['', Validators.required],
      IsActive: [true],
      PhysicianAge: ['', Validators.required],
    });

    this.staffaddform = this.fb.group({
      Department: [''],
      Category: [''],
      Role: ['', Validators.required],
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
      identiDetail: ['', Validators.required],
      MaritalStatus: [''],
      MothersMaidenName: [''],
      preferedlanguage: [''],
      Bloodgroup: [''],
      IsActive: [true],
      newyear: [new Date().getFullYear()],
      facility: ['', Validators.required],
      CellNumber: [''],
      PhoneNumber: [''],
      WhatsAppNumber: [''],
      Drug: [''],
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
    // this.getGenderforPhysician();
    // this.getrole();
    // this.getFacility();
    // this.getFacility();
    // this.getRole();
    // this.getSalutation();
    // this.getGender();
    // this.getIdentification();
    // this.getMartialStatus();
    // this.getBloodGroup();
    // this.getRelation();
    // this.getContactType();
    // this.getUserType();
    // this.getDepartment();
    // this.getSchedulerDepartment();
    // this.getLanguageMultiselect();
    // this.getStaffEmployeeNo();
  }

  //#endregion ngOnInit




  //#region Other Function
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion Other Function

  //#region "Clear"
  clear() {
    this.addPhysicianForm.reset();
  }
  //#endregion
  //#region "Gender"
  getGenderforPhysician() {
    this.physicianservice.getGenderforPhysician().then(res => {
      this.gender = res;
    })
  }
  //#endregion

  // #region "role"
  getrole() {
    this.physicianservice.getRole().then(res => {
      this.Role = res;
    })
  }
  //#endregion
  //#region "DOB"
  bindDobphy() {
    this.bindAge = new Date().getFullYear() - new Date(this.addPhysicianForm.get('BirthDate').value).getFullYear();
    this.addPhysicianForm.get('PhysicianAge').setValue(this.bindAge);
  }
  //#endregion
  //#region "Age"
  bindAgeDobphy() {
    this.bindDOB = new Date((new Date().getFullYear() - this.addPhysicianForm.get('PhysicianAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.addPhysicianForm.get('BirthDate').setValue(this.bindDOB);
  }
  //#endregion

  // #region "Facility"
  getFacility() {
    this.staffservice.getFacility().then(res => {
      this.Facility = res;
    })
  }
  //#endregion
  //#region BindDob
  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.staffaddform.get('DateofBirth').value).getFullYear();
    this.staffaddform.get('staffAge').setValue(this.bindAge);
  }
  //#endregion
  //#region BindAge
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.staffaddform.get('staffAge').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.staffaddform.get('DateofBirth').setValue(this.bindDOB);
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
  //#region "whatsappNo"
  whatsapp() {
    if (!this.staffaddform.get('Drug').value) {
      this.staffaddform.get('WhatsAppNumber').setValue(this.staffaddform.get('CellNumber').value);
    } else {
      this.staffaddform.get('WhatsAppNumber').setValue("");
    }
  }
  //#endregion

  //#region "getUserType"
  getUserType() {
    this.staffservice.getUserType().then(res => {
      this.UserType = res;
    })
  }
  //#endregion
  //#region "Department"
  getDepartment() {
    if (this.staffaddform.get('Department').value != null) {
      this.staffaddform.get('Department').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getDepartment(key).then(data => {
              this.department = data;
              //this.staffaddform.get('preferedlanguage').setValue('');

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
  //#region "Set Tooltip"
  setDepartmentToolTip(value, number) {
    this.departmentToolTip = value;
    this.departmentid = number;
  }
  //#endregion "Set Tooltip"
  //#region "Schedule Department"
  getSchedulerDepartment() {
    if (this.staffaddform.get('SchedulerDepartment').value != null) {
      this.staffaddform.get('SchedulerDepartment').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getDepartment(key).then(data => {
              this.Schedulerdepartment = data;
              // this.staffaddform.get('preferedlanguage').setValue('');
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
    if (this.staffaddform.get('preferedlanguage').value != null) {
      this.staffaddform.get('preferedlanguage').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.staffservice.getPreferedLanguage(key).then(data => {
              this.Preferedlanguage = data;
              //this.filteredLanguage = data;
              //this.staffaddform.get('preferedlanguage').setValue('');
            })
          }
        } else {
          this.Preferedlanguage = [];
        }
      })
    }
  }

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
      this.staffaddform.get('preferedlanguage').setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const languageDescription = event.option.value.LanguageDescription;
    const languageid = event.option.value.LanguageId;
    // if (this.languages.includes(languageDescription)) {
    //   this.languages = [...this.languages.filter((language) => language !== languageDescription)];
    //   this.languageArray = [...this.languageArray.filter((languages) => languages !== languageid)];
    // } else {
    //   this.languages.push(event.option.value.LanguageDescription);
    //   this.languageArray.push(event.option.value.LanguageId);
    // }

    this.LanguageInput.nativeElement.value = '';
    if (this.languages.length == 0) {
      this.Preferedlanguage = [];
    } else {
      requestAnimationFrame(() => {
        this.openAuto(this.matACTrigger);
      });
    }
  }


  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
  }

  getStaffEmployeeNo() {
    this.staffservice.getStaffEmployeeNo().then(res => {
      this.autoGenerateEmployeeNo = res[0];
      this.staffaddform.get('EmployeeNumber').setValue(this.autoGenerateEmployeeNo);
    })
  }


  setFacility() {
    this.facilitytooltip = [];
    this.facilityvalue = this.staffaddform.get('facility').value;
    for (const option of this.Facility) {
      for (const i of this.facilityvalue) {
        if (i == option.FacilityId) {
          this.facilitytooltip.push(option.FacilityName);
        }
      }
    }
  }
}

