import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { admission01Model } from '../../Models/admission01Model';
import { NewPatientRegModel } from '../../../patient/models/newPatientRegModel';
import { AdmissionService } from '../../admission.service';
import { NewPatientService } from '../../../patient/newPatient.service';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { admissionsmodel } from '../../../admission/Models/admissionsmodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-admission-add-record',
  templateUrl: './new-admission-add-record.component.html',
  styleUrls: ['./new-admission-add-record.component.css']
})
export class NewAdmissionAddRecordComponent implements OnInit {
  minDate = new Date();
  maxDate=new Date();
  //#region Property Declaration

  quickRegisterForm: FormGroup;
  SearchRegisterForm: FormGroup;
  newAdmissionModel: admission01Model = new admission01Model;
  newPatientRegModel: NewPatientRegModel = new NewPatientRegModel;
  admissionsmodel: admissionsmodel = new admissionsmodel();
  patientID: number;
  patId: any;
  gender: any;
  salutation: any
  show: boolean = false;
  patientId: number = 1;
  specialitiesInfo: any[] = [];
  patientArraivalConditon: any[] = [];
  cptCode: any;
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  patientList: any;
  filteredOptions: any;
  patientById: any;
  disable: boolean = false;
  patientArrivalBy: any;
  admissionType: any;
  patienId: any;
  admissionNumber: any;
  Physician: any;
  procedurenameproperty: any;
  speciality: any;
  recordby: any;
  patientarrival: any;
  patientarrivall: any;
  AdmissionStatuses: any;
  ProcedureType: any;
  UrgencyType: any;
  Admitingphysiciansurgeon: any;
  primaryicd: any;
  procedurename: any;
  primarycpt: any;
  setcpttooltip: any = "";
  seticdtooltip: any = "";
  patientArrivalvalue: any;
  bindAge: number;
  bindDOB: Date;
  facilityData: any;
  QuickAdmitingphysiciansurgeon: any;
  SearchfacilityData: any;
  searchfacilityName: any = "";
  filteredProviders: any;
  filteredProviderssearch: any;
  @ViewChild('autophysicianname', { static: false, read: MatAutocompleteTrigger }) triggerphysician: MatAutocompleteTrigger;
  @ViewChild('autoprocedurenamevalue', { static: false, read: MatAutocompleteTrigger }) triggerprocedure: MatAutocompleteTrigger;
  @ViewChild('autoCompletecpt', { static: false, read: MatAutocompleteTrigger }) triggercpt: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) triggerphysicianvalue: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProcedureSearch', { static: false, read: MatAutocompleteTrigger }) triggerprocedureSearch: MatAutocompleteTrigger;
  @ViewChild('autoCptcode', { static: false, read: MatAutocompleteTrigger }) triggerCptSearch: MatAutocompleteTrigger;
  @ViewChild('autoCompleteIcd', { static: false, read: MatAutocompleteTrigger }) icd: MatAutocompleteTrigger;
  @ViewChild('autoCompleteIcdcodeSearch', { static: false, read: MatAutocompleteTrigger }) icdSearch: MatAutocompleteTrigger;

  //#endregion Property Declaration

  //#region constructor
  constructor(private router: Router, public admissionService: AdmissionService, public datePipe: DatePipe, public fb: FormBuilder,
    public newPatientService: NewPatientService, public dialogRef: MatDialogRef<NewAdmissionAddRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService) { }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.quickRegisterForm = this.fb.group({
      SearchPatientList: [''],
      physicianid: [Validators.required],
      Facility: ['', Validators.required],
      Salutation: ['', Validators.required],
      PatientFirstName: ['', Validators.required],
      PatientLastName: ['', Validators.required],
      Gender: ['', Validators.required],
      PatientDOB: ['', Validators.required],
      PrimaryContactNumber:  ['', [Validators.required]],
      Emergencycontactnumber: ['', [Validators.required]],
      NKFirstname: ['', Validators.required],
      NKPrimarycontactnumber:  ['', [Validators.required]],
      AdmissionDate: [new Date(), Validators.required],
      AdmissionTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      AdmissionNo: ['',],
      generaladmission: [''],
      AdmissionType: ['', Validators.required],
      AdmittingReason: [''],
      PatientArrivalBy: [0],
      AdmitingPhysicianSurgeon: ['', Validators.required],
      preprocedureDiagnosis: ['', Validators.required],
      ProcedureName: ['', Validators.required],
      PrimaryICDCOde: ['',],
      ProcedureType: ['', Validators.required],
      PlannedProcedure: ['',],
      PrimaryCPTCode: ['', Validators.required],
      Urgency: ['', Validators.required],
    //  Specialities: ['', Validators.required],
      PatientArrivalCondition: ['', Validators.required],
      PatientExpectedStay: ['', Validators.required],
      AnsthesiaFittnessRequired: ['', Validators.required],
      Bloodcheck: ['', Validators.required],
      IntialAdmissionStatus: ['', Validators.required],
      InstructionToPatient: ['',],
      AccompaniedBY: ['', Validators.required],
      WardBeddetails: ['',],
      EnterAdditionalInformation: [''],
      Blooddesc: [''],
      Blood: [''],
      anethsiadesc: ['', Validators.required],
      AnsthesiaFittnessRequiredcheck: ['', Validators.required],
      Age: [''],
    })
    this.SearchRegisterForm = this.fb.group({
      SearchPatientList: [''],
      physicianid: [Validators.required],
      Facility: [''],
      AdmissionDate: [new Date(), Validators.required],
      AdmissionTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      AdmissionNo: ['',],
      generaladmission: [''],
      AdmissionType: ['', Validators.required],
      AdmittingReason: [''],
      PatientArrivalBy: [0],
      AdmitingPhysicianSurgeon: ['', Validators.required],
      preprocedureDiagnosis: ['', Validators.required],
      ProcedureName: ['', Validators.required],
      PrimaryICDCOde: ['',],
      ProcedureType: ['', Validators.required],
      PlannedProcedure: ['',],
      PrimaryCPTCode: ['', Validators.required],
      Urgency: ['', Validators.required],
     // Specialities: ['', Validators.required],
      PatientArrivalCondition: ['', Validators.required],
      PatientExpectedStay: ['', Validators.required],
      AnsthesiaFittnessRequired: ['', Validators.required],
      Bloodcheck: ['', Validators.required],
      IntialAdmissionStatus: ['', Validators.required],
      InstructionToPatient: ['',],
      AccompaniedBY: ['', Validators.required],
      WardBeddetails: ['',],
      EnterAdditionalInformation: ['',],
      Blooddesc: [''],
      Blood: [''],
      anethsiadesc: ['', Validators.required],
      AnsthesiaFittnessRequiredcheck: ['', Validators.required],
    })
    this.getFacility();
    this.getSpecialitiesDeatils();
    this.getPatientArrivalConditions();
    this.getPatientList();
    this.getAdmissiontype();
    this.getpatientArrivalby();
    this.getAdmissionNumber();
    this.getGenderforPatient();
    this.getSalutionforPatient();
    this.getSpeciality();
    this.getRecorde();
    this.getPatientarrival();
    this.getPatientArrivalbyValue();
    this.getAdmissionStatusesforAdmission();
    this.getProcedureTypesforAdmissionn();
    this.GetUrgencyTypes();
    this.primarycptcode();
    this.ProceduresforAdmission();
    this.primaryicdname();
    this.Searchprimarycptcode();
    this.Searchprimaryicdname();
    this.SearchProceduresforAdmission();
    // this.quickRegisterForm.get('AdmissionNo').disable();
    this.quickRegisterForm.get("generaladmission").setValue("General");
    this.quickRegisterForm.get("Blood").setValue(false);
    this.quickRegisterForm.get("AnsthesiaFittnessRequired").setValue(false);
    this.SearchRegisterForm.get("generaladmission").setValue("General");
    this.SearchRegisterForm.get("Blood").setValue(false);
    this.SearchRegisterForm.get("AnsthesiaFittnessRequired").setValue(false);
  }
  //#endregion 
  //#region Get Methods

  tovalidatephysiciansearch() {
    this.triggerphysicianvalue.panelClosingActions.subscribe(physician => {
      if (!(physician && physician.source)) {
        this.SearchRegisterForm.get('AdmitingPhysicianSurgeon').setValue('');
      }
    });
  }

  tovalidateProcedureSearch() {
    this.triggerprocedureSearch.panelClosingActions.subscribe(procedure => {
      if (!(procedure && procedure.source)) {
        this.SearchRegisterForm.get('ProcedureName').setValue('');
      }
    });
  }

  toValidateicd() {
    this.icd.panelClosingActions.subscribe(procedure => {
      if (!(procedure && procedure.source)) {
        this.quickRegisterForm.get('PrimaryICDCOde').setValue('');
      }
    });
  }
  toValidateIcdSearch() {
    this.icdSearch.panelClosingActions.subscribe(procedure => {
      if (!(procedure && procedure.source)) {
        this.SearchRegisterForm.get('PrimaryICDCOde').setValue('');
      }
    });
  }
  toValidateProcedurename() {
    this.triggerprocedure.panelClosingActions.subscribe(procedurename => {
      if (!(procedurename && procedurename.source)) {
        this.quickRegisterForm.get('ProcedureName').setValue('');
      }
    });
  }
  toValidateCptCode() {
    this.triggercpt.panelClosingActions.subscribe(cpt => {
      if (!(cpt && cpt.source)) {
        this.quickRegisterForm.get('PrimaryCPTCode').setValue('');
      }
    });
  }

  toValidateCptSearch() {
    this.triggerCptSearch.panelClosingActions.subscribe(cpt => {
      if (!(cpt && cpt.source)) {
        this.SearchRegisterForm.get('PrimaryCPTCode').setValue('');
      }
    });
  }
  //getFacility()
  getFacility(): void {
    this.admissionService.getFacility().then((res) => {
      this.facilityData = res;
      this.SearchfacilityData = res;
    })
  }

  //AdmitingPhysicianSurgeon
  GetQuickPhysicianData(Facilityid: number): void {
    this.quickRegisterForm.get('AdmitingPhysicianSurgeon').reset();
    this.admissionService.getProvidersbyfacilityId(Facilityid).then((res) => {
      this.QuickAdmitingphysiciansurgeon = res;
      this.filteredProviders = this.quickRegisterForm.get('AdmitingPhysicianSurgeon').valueChanges.pipe(startWith(''), map(value => this.filterProvider(value)));

    })
    this.triggerphysician.panelClosingActions.subscribe(physician => {
      if (!(physician && physician.source)) {
        this.quickRegisterForm.get('AdmitingPhysicianSurgeon').setValue('');
      }
    });
  }
  private filterProvider(value: string): string[] {
    return this.QuickAdmitingphysiciansurgeon.filter((x) => new RegExp(value, 'gi').test(x.FirstName) || new RegExp(value, 'gi').test(x.MiddleName) || new RegExp(value, 'gi').test(x.LastName));
  }
  GetsearchPhysicianData(Facilityid: number): void {
    this.SearchRegisterForm.get('AdmitingPhysicianSurgeon').reset();
    this.admissionService.getProvidersbyfacilityId(Facilityid).then((res) => {
      this.Admitingphysiciansurgeon = res;
      this.filteredProviderssearch = this.SearchRegisterForm.get('AdmitingPhysicianSurgeon').valueChanges.pipe(startWith(''), map(value => this.filterProviderphysician(value)));

    })
  }
  private filterProviderphysician(value: string): string[] {
    return this.Admitingphysiciansurgeon.filter((x) => new RegExp(value, 'gi').test(x.FirstName) || new RegExp(value, 'gi').test(x.MiddleName) || new RegExp(value, 'gi').test(x.LastName));
  }
  //Get patient id
  getPatientId(id: number) {
    this.patienId = id;
    this.newPatientService.getPatientDetailsById(id).then(data => {
      if (data != undefined) {
        this.patientById = data;
        this.show = true;
        this.disable = true;
        this.searchfacilityName = data.FacilityName;
        this.GetsearchPhysicianData(data.FacilityId);
      }
    });
  }

  //Gender
  getGenderforPatient() {
    this.newPatientService.getGenderforPatient().then(res => {
      this.gender = res;
    })
  }
  //Saluation
  getSalutionforPatient() {
    this.newPatientService.getSalutionforPatient().then(res => {
      this.salutation = res;
    })
  }
  //Speciality
  getSpecialitiesDeatils() {
    this.admissionService.GetSpecialities().then(res => {
      for (let i = 0; i < res.length; i++) {
        this.specialitiesInfo[i] = res[i].SpecialityDescription;
      }
    })
  }
  //patient Arrival Condition
  getPatientArrivalConditions() {
    this.admissionService.GetPatientArrivalConditions().then(res => {
      for (let i = 0; i < res.length; i++) {
        this.patientArraivalConditon[i] = res[i].PatientArrivalconditionDescription;
      }
    })
  }
  //Searchpatient
  regToggle() {
    this.show = false;
    this.quickRegisterForm.get('SearchPatientList').setValue("");
  }
  //Patient Arrival by
  getpatientArrivalby() {
    this.admissionService.getPatientArrivalBy().then(res => {
      this.patientArrivalBy = res;
    })
  }
  //Admision type
  getAdmissiontype() {
    this.admissionService.getAdmissionType().then(res => {
      this.admissionType = res;
    })
  }
  //Admission no
  getAdmissionNumber() {
    this.admissionService.getAdmissionNumber().then(res => {
      this.admissionNumber = res[0];
    })
  }
  //Searchpatient
  buttonDisable(data: any) {
    if (this.quickRegisterForm.get('SearchPatientList').value.length == 0) {
      this.disable = false;
    }
  }
  //procedurename
  setprocedurename(number) {
    this.procedurenameproperty = number;

  }
  //procedure physician
  setprocedurephysician(number) {
    this.quickRegisterForm.get('physicianid').setValue(number);
  }

  setSearchprocedurephysician(number) {
    this.SearchRegisterForm.get('physicianid').setValue(number);
  }

  //speciality
  getSpeciality() {
    this.admissionService.Getspecialities().then(res => {
      this.speciality = res;
    })
  }
  //Record by
  getRecorde() {
    this.admissionService.GetAdmissionTypes().then(res => {
      this.recordby = res;
    })
  }
  //patientArrival by
  getPatientarrival() {
    this.admissionService.GetPatientarrival().then(res => {
      this.patientarrival = res;
    })
  }

  //PrimaryICDCOde
  primaryicdname() {
    if (this.quickRegisterForm.get('PrimaryICDCOde').value != null) {
      this.quickRegisterForm.get('PrimaryICDCOde').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.GetIcd(key).then(data => {

                this.primaryicd = data;
              })
            }
            else {
              this.primaryicd = null;
              this.seticdtooltip = null;
            }
          }
          else {
            this.primaryicd = null;
            this.seticdtooltip = null;
          }
        })
    }
  }
  //PrimaryCPTCode
  primarycptcode() {
    if (this.quickRegisterForm.get('PrimaryCPTCode').value != null) {
      this.quickRegisterForm.get('PrimaryCPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.Gettreatment(key).then(data => {
                this.primarycpt = data;
              })
            }
            else {
              this.primarycpt = null;
              this.setcpttooltip = null;
            }
          }
          else {
            this.primarycpt = null;
            this.setcpttooltip = null;
          }
        })
    }
  }
  //ProcedureName
  ProceduresforAdmission() {
    
    if (this.quickRegisterForm.get('ProcedureName').value != null) {
      
      this.quickRegisterForm.get('ProcedureName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.GetProceduresforAdmission(key).then(data => {
                this.procedurename = data;
              });
            }
            else {
              this.procedurename = null;            
            }
          }
        })
    }
  }

  //PrimaryICDCOde
  Searchprimaryicdname() {
    if (this.SearchRegisterForm.get('PrimaryICDCOde').value != null) {
      this.SearchRegisterForm.get('PrimaryICDCOde').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.GetIcd(key).then(data => {
                this.primaryicd = data;
              })
            }
            else {
              this.primaryicd = null;
              this.seticdtooltip = null;
            }
          }
          else {
            this.primaryicd = null;
            this.seticdtooltip = null;
          }
        })
    }
  }
  //PrimaryCPTCode
  Searchprimarycptcode() {
    if (this.SearchRegisterForm.get('PrimaryCPTCode').value != null) {
      this.SearchRegisterForm.get('PrimaryCPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.Gettreatment(key).then(data => {
                this.primarycpt = data;
              })
            }
            else {
              this.primarycpt = null;
              this.setcpttooltip = null;
            }
          }
          else {
            this.primarycpt = null;
            this.setcpttooltip = null;
          }
        })
    }
  }
  //ProcedureName
  SearchProceduresforAdmission() {
    if (this.SearchRegisterForm.get('ProcedureName').value != null) {
      this.SearchRegisterForm.get('ProcedureName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.GetProceduresforAdmission(key).then(data => {

                this.procedurename = data;
              })
            }
            else {
              this.procedurename = null;
            }
          }
        })
    }
  }
  //patientarrivall
  getPatientArrivalbyValue() {
    this.admissionService.GetPatientArrivalbyValues().then(res => {
      this.patientarrivall = res;
    })

  }
  //AdmissionStatuses
  getAdmissionStatusesforAdmission() {
    this.admissionService.GetAdmissionStatusesforAdmission().then(res => {
      this.AdmissionStatuses = res;
    })

  }
  //ProcedureType
  getProcedureTypesforAdmissionn() {
    this.admissionService.GetProcedureTypesforAdmission().then(res => {
      this.ProcedureType = res;
    })

  }
  //AdmissionNumber

  //Blood
  setBloodRequired() {
    if (this.quickRegisterForm.get("Bloodcheck").value == "1") {
      this.quickRegisterForm.get("Blood").setValue(true);
    }
    else {
      this.quickRegisterForm.get("Blood").setValue(false);
    }
  }
  //generaladmission
  setAdmissionrequired() {
    if (this.quickRegisterForm.get("generaladmission").value == "General") {
      this.quickRegisterForm.get("generaladmission").setValue("General");
    }
    else {
      this.quickRegisterForm.get("generaladmission").setValue("Emergency");
    }
  }
  //AnsthesiaFittnessRequiredcheck
  setAnsthesiaFittnessRequired() {
    if (this.quickRegisterForm.get("AnsthesiaFittnessRequiredcheck").value == "1") {
      this.quickRegisterForm.get("AnsthesiaFittnessRequired").setValue(true);
    } else {
      this.quickRegisterForm.get("AnsthesiaFittnessRequired").setValue(false);
    }
  }
  //UrgencyTypes
  GetUrgencyTypes() {
    this.admissionService.GetUrgencyTypes().then(res => {
      this.UrgencyType = res;
    })

  }
  //SearchPatientList
  getPatientList() {
    this.newPatientService.getAllPatientData1().then(res => {
      this.patientList = res;
      this.filteredOptions = this.quickRegisterForm.get('SearchPatientList').valueChanges.pipe(startWith(''),
        map(value => this._filter(value))
      )
    });
  }
  private _filter(value: string): string[] {
    this.show = false;
    if (value != null) {
      if (value.length > 2) {

        const filterValue = value.toLowerCase();
        return this.patientList.filter((x) => new RegExp(value, 'gi').test(x.PatientFullName));
      }
    }
  }
  dialogClose(): void {
    this.dialogRef.close();
  }
  CancelData() {
    this.quickRegisterForm.reset();
    this.quickRegisterForm.get('AdmissionTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required);
    this.quickRegisterForm.get("generaladmission").setValue("General");
    this.disable = false;
  }
  //close
  //SetPrimaryCptCode
  setPrimaryCptCode(value1, value2) {
    this.setcpttooltip = value1 + " " + value2;
  }
  //SetPrimaryIcdCode
  setPrimaryIcdCode(value1, value2) {
    this.seticdtooltip = value1 + " " + value2;
  }
  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.quickRegisterForm.get('PatientDOB').value).getFullYear();
    this.quickRegisterForm.get('Age').setValue(this.bindAge);
  }
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.quickRegisterForm.get('Age').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.quickRegisterForm.get('PatientDOB').setValue(this.bindDOB);
  }
  //#endregion Get Methods
  //Admission date and time
  getQuickRegistrationInfo() {
    if (this.show) {

      this.getDate = new Date(this.SearchRegisterForm.get("AdmissionDate").value);
      if (this.SearchRegisterForm.get("AdmissionDate").value != "") {
        if (this.SearchRegisterForm.get("AdmissionTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
          if (parseInt(this.SearchRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
            this.getTimeHH = 12;
          }
          else {
            this.getTimeHH = parseInt(this.SearchRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
          }
        }
        else if (this.SearchRegisterForm.get("AdmissionTime").value.toString().toLowerCase().split(' ')[1] == "am") {
          if (parseInt(this.SearchRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
            this.getTimeHH = 0;
          }
          else {
            this.getTimeHH = parseInt(this.SearchRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]);
          }
        }
        this.getTimeMin = parseInt(this.SearchRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[1]);
        this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
      }

      if (this.SearchRegisterForm.valid) {

        this.getDateAndTime = this.getDate;
        this.admissionsmodel.PatientID = this.patientById.PatientId;
        this.admissionsmodel.AdmissionDateTime = this.getDateAndTime;
        this.admissionsmodel.FacilityID = this.patientById.FacilityId;
        this.admissionsmodel.AdmissionNo = this.admissionNumber;
        this.admissionsmodel.ProcedureRequestId = 0;
        this.admissionsmodel.AdmissionOrigin = this.SearchRegisterForm.get('generaladmission').value;
        this.admissionsmodel.AdmissionType = this.SearchRegisterForm.get('AdmissionType').value;
        this.admissionsmodel.PatientArrivalBy = this.SearchRegisterForm.get('PatientArrivalBy').value;
        this.admissionsmodel.AdmittingPhysician = this.SearchRegisterForm.get('physicianid').value;
        this.admissionsmodel.AdmittingReason = this.SearchRegisterForm.get('AdmittingReason').value;
        this.admissionsmodel.PreProcedureDiagnosis = this.SearchRegisterForm.get('preprocedureDiagnosis').value;
        this.admissionsmodel.ProcedureName = this.procedurenameproperty;
        this.admissionsmodel.ICDCode = this.SearchRegisterForm.get('PrimaryICDCOde').value;
        this.admissionsmodel.ProcedureType = this.SearchRegisterForm.get('ProcedureType').value;
     //   this.admissionsmodel.SpecialityID = this.SearchRegisterForm.get('Specialities').value;
        this.admissionsmodel.PlannedProcedure = this.SearchRegisterForm.get('PlannedProcedure').value;
        this.admissionsmodel.CPTCode = this.SearchRegisterForm.get('PrimaryCPTCode').value;
        this.admissionsmodel.UrgencyID = this.SearchRegisterForm.get('Urgency').value;
        this.admissionsmodel.PatientArrivalCondition = this.SearchRegisterForm.get('PatientArrivalCondition').value;
        this.admissionsmodel.PatientExpectedStay = this.SearchRegisterForm.get('PatientExpectedStay').value;
        this.admissionsmodel.AnesthesiaFitnessRequired = this.SearchRegisterForm.get('AnsthesiaFittnessRequired').value;
        this.admissionsmodel.BloodRequired = this.SearchRegisterForm.get('Blood').value;
        this.admissionsmodel.AnesthesiaFitnessRequiredDesc = this.SearchRegisterForm.get('anethsiadesc').value;
        this.admissionsmodel.BloodRequiredDesc = this.SearchRegisterForm.get('Blooddesc').value;
        this.admissionsmodel.InitialAdmissionStatus = this.SearchRegisterForm.get('IntialAdmissionStatus').value;
        this.admissionsmodel.InstructionToPatient = this.SearchRegisterForm.get('InstructionToPatient').value;
        this.admissionsmodel.AccompaniedBy = this.SearchRegisterForm.get('AccompaniedBY').value;
        this.admissionsmodel.WardAndBed = this.SearchRegisterForm.get('WardBeddetails').value;
        this.admissionsmodel.AdditionalInfo = this.SearchRegisterForm.get('EnterAdditionalInformation').value;

        //GetProvidersbyFacility(int facilityID)
        this.admissionService.addadmission(this.admissionsmodel).then(data => {
          this.util.showMessage('', 'Admission details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              const elem1 = data.AdmissionID;
              const PatientID = data.PatientID;
              this.router.navigate(['/home/admission/admissionpayment', elem1, PatientID]);
              this.dialogRef.close("Updated");

            }
          );
        })
      }
    }

    else {
      if (this.quickRegisterForm.valid) {

        this.newAdmissionModel.PatientID = 0;
        this.newPatientRegModel.FacilityId = this.quickRegisterForm.get('Facility').value;
        this.newPatientRegModel.Salutation = this.quickRegisterForm.get('Salutation').value;
        this.newPatientRegModel.PatientFirstName = this.quickRegisterForm.get('PatientFirstName').value;
        this.newPatientRegModel.PatientLastName = this.quickRegisterForm.get('PatientLastName').value;
        this.newPatientRegModel.Gender = this.quickRegisterForm.get('Gender').value;
        this.newPatientRegModel.PatientDOB = this.quickRegisterForm.get('PatientDOB').value;
        this.newPatientRegModel.PatientAge = this.quickRegisterForm.get('Age').value;
        this.newPatientRegModel.PrimaryContactNumber = this.quickRegisterForm.get('PrimaryContactNumber').value;
        this.newPatientRegModel.Emergencycontactnumber = this.quickRegisterForm.get('Emergencycontactnumber').value;
        this.newPatientRegModel.NKFirstname = this.quickRegisterForm.get('NKFirstname').value;
        this.newPatientRegModel.NKPrimarycontactnumber = this.quickRegisterForm.get('NKPrimarycontactnumber').value;

        this.admissionService.addUpdatePatientDetail(this.newPatientRegModel).then(res => {

          this.patId = res.PatientId;
          this.admissionsmodel.PatientID = this.patId;
          this.getDate = new Date(this.quickRegisterForm.get("AdmissionDate").value);
          if (this.quickRegisterForm.get("AdmissionDate").value != "") {
            if (this.quickRegisterForm.get("AdmissionTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
              if (parseInt(this.quickRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
                this.getTimeHH = 12;
              }
              else {
                this.getTimeHH = parseInt(this.quickRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
              }
            }
            else if (this.quickRegisterForm.get("AdmissionTime").value.toString().toLowerCase().split(' ')[1] == "am") {
              if (parseInt(this.quickRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
                this.getTimeHH = 0;
              }
              else {
                this.getTimeHH = parseInt(this.quickRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]);
              }
            }
            this.getTimeMin = parseInt(this.quickRegisterForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[1]);
            this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
          }
          this.getDateAndTime = this.getDate;
          this.admissionsmodel.ProcedureRequestId = 0;
          this.admissionsmodel.AdmissionDateTime = this.getDateAndTime;
          this.admissionsmodel.FacilityID = this.quickRegisterForm.get('Facility').value;
          this.admissionsmodel.AdmissionNo = this.admissionNumber;
          this.admissionsmodel.AdmissionOrigin = this.quickRegisterForm.get('generaladmission').value;
          this.admissionsmodel.AdmissionOrigin = this.quickRegisterForm.get('generaladmission').value;
          this.admissionsmodel.AdmissionType = this.quickRegisterForm.get('AdmissionType').value;
          this.admissionsmodel.PatientArrivalBy = this.quickRegisterForm.get('PatientArrivalBy').value;
          this.admissionsmodel.AdmittingPhysician = this.quickRegisterForm.get('physicianid').value;
          this.admissionsmodel.AdmittingReason = this.quickRegisterForm.get('AdmittingReason').value;
          this.admissionsmodel.PreProcedureDiagnosis = this.quickRegisterForm.get('preprocedureDiagnosis').value;
          this.admissionsmodel.ProcedureName = this.procedurenameproperty;
          this.admissionsmodel.ICDCode = this.quickRegisterForm.get('PrimaryICDCOde').value;
          this.admissionsmodel.ProcedureType = this.quickRegisterForm.get('ProcedureType').value;
          this.admissionsmodel.PlannedProcedure = this.quickRegisterForm.get('PlannedProcedure').value;
          this.admissionsmodel.CPTCode = this.quickRegisterForm.get('PrimaryCPTCode').value;
          this.admissionsmodel.UrgencyID = this.quickRegisterForm.get('Urgency').value;
          this.admissionsmodel.PatientArrivalCondition = this.quickRegisterForm.get('PatientArrivalCondition').value;
          this.admissionsmodel.PatientExpectedStay = this.quickRegisterForm.get('PatientExpectedStay').value;
          this.admissionsmodel.AnesthesiaFitnessRequired = this.quickRegisterForm.get('AnsthesiaFittnessRequired').value;
          this.admissionsmodel.BloodRequired = this.quickRegisterForm.get('Blood').value;
          this.admissionsmodel.AnesthesiaFitnessRequiredDesc = this.quickRegisterForm.get('anethsiadesc').value;
          this.admissionsmodel.BloodRequiredDesc = this.quickRegisterForm.get('Blooddesc').value;
          this.admissionsmodel.InitialAdmissionStatus = this.quickRegisterForm.get('IntialAdmissionStatus').value;
          this.admissionsmodel.InstructionToPatient = this.quickRegisterForm.get('InstructionToPatient').value;
          this.admissionsmodel.AccompaniedBy = this.quickRegisterForm.get('AccompaniedBY').value;
          this.admissionsmodel.WardAndBed = this.quickRegisterForm.get('WardBeddetails').value;
          this.admissionsmodel.AdditionalInfo = this.quickRegisterForm.get('EnterAdditionalInformation').value;
         // this.admissionsmodel.SpecialityID = this.quickRegisterForm.get('Specialities').value;

          this.admissionService.addadmission(this.admissionsmodel).then(data => {
            this.util.showMessage('', 'Admission details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
              (res) => {
                const elem = data.AdmissionID;
                const PatientID = data.PatientID;
                this.router.navigate(['/home/admission/admissionpayment', elem, PatientID]);
                this.dialogRef.close("Updated");
              }
            );
          })
        })
      }
    }
  }

}
