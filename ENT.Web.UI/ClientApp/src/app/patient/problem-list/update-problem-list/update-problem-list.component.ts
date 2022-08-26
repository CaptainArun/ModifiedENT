import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NewPatientService } from "../../newPatient.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import { PatientProblemListModel } from "../../../triage/models/patientProblemListModel";
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TriageService } from "../../../triage/triage.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode, } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { clsViewFile } from "../../models/clsViewFile";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-UpdateProblemListComponent",
  templateUrl: "./update-problem-list.component.html",
  styleUrls: ["./update-problem-list.component.css"],
})
export class UpdateProblemListComponent implements OnInit {

  //#region property declaration
  problemlistEditForm: FormGroup;
  problemListModel: PatientProblemListModel = new PatientProblemListModel();
  recordedDuring: any;
  patientID: number;
  visitId: number;
  visitDateTime: any[] = [];
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  facilityId: any;
  recordedBy: any;
  allergyType: any;
  AllergySeverities: any;
  diagnosisCode: any;
  snomedCTCode: any;
  problemTypes: any;
  problemstatusvalue: any;
  icdtootltip: any;
  snoomedtootltip: any;
  FileUploadProblemList: Array<File> = [];
  ViewFileProblemList: Array<clsViewFile> = [];
  FileUploadNames: any[] = [];
  @ViewChild('multipleProblemList', { static: true }) attachmentProblemList: any;
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICD: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSnomedCode', { static: false, read: MatAutocompleteTrigger }) triggerSnomed: MatAutocompleteTrigger;
  visitID: any;
  //#endregion

  //#region constructor
  constructor(
    public newPatientService: NewPatientService,
    public triageService: TriageService,
    public custHttp: CustomHttpService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateProblemListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilService, private sanitizer: DomSanitizer
  ) {
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.problemlistEditForm = this.fb.group({
      ProblemlistId: [""],
      ProblemTypeID: [""],
      ProblemDescription: [""],
      ICD10Code: [""],
      SNOMEDCode: [""],
      Aggravatedby: [""],
      DiagnosedDate: [""],
      ResolvedDate: [""],
      Status: [""],
      AttendingPhysican: [""],
      AlleviatedBy: [""],
      FileName: [""],
      Notes: [""],
      VisitDateandTime: ["", Validators.required],
      RecordedDate: ["", Validators.required],
      RecordedTime: ["", Validators.required],
      recordedDuring: ["", Validators.required],
      RecordedBy: ["", Validators.required],
    });

    this.bindVisitDateAndTime();
    this.bindProviderName();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
    this.bindAllProblemTypes();
    this.getproblemstatusvalue();
    this.setFormValues();

    this.problemlistEditForm.get('recordedDuring').disable();
  }

  ngAfterViewInit() {
    this.triggerICD.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.problemlistEditForm.get('ICD10Code').setValue('');
      }
    });

    this.triggerSnomed.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.problemlistEditForm.get('SNOMEDCode').setValue('');
      }
    });
  }
  //#endregion

  //#region get method
  getproblemstatusvalue() {
    this.triageService.getproblemstatusvalue().then((res) => {
      this.problemstatusvalue = res;
    });
  }

  bindVisitDateAndTime() {
    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.visitId = res[i].VisitId;
      }
    });
  }
  RecordedDuring(data1: any) {
    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then((data) => {
      for (var i = 0; i < data.length; i++) {
        if (i == data1) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].visitID;
        }
      }
    });
  }

  bindProviderName() {
    this.newPatientService.GetProviderNames(this.facilityId).then((res) => {
      this.recordedBy = res;
    });
  }

  bindAllProblemTypes() {
    this.triageService.getAllProblemTypes().then((data) => {
      this.problemTypes = data;
    });
  }

  bindAllDiagnosisCodes() {
    this.problemlistEditForm.get("ICD10Code").valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllDiagnosisCodes(key).then((data) => {
            this.diagnosisCode = data;
          });
        }
        else {
          this.diagnosisCode = null;
          this.icdtootltip = null;
        }
      }
    });
  }

  bindAllSnomedCTCodes() {
    this.problemlistEditForm.get("SNOMEDCode").valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllSnomedCTCodes(key).then((data) => {
            this.snomedCTCode = data;
          });
        }
        else {
          this.snomedCTCode = null;
          this.snoomedtootltip = null;
        }
      }
    });
  }

  sendDateWithTime() {
    this.getDate = new Date(this.problemlistEditForm.get("RecordedDate").value);

    if (this.problemlistEditForm.get("RecordedDate").value != "") {
      if (this.problemlistEditForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.problemlistEditForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH = parseInt(this.problemlistEditForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (
        this.problemlistEditForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.problemlistEditForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.problemlistEditForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.problemlistEditForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  closeForm() {
    this.problemlistEditForm.reset();
    this.setFormValues();
    this.FileUploadNames = [];
    this.FileUploadProblemList = [];
  }
  //#endregion

  //#region set values
  setFormValues() {

    if (this.data.filePath.length > 0) {
      this.setFileDataProblemList(this.data.filePath);
    }
    if (this.data.DiagnosedDate != null) {
      this.problemlistEditForm.get("DiagnosedDate").setValue(new Date(this.data.DiagnosedDate));
    }
    if (this.data.ResolvedDate != null) {
      this.problemlistEditForm.get("ResolvedDate").setValue(new Date(this.data.ResolvedDate));
    }

    this.problemlistEditForm.get("RecordedDate").setValue(new Date(this.data.RecordedDate));
    this.problemlistEditForm.get("RecordedTime").setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.problemlistEditForm.get("ProblemTypeID").setValue(this.data.ProblemTypeID);
    this.problemlistEditForm.get("ProblemDescription").setValue(this.data.ProblemDescription);
    this.problemlistEditForm.get("ICD10Code").setValue(this.data.ICD10Code);
    this.problemlistEditForm.get("SNOMEDCode").setValue(this.data.SNOMEDCode);
    this.problemlistEditForm.get("Aggravatedby").setValue(this.data.Aggravatedby);
    this.problemlistEditForm.get("Status").setValue(this.data.Status);
    this.problemlistEditForm.get("AttendingPhysican").setValue(this.data.AttendingPhysican);
    this.problemlistEditForm.get("AlleviatedBy").setValue(this.data.AlleviatedBy);
    this.problemlistEditForm.get("Notes").setValue(this.data.Notes);
    this.problemlistEditForm.get("RecordedBy").setValue(this.data.RecordedBy);
    this.problemlistEditForm.get("VisitDateandTime").setValue(this.data.visitDateandTime);
    this.problemlistEditForm.get("recordedDuring").setValue(this.data.recordedDuring);
    this.icdtootltip = this.data.ICD10Code;
    this.snoomedtootltip = this.data.SNOMEDCode;

  }
  dialogClose() {
    this.dialogRef.close();
  }
  //Set icd code
  setIcdCode(value1, value2) {
    this.icdtootltip = value1 + " " + value2;
  }
  //Set cpt code
  setSnoomedCode(value1, value2) {
    this.snoomedtootltip = value1 + " " + value2;
  }
  //#endregion

  //#region File Upload problemList
  public FileUploadProblemListMethod(file: any): void {
    let files = file.target.files
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUploadProblemList.push(Temporaryfiles);
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
          this.ViewFileProblemList.push(viewFile);
          this.FileUploadNames.push(lowerCaseFilename);
        }
      }
      this.attachmentProblemList.nativeElement.value = '';
    }
  }

  RemoveFileProblemList(fileName: any, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNames.splice(index, 1);
        let temporaryFile: Array<clsViewFile> = [];
        let temporaryFileupload: Array<File> = [];

        this.ViewFileProblemList.filter((property) => {
          if (property.FileUrl != null && property.FileName == fileName) {
            let a = "/" + property.FileUrl.split("/")[property.FileUrl.split("/").length - 1];

            let deletePath = (property.FileUrl.split(a)[0]);
            this.newPatientService.DeleteFile(deletePath, fileName).then(res => { })
          }
        });

        for (const tempFile of this.ViewFileProblemList) {
          if (tempFile.FileName != fileName) {
            temporaryFile.push(tempFile);
          }
        }
        this.ViewFileProblemList = [];
        this.ViewFileProblemList = temporaryFile;

        for (const tempFile of this.FileUploadProblemList) {
          if (tempFile.name != fileName) {
            temporaryFileupload.push(tempFile);
          }
        }
        this.FileUploadProblemList = [];
        this.FileUploadProblemList = temporaryFileupload;
      }
    });
  }

  setFileDataProblemList(Filedata) {
    this.ViewFileProblemList = [];
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
      this.ViewFileProblemList.push(viewFile);
    }
  }

  //#endregion File Upload

  //#region save function
  updateProblemList() {
    if (this.problemlistEditForm.valid) {
      this.sendDateWithTime();
      this.problemListModel.ProblemlistId = this.data.ProblemlistId;
      this.problemListModel.PatientId = this.data.PatientId;
      this.problemListModel.VisitId = this.data.VisitId;
      this.problemListModel.RecordedDate = this.getDateAndTime;
      this.problemListModel.RecordedBy = this.problemlistEditForm.get("RecordedBy").value;
      this.problemListModel.ProblemTypeID = this.problemlistEditForm.get("ProblemTypeID").value;
      this.problemListModel.ProblemDescription = this.problemlistEditForm.get("ProblemDescription").value;
      this.problemListModel.ICD10Code = this.problemlistEditForm.get("ICD10Code").value;
      this.problemListModel.SNOMEDCode = this.problemlistEditForm.get("SNOMEDCode").value;
      this.problemListModel.Aggravatedby = this.problemlistEditForm.get("Aggravatedby").value;
      this.problemListModel.AlleviatedBy = this.problemlistEditForm.get("AlleviatedBy").value;
      this.problemListModel.DiagnosedDate = this.problemlistEditForm.get("DiagnosedDate").value;
      this.problemListModel.Status = this.problemlistEditForm.get("Status").value;
      this.problemListModel.ResolvedDate = this.problemlistEditForm.get("ResolvedDate").value;
      this.problemListModel.AttendingPhysican = this.problemlistEditForm.get("AttendingPhysican").value;
      this.problemListModel.Notes = this.problemlistEditForm.get("Notes").value;
      this.newPatientService.AddUpdateProblemListForVisit(this.problemListModel).then((res) => {
        if (res.ProblemlistId > 0) {

          const formData = new FormData();
          this.FileUploadProblemList.forEach(file => {
            formData.append('file', file, file.name);
          });

          this.newPatientService.FileUploadMultiple(formData, res.ProblemlistId, "Patient/ProblemList").then((res) => { });

          this.util.showMessage("", "Problem List saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            this.dialogRef.close("Updated");
          });

        } else {
          this.util.showMessage("Error", "Problem List details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
    }
  }
  //#endregion
}
