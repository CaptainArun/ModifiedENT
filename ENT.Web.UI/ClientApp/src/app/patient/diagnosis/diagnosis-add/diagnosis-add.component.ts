import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DiagnosisModel } from '../../../triage/models/diagnosisModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TriageService } from '../../../triage/triage.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-diagnosis-add',
  templateUrl: './diagnosis-add.component.html',
  styleUrls: ['./diagnosis-add.component.css']
})

export class DiagnosisAddComponent implements OnInit, AfterViewInit {
  diagnosisForm: FormGroup;
  diagnosisModel: DiagnosisModel = new DiagnosisModel();
  icd: any;
  facilityId: number = 0;
  recordby: any;
  visitDandt: any[] = [];
  recordedDuring: any = '';
  visitID: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  problemAreavalues: any;
  symptoms: any;
  requestedProcedures: any;
  problemTypes: any;
  problemStatus: any;
  painScale: any;
  imgList: Array<File> = [];
  listOfImgFiles: Array<clsViewFile> = [];
  fileName: any[] = [];
  problemAreaTooltip: any[] = [];
  proArea: any;
  symptomsTooltip: any[] = [];
  sympt: any;
  problemTypeTooltip: any[] = [];
  proType: any;
  icdTooltip: any;
  time: string;

  @ViewChild('image', {static: true}) image: ElementRef;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;

  constructor(public fb: FormBuilder, public newpatsvc: NewPatientService, public triageSvc: TriageService, public custHttp: CustomHttpService, public DialogRef: MatDialogRef<DiagnosisAddComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.diagnosisForm = this.fb.group({
      ChiefComplaint: ['', Validators.required],
      ProblemAreaID: ['', Validators.required],
      VisitDateandTime: ['', Validators.required],
      RecordedDate: ['', Validators.required],
      RecordedTime: ['', Validators.required],
      recordedDuring: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      ProblemDuration: ['', Validators.required],
      PreviousHistory: [''],
      SymptomsID: ['', Validators.required],
      OtherSymptoms: [''],
      PainScale: [''],
      PainNotes: [''],
      Timings: [''],
      ProblemTypeID: ['', Validators.required],
      ProblemStatus: ['', Validators.required],
      AggravatedBy: [''],
      Alleviatedby: [''],
      Observationotes: [''],
      InteractionSummary: [''],
      PAdditionalNotes: [''],
      Prognosis: [''],
      AssessmentNotes: [''],
      DiagnosisNotes: [''],
      ICD10: [''],
      Etiology: [''],
      DAdditionalNotes: ['']
    });
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getDateTime();
    this.getICDcode();
    this.getProviderName();
    this.bindAllProblemAreavalues();
    this.bindAllSymptoms();
    this.bindAllProblemTypes();
    this.bindProblemStatus();
    this.bindPainScale();
    this.changeTime();
    this.diagnosisForm.get('RecordedDate').setValue(new Date());
    this.diagnosisForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.diagnosisForm.get('ICD10').setValue('');
        }
      });
  }

  // Time Picker
  changeTime() {
    this.time = new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
  }

  // Visit Date and Time
  getDateTime() {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
      }
    });
  }

  // Recorded During
  RecordedDuring(index: any) {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
          this.diagnosisForm.get('recordedDuring').setValue(this.recordedDuring);
        }
      }
    });
  }

  // Icd Code
  getICDcode() {
    this.diagnosisForm.get('ICD10').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.newpatsvc.GetICDCodesbySearch(key).then(data => {
              this.icd = data;
            });
          }
          else {
            this.icd = null;
            this.icdTooltip = null;
          }
        }
        else {
          this.icd = null;
          this.icdTooltip = null;
        }
      });
  }

  // Icd Code Tooltip
  setICDTooltip(value1, value2) {
    this.icdTooltip = value1 + ' ' + value2;
  }
 
  // Provider Name
  getProviderName() {
    this.newpatsvc.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    });
  }

  // Problem Area Values
  bindAllProblemAreavalues() {
    this.triageSvc.getAllProblemAreavalues().then(data => {
      this.problemAreavalues = data;
    });
  }

  // Problem Area Tooltip
  setProblemAreaTooltip() {
    this.problemAreaTooltip = [];
    this.proArea = this.diagnosisForm.get('ProblemAreaID').value;
    for (const option of this.problemAreavalues) {
      for (const i of this.proArea) {
        if (i == option.ProblemAreaCode) {
          this.problemAreaTooltip.push(option.ProblemAreaDescription);
        }
      }
    }
  }

  // Symptoms
  bindAllSymptoms() {
    this.triageSvc.getAllSymptoms().then(data => {
      this.symptoms = data;
    });
  }

  // Symptoms Tooltip
  setSymptomsTooltip() {
    this.symptomsTooltip = [];
    this.sympt = this.diagnosisForm.get('SymptomsID').value;
    for (const option of this.symptoms) {
      for (const i of this.sympt) {
        if (i == option.SymptomsCode) {
          this.symptomsTooltip.push(option.SymptomsDescription);
        }
      }
    }
  }

  // Requested Procedures
  bindAllRequestedProcedures() {
    this.triageSvc.getAllRequestedProcedures().then(data => {
      this.requestedProcedures = data;
    });
  }

  // Problem Types
  bindAllProblemTypes() {
    this.triageSvc.getAllProblemTypes().then(data => {
      this.problemTypes = data;
    });
  }

  // Problem Types Tooltip
  setProblemTypeTooltip() {
    this.problemTypeTooltip = [];
    this.proType = this.diagnosisForm.get('ProblemTypeID').value;
    for (const option of this.problemTypes) {
      for (const i of this.proType) {
        if (i == option.ProblemTypeCode) {
          this.problemTypeTooltip.push(option.ProblemTypeDescription);
        }
      }
    }
  }
  
  // Problem Status
  bindProblemStatus() {
    this.triageSvc.getProblemStatus().then(data => {
      this.problemStatus = data;
    });
  }

  // Pain Scale
  bindPainScale() {
    this.triageSvc.getPainScale().then(data => {
      this.painScale = data;
    });
  }

  // File Upload
  onImageUpload(event) {
    let files = event.target.files;
    if (files.length == 0) {
      this.util.showMessage("Error!!", "Please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
      return;
    }
    else {
      if (files[0].type.match(/image.*/)) {
        for (let i = 0; i < files.length; i++) {
          var selectedFiles: File = <File>files[i];
          this.imgList.push(selectedFiles);

          let viewFile: clsViewFile = new clsViewFile();
          viewFile.FileName = selectedFiles.name;
          viewFile.Size = Math.round(selectedFiles.size / 1024) + " KB";

          let fileUrl = URL.createObjectURL(selectedFiles);
          let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
          viewFile.FileBlobUrl = selectedFileBLOB;

          let fileNameCase = (viewFile.FileName).toLowerCase();
          let confirmFile = (this.fileName.length > 0) ? this.fileName.includes(fileNameCase) : false;
          if (confirmFile) {
            this.util.showMessage(" ", "File Already Exist " + selectedFiles.name, BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(res => { });
          } else {
            this.listOfImgFiles.push(viewFile);
            this.fileName.push(fileNameCase);
          }
        }
      } else {
        this.util.showMessage("Error!!", "Not an image format, please choose an image format", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox);
      }
      this.image.nativeElement.value = '';
    }
  }

   // Remove Selected Files
   removeSelectedImgFiles(index) {
    // Delete file from FileList
    this.imgList.splice(index, 1);
    // Delete the item from fileNames list
    this.listOfImgFiles.splice(index, 1);
    // Delete fileNames for duplicate Files
    this.fileName.splice(index, 1);
  }

  // Date and Time
  sendDateWithTime() {
    this.getDate = new Date(this.diagnosisForm.get("RecordedDate").value);
    if (this.diagnosisForm.get("RecordedDate").value != "") {
      if (this.diagnosisForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.diagnosisForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.diagnosisForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.diagnosisForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.diagnosisForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.diagnosisForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.diagnosisForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  // Submit
  addDiagnosisForm() {
    if (this.diagnosisForm.valid) {
      this.sendDateWithTime();
      this.diagnosisModel.VisitID = this.visitID;
      this.diagnosisModel.RecordedDate = this.getDateAndTime;
      this.diagnosisModel.RecordedBy = this.diagnosisForm.get('RecordedBy').value;
      this.diagnosisModel.ChiefComplaint = this.diagnosisForm.get('ChiefComplaint').value;
      this.diagnosisModel.ProblemAreaID = this.diagnosisForm.get('ProblemAreaID').value.toString();
      this.diagnosisModel.ProblemDuration = this.diagnosisForm.get('ProblemDuration').value;
      this.diagnosisModel.PreviousHistory = this.diagnosisForm.get('PreviousHistory').value;
      this.diagnosisModel.SymptomsID = this.diagnosisForm.get('SymptomsID').value.toString();
      this.diagnosisModel.OtherSymptoms = this.diagnosisForm.get('OtherSymptoms').value;
      this.diagnosisModel.PainScale = this.diagnosisForm.get('PainScale').value ? parseInt(this.diagnosisForm.get('PainScale').value) : 0;
      this.diagnosisModel.PainNotes = this.diagnosisForm.get('PainNotes').value;
      this.diagnosisModel.Timings = this.diagnosisForm.get('Timings').value;
      this.diagnosisModel.ProblemTypeID = this.diagnosisForm.get('ProblemTypeID').value.toString();
      this.diagnosisModel.AggravatedBy = this.diagnosisForm.get('AggravatedBy').value;
      this.diagnosisModel.Alleviatedby = this.diagnosisForm.get('Alleviatedby').value;
      this.diagnosisModel.ProblemStatus = this.diagnosisForm.get('ProblemStatus').value;
      this.diagnosisModel.Observationotes = this.diagnosisForm.get('Observationotes').value;
      this.diagnosisModel.InteractionSummary = this.diagnosisForm.get('InteractionSummary').value;
      this.diagnosisModel.PAdditionalNotes = this.diagnosisForm.get('PAdditionalNotes').value;
      this.diagnosisModel.Prognosis = this.diagnosisForm.get('Prognosis').value;
      this.diagnosisModel.AssessmentNotes = this.diagnosisForm.get('AssessmentNotes').value;
      this.diagnosisModel.ICD10 = this.diagnosisForm.get('ICD10').value;
      this.diagnosisModel.DiagnosisNotes = this.diagnosisForm.get('DiagnosisNotes').value;
      this.diagnosisModel.Etiology = this.diagnosisForm.get('Etiology').value;
      this.diagnosisModel.DAdditionalNotes = this.diagnosisForm.get('DAdditionalNotes').value;
  
      this.triageSvc.addUpdateDiagnosisForVisitcase(this.diagnosisModel).then(data => {
        if (data.DiagnosisId) {
          const formData = new FormData();
          this.imgList.forEach(file => {
            formData.append('file', file, file.name);
          });

          this.newpatsvc.FileUpload(formData, data.DiagnosisId, "Patient/Diagnosis").then((res) => {
            if (!res[0].includes('Error')) {
              this.util.showMessage('', 'Diagnosis details saved successfully & ' + res, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
                if (res === true) {
                  this.DialogRef.close('Update');
                }
              });
            }
          });
        }
        else {
          this.util.showMessage("Error!!", data, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
    }
  }

  // Clear Form
  clearForm() {
    this.recordedDuring = '';
    this.imgList = [];
    this.listOfImgFiles = [];
    this.fileName = [];
    this.diagnosisForm.reset();
    this.diagnosisForm.get('RecordedDate').setValue(new Date());
    this.diagnosisForm.get('RecordedTime').setValue(this.time);
    this.diagnosisForm.get('RecordedTime').setValue(null);
    this.diagnosisForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  // Close Popup
  dialogClose(): void {
    this.DialogRef.close();
  }

}
