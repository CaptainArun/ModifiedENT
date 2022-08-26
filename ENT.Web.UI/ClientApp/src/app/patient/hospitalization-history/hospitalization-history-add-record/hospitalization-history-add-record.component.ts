import { AfterViewInit, Component, Inject, OnInit, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewPatientService } from '../../newPatient.service';
import { hospitalizationHistoryModel } from '../../models/hospitalizationHistoryModel';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hospitalization-history-add-record',
  templateUrl: './hospitalization-history-add-record.component.html',
  styleUrls: ['./hospitalization-history-add-record.component.css']
})
export class HospitalizationHistoryAddRecordComponent implements OnInit ,AfterViewInit{

  hospitalHistoryAddForm: FormGroup;
  hospitalHistoryModel: hospitalizationHistoryModel = new hospitalizationHistoryModel;
  IcdCodeInfo: any[];
  patientID: number;
  recordedduring: string = '';
  visitID: number;
  facilityId: number;
  recordedBy: any[] = [];
  visitDateTime: any[] = [];
  cptCode: string;
  dischargeStatusCode: string;
  getDate: Date;
  getTimeHH: number;
  getTimeMin: number;
  getDateAndTime: any;
  AdmissionTypelist: any;
  AdmissionStatuslist: any;
  ProcedureTypes: any;
  ProblemStatuses: any;
  filteredOptions: any;
  icdtooltip: any;
  cpttooltip: any;
  dischargestatusooltip: any;
  UploadFile: any[];
  fileNameDemo: any;
  filesizeDemo: any;
  FileUpload: Array<File> = [];
  ViewFileUpload: Array<clsViewFile> = [];
  FileUploadNames: any[] = [];
  @ViewChild('multiple', { static: true }) attachment: any;
  @ViewChild('autoCompleteCPTInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICD10Input', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;
  @ViewChild('autoCompletePhysician', { static: false, read: MatAutocompleteTrigger }) trigger3: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDischarge', { static: false, read: MatAutocompleteTrigger }) trigger4: MatAutocompleteTrigger;



  constructor(public newPatientService: NewPatientService, public custHttp: CustomHttpService, public fb: FormBuilder, private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<HospitalizationHistoryAddRecordComponent>, private util: UtilService, @Inject(MAT_DIALOG_DATA) public data1: any) {
  }
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.hospitalHistoryAddForm = this.fb.group(
      {
        RecordedDate: [new Date(), Validators.required],
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
        RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
        VisitDateandTime: [''],
        RecordedDuring: [''],
        FacilityName: ['']
      });
    this.patientID = this.data1;
    this.getVisitDateAndTime();
    this.getProviderName();
    this.getICDCode();
    this.getCPTCode();
    this.getDischargeStatusCode();
    this.getAdmissionType();
    this.getAdmissionStatuslist();
    this.getGetProcedureTypes();
    this.getGetProblemStatus();
    this.getAdmittingPhysicianList();
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


  ngAfterViewInit() {

    this.trigger1.panelClosingActions
    .subscribe(e => {
      if (!(e && e.source)) {
        this.hospitalHistoryAddForm.get('CPTCode').setValue('');
        }
    });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.hospitalHistoryAddForm.get('ICDCode').setValue('');
        }
      });


      this.trigger3.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.hospitalHistoryAddForm.get('AdmittingPhysician').setValue('');
        }
      });


      this.trigger4.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.hospitalHistoryAddForm.get('DischargeStatusCode').setValue('');
        }
      });
  }


  //ProblemStatuses
  getGetProblemStatus() {
    this.newPatientService.GetProblemStatuses().then(res => {
      this.ProblemStatuses = res;
    });
  }


  //visit date and time
  getVisitDateAndTime() {
    this.newPatientService.GetVisitsForPatient(this.patientID).then(res => {
      for (let i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
      }

    });
  }
  //get
  getProviderName() {
    this.newPatientService.GetProviderNames(this.facilityId).then(res => {
      this.recordedBy = res;
    })
  }

  //ICD code
  getICDCode() {
    this.hospitalHistoryAddForm.get('ICDCode').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.newPatientService.GetICDCodesbySearch(key).then(data => {
            this.IcdCodeInfo = data;
          })
        } else {
          this.IcdCodeInfo = null;
          this.icdtooltip = null;
        }

      }
    })
  }
  //Cpt code
  getCPTCode() {
    this.hospitalHistoryAddForm.get('CPTCode').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.newPatientService.GetCPTCodesbySearch(key).then(data => {
            this.cptCode = data;            
          });
        } else {
          this.cptCode = null;
          this.cpttooltip = null;
        }
      }
    })
  }

  //DischargeStatusCode
  getDischargeStatusCode() {
    this.hospitalHistoryAddForm.get('DischargeStatusCode').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.newPatientService.GetDischargeCodesbySearch(key).then(data => {
            this.dischargeStatusCode = data;
          });
        }
        else {
          this.dischargeStatusCode = null;
        }
      }
    })
  }
  //record during
  autoRecordedDuring(i: any) {

    this.newPatientService.GetVisitsForPatient(this.patientID).then(res => {
      for (let x = 0; x < res.length; x++) {
        if (x == i) {

          this.recordedduring = res[i].recordedDuring;
          this.visitID = res[x].VisitId;
          this.hospitalHistoryAddForm.get('RecordedDuring').setValue(this.recordedduring);
        }
      }
    });
  }

  getAdmittingPhysicianList() {
    this.hospitalHistoryAddForm.get('AdmittingPhysician').valueChanges.subscribe(
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
    this.getDate = new Date(this.hospitalHistoryAddForm.get("RecordedDate").value);
    if (this.hospitalHistoryAddForm.get("RecordedDate").value != "") {
      if (this.hospitalHistoryAddForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.hospitalHistoryAddForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.hospitalHistoryAddForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.hospitalHistoryAddForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.hospitalHistoryAddForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.hospitalHistoryAddForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.hospitalHistoryAddForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  //#region "setIcdCode"
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }
  //#endregion

  //#region "setCptCode"
  setCptCode(value1, value2) {
    this.cpttooltip = value1 + ' ' + value2 ;
  }
  //#endregion

  setdischargeCode(value1, value2) {
    this.dischargestatusooltip = value1 + " " + value2;
  }

  public FileUploadFunction(file: any): void {
    let files = file.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUpload.push(Temporaryfiles);
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
        }
        else {
          this.ViewFileUpload.push(viewFile);
          this.FileUploadNames.push(lowerCaseFilename); //file name storing...
        }
      }
      this.attachment.nativeElement.value = '';
    }
  }

  //submit
  addHospitalHistoryRecord() {
    if (this.hospitalHistoryAddForm.valid && (this.FileUpload != null || this.FileUpload != undefined)) {
      this.sendDateWithTime();
      this.hospitalHistoryModel.VisitDateandTime = this.hospitalHistoryAddForm.get('VisitDateandTime').value;
      this.hospitalHistoryModel.VisitID = this.visitID;
      this.hospitalHistoryModel.RecordedDuring = this.hospitalHistoryAddForm.get('RecordedDuring').value;
      this.hospitalHistoryModel.RecordedDate = this.getDateAndTime;
      this.hospitalHistoryModel.RecordedBy = this.hospitalHistoryAddForm.get('RecordedBy').value;
      this.hospitalHistoryModel.ProcedureType = this.hospitalHistoryAddForm.get('ProcedureType').value;
      this.hospitalHistoryModel.ProblemStatus = this.hospitalHistoryAddForm.get('ProblemStatus').value;
      this.hospitalHistoryModel.PrimaryProcedure = this.hospitalHistoryAddForm.get('PrimaryProcedure').value;
      this.hospitalHistoryModel.PrimaryDiagnosis = this.hospitalHistoryAddForm.get('PrimaryDiagnosis').value;
      this.hospitalHistoryModel.InitialAdmissionStatus = this.hospitalHistoryAddForm.get('InitialAdmissionStatus').value;
      this.hospitalHistoryModel.ICDCode = this.hospitalHistoryAddForm.get('ICDCode').value;
      this.hospitalHistoryModel.HospitalizationID = 0;
      this.hospitalHistoryModel.DischargeStatusCode = this.hospitalHistoryAddForm.get('DischargeStatusCode').value;
      this.hospitalHistoryModel.DischargeDate = this.hospitalHistoryAddForm.get('DischargeDate').value;
      this.hospitalHistoryModel.CPTCode = this.hospitalHistoryAddForm.get('CPTCode').value;
      this.hospitalHistoryModel.ChiefComplaint = this.hospitalHistoryAddForm.get('ChiefComplaint').value;
      this.hospitalHistoryModel.AttendingPhysician = this.hospitalHistoryAddForm.get('AttendingPhysician').value;
      this.hospitalHistoryModel.AdmittingPhysician = this.hospitalHistoryAddForm.get('AdmittingPhysician').value;
      this.hospitalHistoryModel.AdmissionType = this.hospitalHistoryAddForm.get('AdmissionType').value;
      this.hospitalHistoryModel.AdmissionDate = this.hospitalHistoryAddForm.get('AdmissionDate').value;
      this.hospitalHistoryModel.AdditionalNotes = this.hospitalHistoryAddForm.get('AdditionalNotes').value;
      this.hospitalHistoryModel.FacilityName = this.hospitalHistoryAddForm.get('FacilityName').value;

      this.newPatientService.AddUpdateHospitalizationHistory(this.hospitalHistoryModel).then((res) => {
        if (res.HospitalizationID) {

          const formData = new FormData();

          this.FileUpload.forEach(file => {
            formData.append('file', file, file.name);
          });

          this.newPatientService.FileUploadMultiple(formData, res.HospitalizationID, "Patient/HospitalizationHistory").then((res) => {

            if (!res[0].includes('Error')) {

              this.util.showMessage('', 'Hospitalization details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => {
                  if (res === true) {
                    this.dialogRef.close("Updated");
                  }
                }
              );
            } else {
              this.util.showMessage("Error!!", res, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((_res) => { });
            }
          })
        }

      })
    }
  }

  public RemoveFile(index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNames.splice(index, 1);    //Delete fileName for duplicate FileList
        this.FileUpload.splice(index, 1);         //Delete file from original FileList
        this.ViewFileUpload.splice(index, 1);     //Delete the item of clsViewFile fileNames list
      }
    });

  }

  //reset
  restFormData() {
    this.hospitalHistoryAddForm.reset();
    this.hospitalHistoryAddForm.get('RecordedDate').setValue(new Date());
    this.hospitalHistoryAddForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.ViewFileUpload = [];
    this.FileUploadNames = [];
    this.FileUpload = [];
    this.recordedduring = "";
  }


  dialogClose(): void {
    this.dialogRef.close();
  }

}

