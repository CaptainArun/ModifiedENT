import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { hospitalizationHistoryModel } from '../../models/hospitalizationHistoryModel';
import { NewPatientService } from '../../newPatient.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { AppConfigService } from 'src/app/app.config.service';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hospitalization-history-edit-record',
  templateUrl: './hospitalization-history-edit-record.component.html',
  styleUrls: ['./hospitalization-history-edit-record.component.css']
})
export class HospitalizationHistoryEditRecordComponent implements OnInit,AfterViewInit {
  hospitalHistoryEditForm: FormGroup;
  hospitalHistoryModel: hospitalizationHistoryModel = new hospitalizationHistoryModel;
  visitDateTime: any[] = [];
  patientId: any;
  visitID: any;
  facilityId: number;
  recordedBy: any;
  IcdCodeInfo: any;
  cptCode: any;
  dischargeStatusCode: any;
  recordedduring: any;
  getDate: Date;
  getTimeHH: number;
  getTimeMin: number;
  getDateAndTime: any;
  AdmissionTypelist: any;
  AdmissionStatuslist: any;
  ProcedureTypes: any;
  ProblemStatuses: any;
  filteredOptions: any;
  cpttooltip: any;
  icdtooltip: any;
  dischargetooltip: any;
  multipleFileUpload: Array<File> = [];
  requiredViewFile: Array<clsViewFile> = [];
  FileUploadNames: any[] = [];
  @ViewChild('multiple', { static: true }) attachment: any;
  @ViewChild('autoCompleteCPTInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) trigger3: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDischarge', { static: false, read: MatAutocompleteTrigger }) trigger4: MatAutocompleteTrigger;

  constructor(public newPatientService: NewPatientService, private appConfig: AppConfigService, private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<HospitalizationHistoryEditRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public newPatientservice: NewPatientService, public custHttp: CustomHttpService, public fb: FormBuilder, private util: UtilService) { }
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.hospitalHistoryEditForm = this.fb.group(
      {
        RecordedDate: ['', Validators.required],
        RecordedBy: ['', Validators.required],
        AdmissionDate: ['', Validators.required],
        AdmissionType: ['', Validators.required],
        InitialAdmissionStatus: [''],
        AdmittingPhysician: ['', Validators.required],
        AttendingPhysician: [''],
        ChiefComplaint: ['', Validators.required],
        PrimaryDiagnosis: [''],
        ICDCode: [''],
        ProcedureType: ['', Validators.required],
        PrimaryProcedure: [''],
        CPTCode: [''],
        ProblemStatus: ['', Validators.required],
        DischargeDate: ['', Validators.required],
        DischargeStatusCode: [''],
        AdditionalNotes: [''],
        RecordedTime: ['', Validators.required],
        VisitDateandTime: [''],
        RecordedDuring: [''],
        FacilityName: ['']
      })

    this.setFormValues();
    // this.getVisitDateAndTime();
    this.getProviderName();
    this.getICDCode();
    this.getCPTCode();
    this.getDischargeStatusCode();
    this.getAdmissionType();
    this.getAdmissionStatuslist();
    this.getGetProcedureTypes();
    this.getGetProblemStatus();
    this.getAdmittingPhysicianList();
    this.hospitalHistoryEditForm.get('VisitDateandTime').disable();
    this.hospitalHistoryEditForm.get('RecordedDuring').disable();
  }
  //Admission Type
  getAdmissionType() {
    this.newPatientService.GetAdmissionType().then(res => {
      this.AdmissionTypelist = res;
    });
  }

  //Admission status
  getAdmissionStatuslist() {
    this.newPatientService.GetAdmissionStatus().then(res => {
      this.AdmissionStatuslist = res;
    });
  }


  //ProcedureTypes

  getGetProcedureTypes() {
    this.newPatientService.GetProcedureTypes().then(res => {
      this.ProcedureTypes = res;
    });
  }


  //ProblemStatuses
  getGetProblemStatus() {
    this.newPatientService.GetProblemStatuses().then(res => {
      this.ProblemStatuses = res;
    });
  }

  ngAfterViewInit() {

    this.trigger1.panelClosingActions
    .subscribe(e => {
      if (!(e && e.source)) {
        this.hospitalHistoryEditForm.get('CPTCode').setValue('');
        }
    });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.hospitalHistoryEditForm.get('ICDCode').setValue('');
        }
      });

      this.trigger3.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.hospitalHistoryEditForm.get('AdmittingPhysician').setValue('');
        }
      });


      this.trigger4.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.hospitalHistoryEditForm.get('DischargeStatusCode').setValue('');
        }
      });
  }


  getAdmittingPhysicianList() {

    this.hospitalHistoryEditForm.get('AdmittingPhysician').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.newPatientService.getAllAdmittingPhysicianData(key).then(data => {
              this.filteredOptions = data;
            });
          }
          else {
            this.filteredOptions = null;
          }
        }
      });
  }

  // date and time
  sendDateWithTime() {
    this.getDate = new Date(this.hospitalHistoryEditForm.get("RecordedDate").value);
    if (this.hospitalHistoryEditForm.get("RecordedDate").value != "") {
      if (this.hospitalHistoryEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.hospitalHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.hospitalHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.hospitalHistoryEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.hospitalHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.hospitalHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.hospitalHistoryEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  //set data
  setFormValues() {
    if (this.data.filePath.length > 0) {
      this.setFileData(this.data.filePath)
    }
    this.hospitalHistoryEditForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.hospitalHistoryEditForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.hospitalHistoryEditForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.hospitalHistoryEditForm.get('RecordedDuring').setValue(this.data.recordedDuring);
    this.hospitalHistoryEditForm.get('AdmissionDate').setValue(this.data.AdmissionDate);
    this.hospitalHistoryEditForm.get('AdmissionType').setValue(this.data.AdmissionType);
    this.hospitalHistoryEditForm.get('InitialAdmissionStatus').setValue(this.data.InitialAdmissionStatus);
    this.hospitalHistoryEditForm.get('AdmittingPhysician').setValue(this.data.AdmittingPhysician);
    this.hospitalHistoryEditForm.get('AttendingPhysician').setValue(this.data.AttendingPhysician);
    this.hospitalHistoryEditForm.get('ChiefComplaint').setValue(this.data.ChiefComplaint);
    this.hospitalHistoryEditForm.get('PrimaryDiagnosis').setValue(this.data.PrimaryDiagnosis);
    this.hospitalHistoryEditForm.get('ICDCode').setValue(this.data.ICDCode);
    this.hospitalHistoryEditForm.get('ProcedureType').setValue(this.data.ProcedureType);
    this.hospitalHistoryEditForm.get('PrimaryProcedure').setValue(this.data.PrimaryProcedure);
    this.hospitalHistoryEditForm.get('CPTCode').setValue(this.data.CPTCode);
    this.hospitalHistoryEditForm.get('ProblemStatus').setValue(this.data.ProblemStatus);
    this.hospitalHistoryEditForm.get('DischargeDate').setValue(this.data.DischargeDate);
    this.hospitalHistoryEditForm.get('DischargeStatusCode').setValue(this.data.DischargeStatusCode);
    this.hospitalHistoryEditForm.get('AdditionalNotes').setValue(this.data.AdditionalNotes);
    this.hospitalHistoryEditForm.get('VisitDateandTime').setValue(this.data.visitDateandTime);
    this.hospitalHistoryEditForm.get('FacilityName').setValue(this.data.FacilityName);
    this.icdtooltip = this.data.ICDCode;
    this.cpttooltip = this.data.CPTCode;
    this.dischargetooltip = this.data.DischargeStatusCode;
  }

  setFileData(Filedata:any) {
    for (let i = 0; i < Filedata.length; i++) {
      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Filedata[i].FileName;
      let lowerCaseFilename = (viewFile.FileName).toLowerCase();
      viewFile.Size = Filedata[i].FileSize;
      viewFile.FileUrl = Filedata[i].FileUrl
      viewFile.ActualFile = Filedata[i].ActualFile; //Actual file is base64 ...
      const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
      let alpha = new Blob([byteArray], { type: Filedata[i].FileType });
      let fileUrl = URL.createObjectURL(alpha);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;
      this.FileUploadNames.push(lowerCaseFilename); //file name storing...
      this.requiredViewFile.push(viewFile);
    }
  }

  //#region "setCptCode"
  setCptCode(value1, value2) {
    this.cpttooltip =value1 + ' ' + value2;
  }
  //#endregion


  //record by
  getProviderName() {
    this.newPatientservice.GetProviderNames(this.facilityId).then(res => {
      this.recordedBy = res;
    })
  }
  //RecordedDuring
  autoRecordedDuring(data: any) {
    this.newPatientservice.GetVisitsForPatient(this.patientId).then(res => {
      for (let x = 0; x < res.length; x++) {
        if (x == data) {
          this.hospitalHistoryEditForm.get('RecordedDuring').setValue(res[x].recordedDuring);
          this.visitID = res[x].VisitId;
        }
      }
    });
  }
  //ICDCode

  getICDCode() {
    this.hospitalHistoryEditForm.get('ICDCode').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.newPatientservice.GetICDCodesbySearch(key).then(data => {
              this.IcdCodeInfo = data;
            })
          } else {
            this.IcdCodeInfo = null;
            this.icdtooltip = null;
          }
        }
      })
  }

  //CPTCode
  getCPTCode() {
    this.hospitalHistoryEditForm.get('CPTCode').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.newPatientservice.GetCPTCodesbySearch(key).then(data => {
              this.cptCode = data;
            })
          } else {
            this.cptCode = null;
            this.cpttooltip = null;
          }
        }
        else {
          this.cptCode = null;
          this.cpttooltip = null;
        }
      })
  }
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }

  setcptCode(value1, value2) {
    this.cpttooltip = value1 + " " + value2;
  }

  setdischargeCode(value1, value2) {
    this.dischargetooltip = value1 + " " + value2;
  }

  //DischargeStatusCode
  getDischargeStatusCode() {
    this.hospitalHistoryEditForm.get('DischargeStatusCode').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 1) {
            this.newPatientservice.GetDischargeCodesbySearch(key).then(data => {
              this.dischargeStatusCode = data;
            })
          } else {
            this.dischargeStatusCode = null;
            this.dischargetooltip = null;
          }
        }
      })
  }

  uploadMultiple(file) {
    let files = file.target.files
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.multipleFileUpload.push(Temporaryfiles);
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Temporaryfiles.name;
        let lowerCaseFilename = (viewFile.FileName).toLowerCase();
        viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
        let fileUrl = URL.createObjectURL(Temporaryfiles);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        let ConfrimFile = (this.FileUploadNames.length > 0) ? this.FileUploadNames.includes(lowerCaseFilename) : false;
        if (ConfrimFile) {
          this.util.showMessage("", "File Already Exist " + Temporaryfiles.name, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
          });
        } else {
          this.requiredViewFile.push(viewFile);
          this.FileUploadNames.push(lowerCaseFilename);
        }
      }
      this.attachment.nativeElement.value = '';
    }
  }

  RemoveFile(fileName: string, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.requiredViewFile.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];

            let deletePath = (property.FileUrl.split(a)[0]);
            this.newPatientService.DeleteFile(deletePath, fileName).then(res => { })
          }
        });
        this.FileUploadNames.splice(index, 1);
        this.multipleFileUpload.splice(index, 1);
        this.requiredViewFile.splice(index, 1);
      }
    });
  }

  //Submit
  updateFormdata() {
    if(this.hospitalHistoryEditForm.valid){
      this.hospitalHistoryModel.HospitalizationID = this.data.HospitalizationID;
      this.hospitalHistoryModel.VisitID = this.data.VisitID;
      this.sendDateWithTime();
      this.hospitalHistoryModel.RecordedDate = this.getDateAndTime;
      this.hospitalHistoryModel.RecordedBy = this.hospitalHistoryEditForm.get('RecordedBy').value;
     // this.hospitalHistoryModel.RecordedTime = this.hospitalHistoryEditForm.get('RecordedTime').value;
      this.hospitalHistoryModel.RecordedDuring = this.hospitalHistoryEditForm.get('RecordedDuring').value;
      this.hospitalHistoryModel.AdmissionDate = this.hospitalHistoryEditForm.get('AdmissionDate').value;
      this.hospitalHistoryModel.AdmissionType = this.hospitalHistoryEditForm.get('AdmissionType').value;
      this.hospitalHistoryModel.InitialAdmissionStatus = this.hospitalHistoryEditForm.get('InitialAdmissionStatus').value;
      this.hospitalHistoryModel.AdmittingPhysician = this.hospitalHistoryEditForm.get('AdmittingPhysician').value;
      this.hospitalHistoryModel.AttendingPhysician = this.hospitalHistoryEditForm.get('AttendingPhysician').value;
      this.hospitalHistoryModel.ChiefComplaint = this.hospitalHistoryEditForm.get('ChiefComplaint').value;
      this.hospitalHistoryModel.PrimaryDiagnosis = this.hospitalHistoryEditForm.get('PrimaryDiagnosis').value;
      this.hospitalHistoryModel.ICDCode = this.hospitalHistoryEditForm.get('ICDCode').value;
      this.hospitalHistoryModel.ProcedureType = this.hospitalHistoryEditForm.get('ProcedureType').value;
      this.hospitalHistoryModel.PrimaryProcedure = this.hospitalHistoryEditForm.get('PrimaryProcedure').value;
      this.hospitalHistoryModel.CPTCode = this.hospitalHistoryEditForm.get('CPTCode').value;
      this.hospitalHistoryModel.ProblemStatus = this.hospitalHistoryEditForm.get('ProblemStatus').value;
      this.hospitalHistoryModel.DischargeDate = this.hospitalHistoryEditForm.get('DischargeDate').value;
      this.hospitalHistoryModel.DischargeStatusCode = this.hospitalHistoryEditForm.get('DischargeStatusCode').value;
      this.hospitalHistoryModel.AdditionalNotes = this.hospitalHistoryEditForm.get('AdditionalNotes').value;
      this.hospitalHistoryModel.VisitDateandTime = this.hospitalHistoryEditForm.get('VisitDateandTime').value;
      this.hospitalHistoryModel.FacilityName = this.hospitalHistoryEditForm.get('FacilityName').value;
      this.newPatientservice.AddUpdateHospitalizationHistory(this.hospitalHistoryModel).then((data) => {
        const formData = new FormData();
  
        this.multipleFileUpload.forEach(file => {
          formData.append('file', file, file.name);
        });
        this.newPatientService.FileUploadMultiple(formData, data.HospitalizationID, "Patient/HospitalizationHistory").then((res) => {
          this.util.showMessage('', 'Hospitalization details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            if (res === true) {
              this.dialogRef.close("Updated");
            }
          });
        });
      });
    }
  }

  //close
  dialogClose() {
    this.dialogRef.close();
  }

  clear() {
    this.FileUploadNames = [];
    this.requiredViewFile = [];
    this.multipleFileUpload = [];
    this.setFormValues();
  }

}
