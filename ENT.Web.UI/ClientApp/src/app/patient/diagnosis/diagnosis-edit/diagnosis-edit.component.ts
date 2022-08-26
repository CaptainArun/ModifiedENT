import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DiagnosisModel } from '../../../triage/models/diagnosisModel';
import { NewPatientService } from '../../newPatient.service';
import { TriageService } from '../../../triage/triage.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-diagnosis-edit',
  templateUrl: './diagnosis-edit.component.html',
  styleUrls: ['./diagnosis-edit.component.css']
})

export class DiagnosisEditComponent implements OnInit, AfterViewInit {
  diagnosisForm: FormGroup;
  diagnosisModel: DiagnosisModel = new DiagnosisModel();
  patientId: number;
  icd: string;
  facilityId: number = 0;
  recordby: any;
  visitDandt: any[] = [];
  recordedDuring: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  problemAreavalues: any;
  symptoms: any;
  problemTypes: any;
  problemTypeValues: Array<Number> = [];
  problemStatus: any;
  painScale: any;
  icdTooltip: any;
  problemAreaTooltip: any[] = [];
  proArea: any;
  symptomsTooltip: any[] = [];
  sympt: any;
  problemTypeTooltip: any[] = [];
  proType: any;
  imgList: Array<File> = [];
  listOfImgFiles: Array<clsViewFile> = [];
  fileName: any[] = [];
  uploadImg: boolean = false;
  showIcon: boolean = false;
  showBtn: boolean = false;

  @ViewChild('image', { static: true }) image: ElementRef;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;

  constructor(public fb: FormBuilder, public newPatientSvc: NewPatientService, public triageSvc: TriageService, public custHttpSvc: CustomHttpService, public DialogRef: MatDialogRef<DiagnosisEditComponent>, @Inject(MAT_DIALOG_DATA) public diagnosisData: any, private util: UtilService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.custHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
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
      DAdditionalNotes: [''],
    });
    this.getDateTime();
    this.setDiagnosisForm();
    this.getICDcode();
    this.getProviderName();
    this.bindAllProblemAreavalues();
    this.bindAllSymptoms();
    this.bindAllProblemTypes();
    this.bindProblemStatus();
    this.bindPainScale();
    this.diagnosisForm.get('VisitDateandTime').disable();
    this.diagnosisForm.get('recordedDuring').disable();
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.diagnosisForm.get('ICD10').setValue('');
        }
      });
  }

  getDateTime() {
    this.newPatientSvc.GetVisitsForPatient(this.newPatientSvc.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
      }
    });
  }

  RecordedDuring(index: any) {
    this.newPatientSvc.GetVisitsForPatient(this.newPatientSvc.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
        }
      }
    });
  }

  getICDcode() {
    this.diagnosisForm.get('ICD10').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.newPatientSvc.GetICDCodesbySearch(key).then(data => {
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

  setICDTooltip(value1, value2) {
    this.icdTooltip = value1 + ' ' + value2;
  }

  getProviderName() {
    this.newPatientSvc.GetProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    });
  }

  bindAllProblemAreavalues() {
    this.triageSvc.getAllProblemAreavalues().then(data => {
      this.problemAreavalues = data;
    });
  }

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

  bindAllSymptoms() {
    this.triageSvc.getAllSymptoms().then(data => {
      this.symptoms = data;
    });
  }

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

  bindAllProblemTypes() {
    this.triageSvc.getAllProblemTypes().then(data => {
      this.problemTypes = data;
    });
  }

  setProblemTypeTooltip() {
    this.problemTypeTooltip = [];
    this.proType = this.diagnosisForm.get('ProblemTypeID').value;
    for (const option of this.problemTypes) {
      for (const i of this.proType) {
        if (i == option.ProblemTypeId) {
          this.problemTypeTooltip.push(option.ProblemTypeDescription);
        }
      }
    }
  }

  bindProblemStatus() {
    this.triageSvc.getProblemStatus().then(data => {
      this.problemStatus = data;
    });
  }

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

  removeImgFiles(fileName: string, index: number) {
    this.util.showMessage("Delete", "Are you sure want to delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.listOfImgFiles.filter((obj) => {
          if (obj.FileUrl != null && obj.FileName == fileName) {
            let a = "/" + obj.FileUrl.split("/")[obj.FileUrl.split("/").length - 1];
            let deletePath = (obj.FileUrl.split(a)[0]);
            this.triageSvc.RemoveFile(deletePath, fileName).then((res) => { });
          }
        });
        this.fileName.splice(index, 1);
        this.imgList.splice(index, 1);
        this.listOfImgFiles.splice(index, 1);
      }
    });
  }

  setImageFiles(Filedata) {
    for (let i = 0; i < Filedata.length; i++) {
      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Filedata[i].FileName;
      viewFile.Size = Filedata[i].FileSize;
      viewFile.FileUrl = Filedata[i].FileUrl
      viewFile.ActualFile = Filedata[i].ActualFile; // Actual file is base64 ...

      const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
      let FileData = new Blob([byteArray], { type: Filedata[i].FileType });
      let fileUrl = URL.createObjectURL(FileData);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;

      let fileNameCase = (viewFile.FileName).toLowerCase();
      this.fileName.push(fileNameCase);
      this.listOfImgFiles.push(viewFile);
    }
  }

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

  setDiagnosisForm() {
    this.diagnosisForm.get('VisitDateandTime').setValue(this.diagnosisData.visitDateandTime);
    this.diagnosisForm.get('RecordedTime').setValue(new Date(this.diagnosisData.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.diagnosisForm.get('recordedDuring').setValue(this.diagnosisData.recordedDuring);
    this.diagnosisForm.get('RecordedDate').setValue(this.diagnosisData.RecordedDate);
    this.diagnosisForm.get('RecordedBy').setValue(this.diagnosisData.RecordedBy);
    this.diagnosisForm.get('ChiefComplaint').setValue(this.diagnosisData.ChiefComplaint);
    this.diagnosisForm.get('ProblemAreaID').setValue(this.diagnosisData.ProblemAreaArray);
    this.problemAreaTooltip = this.diagnosisData.ProblemAreaValues;
    this.diagnosisForm.get('ProblemDuration').setValue(this.diagnosisData.ProblemDuration);
    this.diagnosisForm.get('PreviousHistory').setValue(this.diagnosisData.PreviousHistory);
    this.diagnosisForm.get('SymptomsID').setValue(this.diagnosisData.SymptomsValueArray);
    this.symptomsTooltip = this.diagnosisData.SymptomsValues;
    this.diagnosisForm.get('OtherSymptoms').setValue(this.diagnosisData.OtherSymptoms);
    this.diagnosisForm.get('PainScale').setValue(this.diagnosisData.PainScale);
    this.diagnosisForm.get('PainNotes').setValue(this.diagnosisData.PainNotes);
    this.diagnosisForm.get('Timings').setValue(this.diagnosisData.Timings);
    this.diagnosisForm.get('ProblemTypeID').setValue(this.diagnosisData.ProblemTypeArray);
    this.problemTypeTooltip = this.diagnosisData.ProblemTypeValues;
    this.diagnosisForm.get('AggravatedBy').setValue(this.diagnosisData.AggravatedBy);
    this.diagnosisForm.get('Alleviatedby').setValue(this.diagnosisData.Alleviatedby);
    this.diagnosisForm.get('ProblemStatus').setValue(this.diagnosisData.ProblemStatus);
    this.diagnosisForm.get('Observationotes').setValue(this.diagnosisData.Observationotes);
    this.diagnosisForm.get('InteractionSummary').setValue(this.diagnosisData.InteractionSummary);
    this.diagnosisForm.get('PAdditionalNotes').setValue(this.diagnosisData.PAdditionalNotes);
    this.diagnosisForm.get('Prognosis').setValue(this.diagnosisData.Prognosis);
    this.diagnosisForm.get('AssessmentNotes').setValue(this.diagnosisData.AssessmentNotes);
    this.diagnosisForm.get('ICD10').setValue(this.diagnosisData.ICD10);
    this.icdTooltip = this.diagnosisData.ICD10;
    this.diagnosisForm.get('DiagnosisNotes').setValue(this.diagnosisData.DiagnosisNotes);
    this.diagnosisForm.get('Etiology').setValue(this.diagnosisData.Etiology);
    this.diagnosisForm.get('DAdditionalNotes').setValue(this.diagnosisData.DAdditionalNotes);

    if (this.diagnosisData.filePath.length > 0) {
      this.setImageFiles(this.diagnosisData.filePath);
    }

    // if (this.diagnosisData.signOffstatus == "Yes") {
    //   this.uploadImg = true;
    //   this.showIcon = true;
    //   this.showBtn = true;
    //   this.diagnosisForm.disable();
    // }
  }

  editDiagnosisForm() {
    if (this.diagnosisForm.valid) {
      this.sendDateWithTime();
      this.diagnosisModel.DiagnosisId = this.diagnosisData.DiagnosisId;
      this.diagnosisModel.VisitID = this.diagnosisData.VisitID;
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

          this.newPatientSvc.FileUpload(formData, data.DiagnosisId, "Patient/Diagnosis").then((res) => {
            if (!res[0].includes('Error')) {
              this.util.showMessage('', 'Diagnosis details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
                if (res === true) {
                  this.DialogRef.close('update');
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

  clear() {
    this.imgList = [];
    this.listOfImgFiles = [];
    this.fileName = [];
    this.setDiagnosisForm();
  }

  dialogClose(): void {
    this.DialogRef.close();
  }

}
