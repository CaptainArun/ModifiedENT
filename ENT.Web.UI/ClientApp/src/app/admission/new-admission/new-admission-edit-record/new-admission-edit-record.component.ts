import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdmissionService } from '../../admission.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { admission01Model } from '../../Models/admission01Model';
import { NewPatientRegModel } from '../../../patient/models/newPatientRegModel';
import { DatePipe } from '@angular/common';
import { NewPatientService } from '../../../patient/newPatient.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { admissionsmodel } from '../../../admission/Models/admissionsmodel';

@Component({
  selector: 'app-new-admission-edit-record',
  templateUrl: './new-admission-edit-record.component.html',
  styleUrls: ['./new-admission-edit-record.component.css']
})
export class NewAdmissionEditRecordComponent implements OnInit {
  newAdmissionEditForm: FormGroup;
  newAdmissionModel: admission01Model = new admission01Model();
  admissionsmodel: admissionsmodel = new admissionsmodel();
  newPatientRegModel: NewPatientRegModel = new NewPatientRegModel();
  visitDateTime: any;
  cptCode: any;
  specialitiesInfo: any = [];
  patientArraivalConditon: any[] = [];
  getDate: Date;
  getTimeHH: any;
  speciality: any;
  getTimeMin: any;
  getDateAndTime: any;
  patientArrivalBy: any;
  admissionType: any;
  UrgencyType: any;
  ProcedureType: any;
  admissionStatus: any;
  patientarrival: any;
  primaryicd: any;
  procedurenameproperty: any;
  admitingPhysician: any;
  procedurename: any;
  show: boolean = false;
  disable: boolean = false;
  admitingPhysicianSurgen: any;
  admissionNumber: any;
  patientById: any;
  patienId: any;
  anesthesiaFitnessRequired: any;
  bloodRequired: any;
  admissionorigin: any;
  demographicVal: any;
  patientName: any;
  PatientDOB: any;
  gender: any;
  cellNo: any;
  primarycpt: any;
  emergencyContact: any;
  identificationDetail: any;
  bloodGroup: any;
  diabetic: any;
  highBp: any;
  allergy: any;
  gait: any;
  addressdetail: any;
  addressdetailvalue: any;
  mrno: any;
  patientAge: any;
  kinName: any;
  kinContact: any;
  primaryICDcodetooltip: any;
  primaryCPTcodetooltip: any;
  searchfacilityName: any = "";
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) triggerphysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProcedure', { static: false, read: MatAutocompleteTrigger }) triggerprocedure: MatAutocompleteTrigger;
  @ViewChild('autoCompletecpt', { static: false, read: MatAutocompleteTrigger }) triggercpt: MatAutocompleteTrigger;

  constructor(public newPatientService: NewPatientService, public admissionServive: AdmissionService, public datePipe: DatePipe, public MatDialogRef: MatDialogRef<NewAdmissionEditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public CustHttp: CustomHttpService, public fb: FormBuilder, private util: UtilService) {
    this.visitDateTime = this.datePipe.transform(new Date, 'dd-MM-yyyy h:mm a');
  }

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.newAdmissionEditForm = this.fb.group(
      {
        AdmissionDate: ['', Validators.required],
        AdmissionTime: [''],
        VisitDate: [''],
        AdmissionNo: ['', Validators.required],
        generaladmission: [''],
        AdmissionType: ['', Validators.required],
        AdmitingPhysicianSurgeon: ['', Validators.required],
       // Specialities: [''],
        AdmittingReason: ['', Validators.required],
        preprocedureDiagnosis: [''],
        PrimaryICDCOde: [''],
        ProcedureType: ['', Validators.required],
        PlannedProcedure: [''],
        ProcedureName: ['', Validators.required],
        PrimaryCPTCode: ['', Validators.required],
        Urgency: ['', Validators.required],
        PatientArrivalCondition: ['', Validators.required],
        PatientArrivalBy: [0],
        PatientExpectedStay: ['', Validators.required],
        AnsthesiaFittnessRequiredcheck: ['', Validators.required],
        anethsiadesc: [''],
        Bloodcheck: ['', Validators.required],
        Blooddesc: [''],
        IntialAdmissionStatus: ['', Validators.required],
        InstructionToPatient: [''],
        AccompaniedBY: [''],
        WardBeddetails: [''],
        EnterAdditionalInformation: [''],
      });
    this.setFormValues();
    this.getSpecialities();
    this.getPatientArrivalConditions();
    this.getAdmissiontype();
    this.getpatientArrivalby();
    this.getPatientDetails();
    this.GetUrgencyTypes();
    this.getProcedureTypesforAdmissionn();
    this.getAdmissionStatusesforAdmission();
    this.getPatientarrival();
    this.ProceduresforAdmission();
    this.AdmitingPhysicianSurgeon();
    this.getAdmissionNumber();
    this.admitingPhysician = this.data.AdmittingPhysician;
    this.procedurenameproperty = this.data.ProcedureName;
    // this.newAdmissionEditForm.get('AdmissionNo').disable();
    this.anesthesiaFitnessRequired = this.data.AnesthesiaFitnessRequired;
    this.bloodRequired = this.data.BloodRequired;
    this.newAdmissionEditForm.get('generaladmission').disable();
    this.getSpeciality();
    this.primarycptcode();
    this.primaryicdname();
  }
  
  minDate = new Date(this.data.AdmissionDateTime);

  //set
  setFormValues() {
    this.searchfacilityName = this.data.FacilityName;
    this.newAdmissionEditForm.get('Bloodcheck').setValue(this.data.BloodRequired.toString());
    this.newAdmissionEditForm.get("AdmissionType").setValue(this.data.AdmissionType);
    this.newAdmissionEditForm.get("ProcedureType").setValue(this.data.ProcedureType);
    this.newAdmissionEditForm.get("PatientArrivalCondition").setValue(this.data.PatientArrivalCondition);
    this.newAdmissionEditForm.get("PatientArrivalBy").setValue(this.data.PatientArrivalBy);
    this.newAdmissionEditForm.get("IntialAdmissionStatus").setValue(this.data.InitialAdmissionStatus);
    this.newAdmissionEditForm.get("PatientArrivalCondition").setValue(this.data.PatientArrivalCondition);
    this.newAdmissionEditForm.get("ProcedureName").setValue(this.data.ProcedureName);
    this.newAdmissionEditForm.get('AdmissionDate').setValue(new Date(this.data.AdmissionDateTime));
    this.newAdmissionEditForm.get('AdmissionTime').setValue(new Date(this.data.AdmissionDateTime).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.newAdmissionEditForm.get('VisitDate').setValue(this.data.VisitDate);
    this.newAdmissionEditForm.get('AdmissionNo').setValue(this.data.AdmissionNo);
    this.newAdmissionEditForm.get('generaladmission').setValue(this.data.AdmissionOrigin);
    this.newAdmissionEditForm.get('AdmitingPhysicianSurgeon').setValue(this.data.ProviderName);
    this.newAdmissionEditForm.get('AdmittingReason').setValue(this.data.AdmittingReason);
    this.newAdmissionEditForm.get('preprocedureDiagnosis').setValue(this.data.PreProcedureDiagnosis);
    this.newAdmissionEditForm.get('PrimaryICDCOde').setValue(this.data.ICDCode);
    this.primaryICDcodetooltip = this.data.ICDCode;
    this.primaryCPTcodetooltip = this.data.CPTCode;
    this.newAdmissionEditForm.get('PlannedProcedure').setValue(this.data.PlannedProcedure);
    this.newAdmissionEditForm.get('ProcedureName').setValue(this.data.ProcedureDesc);
    this.newAdmissionEditForm.get('PrimaryCPTCode').setValue(this.data.CPTCode);
    this.newAdmissionEditForm.get('Urgency').setValue(this.data.UrgencyID);
    this.newAdmissionEditForm.get('PatientArrivalBy').setValue(this.data.PatientArrivalBy);
    this.newAdmissionEditForm.get('PatientExpectedStay').setValue(this.data.PatientExpectedStay);
    this.newAdmissionEditForm.get("AnsthesiaFittnessRequiredcheck").setValue(this.data.AnesthesiaFitnessRequired.toString());
    this.newAdmissionEditForm.get('anethsiadesc').setValue(this.data.AnesthesiaFitnessRequiredDesc);
    this.newAdmissionEditForm.get('Blooddesc').setValue(this.data.BloodRequiredDesc);
    this.newAdmissionEditForm.get('InstructionToPatient').setValue(this.data.InstructionToPatient);
    this.newAdmissionEditForm.get('AccompaniedBY').setValue(this.data.AccompaniedBy);
    this.newAdmissionEditForm.get('WardBeddetails').setValue(this.data.WardAndBed);
    this.newAdmissionEditForm.get('EnterAdditionalInformation').setValue(this.data.AdditionalInfo);
  //  this.newAdmissionEditForm.get('Specialities').setValue(this.data.SpecialityID);
  }
  //cancel
  CancelData() {

    this.newAdmissionEditForm.reset();
    this.setFormValues();
  }
  //submit
  UpdateFormdata() {
    if (this.newAdmissionEditForm.valid) {
      this.admissionsmodel.AdmissionID = this.data.AdmissionID;
      this.admissionsmodel.PatientID = this.data.PatientID;
      this.admissionsmodel.ProcedureRequestId = 0;
      this.sendDateWithTime();
      this.admissionsmodel.AdmissionDateTime = this.getDateAndTime;
      this.admissionsmodel.AdmissionNo = this.newAdmissionEditForm.get('AdmissionNo').value;
      this.admissionsmodel.AdmissionOrigin = this.newAdmissionEditForm.get('generaladmission').value;
      this.admissionsmodel.AdmissionType = this.newAdmissionEditForm.get('AdmissionType').value;
      this.admissionsmodel.PatientArrivalBy = this.newAdmissionEditForm.get('PatientArrivalBy').value;
      this.admissionsmodel.AdmittingPhysician = this.admitingPhysician;
      this.admissionsmodel.AdmittingReason = this.newAdmissionEditForm.get('AdmittingReason').value;
      this.admissionsmodel.PreProcedureDiagnosis = this.newAdmissionEditForm.get('preprocedureDiagnosis').value;
      this.admissionsmodel.ProcedureName = this.procedurenameproperty;
      this.admissionsmodel.ICDCode = this.newAdmissionEditForm.get('PrimaryICDCOde').value;
      this.admissionsmodel.ProcedureType = this.newAdmissionEditForm.get('ProcedureType').value;
      this.admissionsmodel.PlannedProcedure = this.newAdmissionEditForm.get('PlannedProcedure').value;
      this.admissionsmodel.CPTCode = this.newAdmissionEditForm.get('PrimaryCPTCode').value;
      this.admissionsmodel.UrgencyID = this.newAdmissionEditForm.get('Urgency').value;
      this.admissionsmodel.PatientArrivalCondition = this.newAdmissionEditForm.get('PatientArrivalCondition').value;
      this.admissionsmodel.PatientExpectedStay = this.newAdmissionEditForm.get('PatientExpectedStay').value;
     // this.admissionsmodel.SpecialityID = this.newAdmissionEditForm.get('Specialities').value;
      this.admissionsmodel.AnesthesiaFitnessRequired = this.anesthesiaFitnessRequired;
      this.admissionsmodel.BloodRequired = this.bloodRequired;
      this.admissionsmodel.AnesthesiaFitnessRequiredDesc = this.newAdmissionEditForm.get('anethsiadesc').value;
      this.admissionsmodel.BloodRequiredDesc = this.newAdmissionEditForm.get('Blooddesc').value;
      this.admissionsmodel.InitialAdmissionStatus = this.newAdmissionEditForm.get('IntialAdmissionStatus').value;
      this.admissionsmodel.InstructionToPatient = this.newAdmissionEditForm.get('InstructionToPatient').value;
      this.admissionsmodel.AccompaniedBy = this.newAdmissionEditForm.get('AccompaniedBY').value;
      this.admissionsmodel.WardAndBed = this.newAdmissionEditForm.get('WardBeddetails').value;
      this.admissionsmodel.FacilityID = this.data.FacilityID;
      this.admissionsmodel.AdditionalInfo = this.newAdmissionEditForm.get('EnterAdditionalInformation').value;

      this.admissionServive.addadmission(this.admissionsmodel).then(res => {
        this.util.showMessage('', 'Admission details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            if (res) {
              this.MatDialogRef.close("Updated");
            }
          });
      })
    }
  }
  //speciality
  getSpecialities() {

    this.admissionServive.GetSpecialities().then(res => {
      for (let i = 0; i < res.length; i++) {
        this.specialitiesInfo[i] = res[i].SpecialityDescription;
      }
    })
  }
  //PrimaryICDCOde
  primaryicdname() {
    if (this.newAdmissionEditForm.get('PrimaryICDCOde').value != null) {
      this.newAdmissionEditForm.get('PrimaryICDCOde').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.GetIcd(key).then(data => {
                var a = [];
                key = key.toLowerCase();
                for (let i of data) {
                  if (
                    i.ICDCode.toLowerCase().includes(key) || i.Description.toLowerCase().includes(key)) {
                    a.push(i);
                  }

                }

                this.primaryicd = a;
              })
            }
            else {
              this.primaryicd = null;
              this.primaryICDcodetooltip = null;
            }
          }
        })
    }
  }
  setPrimaryIcdCode(value1, value2) {
    this.primaryICDcodetooltip = value1 + " " + value2;
  }
  setPrimaryCptCode(value1, value2) {
    this.primaryCPTcodetooltip = value1 + " " + value2;
  }
  //PrimaryCPTCode
  primarycptcode() {
    if (this.newAdmissionEditForm.get('PrimaryCPTCode').value != null) {
      this.newAdmissionEditForm.get('PrimaryCPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.Gettreatment(key).then(data => {
                var a = [];
                key = key.toLowerCase();
                for (let i of data) {
                  if (i.CPTCode.toLowerCase().includes(key) || i.Description.toLowerCase().includes(key)) {
                    a.push(i);
                  }

                }

                this.primarycpt = a;
              })
            }
            else {
              this.primarycpt = null;
              this.primaryCPTcodetooltip = null;
            }
          }
        })
    }
  }
  //patient detail
  getPatientDetails() {
    this.newPatientService.getPatientDemographic(this.data.PatientID).then(res => {
      this.demographicVal = res;
      this.patientName = this.demographicVal.PatientFullName;
      this.PatientDOB = this.demographicVal.PatientDOB;
      this.patientAge = this.demographicVal.PatientAge;
      this.gender = this.demographicVal.Gender;
      this.cellNo = this.demographicVal.PrimaryContactNumber;
      this.emergencyContact = this.demographicVal.Emergencycontactnumber;
      this.identificationDetail = this.demographicVal.PatientIdentificationtype1details;
      this.bloodGroup = this.demographicVal.Bloodgroup;
      this.diabetic = this.demographicVal.Diabetic;
      this.highBp = this.demographicVal.HighBP;
      this.allergy = this.demographicVal.Allergies;
      this.gait = this.demographicVal.Gait;
      this.addressdetail = this.demographicVal.Address1;
      this.addressdetailvalue = this.demographicVal.Address2;
      this.mrno = this.demographicVal.MRNo;
      this.kinName = this.demographicVal.NKFirstname;
      this.kinContact = this.demographicVal.NKPrimarycontactnumber;
    })
  }
  //AdmitingPhysicianSurgeon
  AdmitingPhysicianSurgeon() {
    if (this.newAdmissionEditForm.get('AdmitingPhysicianSurgeon').value != null) {
      this.newAdmissionEditForm.get('AdmitingPhysicianSurgeon').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.GetOrderingphysician(key).then(data => {
                this.admitingPhysicianSurgen = data;
              })
            }
            else {
              this.admitingPhysicianSurgen = null;
            }
          }
        })
    }
  }
  //PatientArrivalConditions
  getPatientArrivalConditions() {

    this.admissionServive.GetPatientArrivalConditions().then(res => {
      for (let i = 0; i < res.length; i++) {
        this.patientArraivalConditon[i] = res[i].PatientArrivalconditionDescription;
      }
    })
  }
  //bloodcheck
  setprocedurename(number) {
    this.procedurenameproperty = number;
  }
  setBloodRequired() {
    if (this.newAdmissionEditForm.get("Bloodcheck").value == "true") {
      this.bloodRequired = true;

    }
    else {
      this.bloodRequired = false;
    }
  }
  //generaladmission
  setoriginRequired() {
    if (this.newAdmissionEditForm.get("generaladmission").value == "General") {
      this.admissionorigin = "General"

    }
    else {
      this.admissionorigin = "Emergency"
    }
  }
  //AnsthesiaFittnessRequiredcheck
  setAnsthesiaFittnessRequired() {
    if (this.newAdmissionEditForm.get("AnsthesiaFittnessRequiredcheck").value == "true") {
      this.anesthesiaFitnessRequired = true;

    } else {
      this.anesthesiaFitnessRequired = false;

    }
  }
  //speciality
  getSpeciality() {
    this.admissionServive.Getspecialities().then(res => {
      this.speciality = res;
    })
  }
  //Admission no
  getAdmissionNumber() {
    this.admissionServive.getAdmissionNumber().then(res => {
      this.admissionNumber = res[0];
    })
  }
  //physician name
  setprocedurephysician(number) {
    this.admitingPhysician = number;
  }
  //ProcedureName
  ProceduresforAdmission() {
    if (this.newAdmissionEditForm.get('ProcedureName').value != null) {
      this.newAdmissionEditForm.get('ProcedureName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionServive.GetProceduresforAdmission(key).then(data => {
                var a = [];
                key = key.toLowerCase();
                for (let i of data) {
                  if (i.ProcedureDesc.toLowerCase().includes(key)) {
                    a.push(i);
                  }

                }

                this.procedurename = a;

              })
            }
            else {
              this.procedurename = null;
            }
          }
        })
    }
  }
  //get
  getProcedureTypesforAdmissionn() {
    this.admissionServive.GetProcedureTypesforAdmission().then(res => {
      this.ProcedureType = res;
    })

  }
  //AdmissionStatus
  getAdmissionStatusesforAdmission() {
    this.admissionServive.GetAdmissionStatusesforAdmission().then(res => {
      this.admissionStatus = res;
    })

  }
  //patientArrivalBy
  getpatientArrivalby() {
    this.admissionServive.getPatientArrivalBy().then(res => {
      this.patientArrivalBy = res;
    })
  }
  //UrgencyType
  GetUrgencyTypes() {
    this.admissionServive.GetUrgencyTypes().then(res => {
      this.UrgencyType = res;
    })

  }
  //admissionType
  getAdmissiontype() {
    this.admissionServive.getAdmissionType().then(res => {
      this.admissionType = res;
    })
  }
  //PatientId
  getPatientId(id: number) {
    this.patienId = id;
    this.newPatientService.getPatientDetailsById(id).then(data => {
      if (data != undefined) {
        this.patientById = data;
        this.show = true;
        this.disable = true;
      }
    });
  }
  //patientarrival
  getPatientarrival() {
    this.admissionServive.GetPatientarrival().then(res => {
      this.patientarrival = res;
    })
  }
  //AdmissionDate
  sendDateWithTime() {

    this.getDate = new Date(this.newAdmissionEditForm.get("AdmissionDate").value);

    if (this.newAdmissionEditForm.get("AdmissionDate").value != "") {
      if (this.newAdmissionEditForm.get("AdmissionTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.newAdmissionEditForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.newAdmissionEditForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.newAdmissionEditForm.get("AdmissionTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.newAdmissionEditForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.newAdmissionEditForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.newAdmissionEditForm.get("AdmissionTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate
  }
  //close
  dialogClose(): void {
    this.MatDialogRef.close();
  }

  tovalidatePhysicianSearch() {
    this.triggerphysician.panelClosingActions.subscribe(physician => {
      if (!(physician && physician.source)) {
        this.newAdmissionEditForm.get('AdmitingPhysicianSurgeon').setValue('');
      }
    });
  }

  tovalidateProcedure() {
    this.triggerprocedure.panelClosingActions.subscribe(procedure => {
      if (!(procedure && procedure.source)) {
        this.newAdmissionEditForm.get('ProcedureName').setValue('');
      }
    });
  }

  tovalidateCpt() {
    this.triggercpt.panelClosingActions.subscribe(cpt => {
      if (!(cpt && cpt.source)) {
        this.newAdmissionEditForm.get('PrimaryCPTCode').setValue('');
      }
    });
  }
}
