import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomHttpService } from "../../../core/custom-http.service";
import { PatientProblemListModel } from "../../../triage/models/patientProblemListModel";
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TriageService } from "../../../triage/triage.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode, } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { clsViewFile } from "src/app/patient/models/clsViewFile";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: "app-update-problem-list-triage",
  templateUrl: "./update-problem-list.component.html",
  styleUrls: ["./update-problem-list.component.css"],
})
export class UpdateProblemListTriageComponent implements OnInit {

  problemListForm: FormGroup;
  problemListModel: PatientProblemListModel = new PatientProblemListModel();
  recordedDuring: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
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
  FileUploadNames: any[] = [];
  ViewFileProblemList: Array<clsViewFile> = [];
  @ViewChild('multipleProblemList', { static: true }) attachmentProblemList: any;
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICD: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSnomedCode', { static: false, read: MatAutocompleteTrigger }) triggerSnomed: MatAutocompleteTrigger;

  constructor(public triageService: TriageService, public custHttp: CustomHttpService, public fb: FormBuilder, public dialogRef: MatDialogRef<UpdateProblemListTriageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService, private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.problemListForm = this.fb.group({
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

    this.bindProviderName();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
    this.bindAllProblemTypes();
    this.getproblemstatusvalue();
    this.setFormValues();
  }
  ngAfterViewInit() {
    this.triggerICD.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.problemListForm.get('ICD10Code').setValue('');
      }
    });

    this.triggerSnomed.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.problemListForm.get('SNOMEDCode').setValue('');
      }
    });
  }

  getproblemstatusvalue() {
    this.triageService.getproblemstatusvalue().then((res) => {
      this.problemstatusvalue = res;
    });
  }

  bindProviderName() {
    this.triageService.getProviderNames(0).then((res) => {
      this.recordedBy = res;
    });
  }

  bindAllProblemTypes() {
    this.triageService.getAllProblemTypes().then((data) => {
      this.problemTypes = data;
    });
  }

  bindAllDiagnosisCodes() {
    this.problemListForm.get("ICD10Code").valueChanges.subscribe((key: string) => {
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
    this.problemListForm.get("SNOMEDCode").valueChanges.subscribe((key: string) => {
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
    this.getDate = new Date(this.problemListForm.get("RecordedDate").value);

    if (this.problemListForm.get("RecordedDate").value != "") {
      if (this.problemListForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.problemListForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH = parseInt(this.problemListForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (
        this.problemListForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.problemListForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.problemListForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.problemListForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  closeForm() {
    this.problemListForm.reset();
    this.setFormValues();
    this.FileUploadNames = [];
    this.FileUploadProblemList = [];
  }

  setFormValues() {
    if (this.data.filePath) {
      if (this.data.filePath.length > 0) {
        this.setFileDataProblemList(this.data.filePath);
      }
    }

    if (this.data.DiagnosedDate != null && this.data.DiagnosedDate != "" && this.data.DiagnosedDate != undefined) {
      this.problemListForm.get("DiagnosedDate").setValue(new Date(this.data.DiagnosedDate));
    }
    if (this.data.ResolvedDate != null && this.data.ResolvedDate != "" && this.data.ResolvedDate != undefined) {
      this.problemListForm.get("ResolvedDate").setValue(new Date(this.data.ResolvedDate));
    }
    this.problemListForm.get("RecordedDate").setValue(new Date(this.data.RecordedDate));
    this.problemListForm.get("RecordedTime").setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
    this.problemListForm.get("ProblemTypeID").setValue(this.data.ProblemTypeID);
    this.problemListForm.get("ProblemDescription").setValue(this.data.ProblemDescription);
    this.problemListForm.get("ICD10Code").setValue(this.data.ICD10Code);
    this.problemListForm.get("SNOMEDCode").setValue(this.data.SNOMEDCode);
    this.problemListForm.get("Aggravatedby").setValue(this.data.Aggravatedby);
    this.problemListForm.get("Status").setValue(this.data.Status);
    this.problemListForm.get("AttendingPhysican").setValue(this.data.AttendingPhysican);
    this.problemListForm.get("AlleviatedBy").setValue(this.data.AlleviatedBy);
    this.problemListForm.get("Notes").setValue(this.data.Notes);
    this.problemListForm.get("RecordedBy").setValue(this.data.RecordedBy);
    this.problemListForm.get("VisitDateandTime").setValue(this.data.visitDateandTime);
    this.problemListForm.get("recordedDuring").setValue(this.data.recordedDuring);
    this.icdtootltip = this.data.ICD10Code;
    this.snoomedtootltip = this.data.SNOMEDCode;
    this.ViewFileProblemList = this.data.ViewFileProblemList;
    this.FileUploadProblemList = this.data.FileUpload;
    if (this.data.FileUpload) {
      this.data.FileUpload.filter(x => this.FileUpload(x));
    }
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

  public FileUpload(file: any): void {
    let files = file;

    let Temporaryfiles: File = <File>files;
    this.FileUploadProblemList.push(Temporaryfiles);

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
            this.triageService.RemoveFile(deletePath, fileName).then(res => { })
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

  updateProblemList() {
    if (this.problemListForm.valid) {
      this.sendDateWithTime();
      this.problemListModel.ProblemlistId = this.data.ProblemlistId;
      this.problemListModel.PatientId = this.data.PatientId;
      this.problemListModel.VisitId = this.data.VisitId;
      this.problemListModel.RecordedDate = this.getDateAndTime;
      this.problemListModel.RecordedBy = this.problemListForm.get("RecordedBy").value;
      this.problemListModel.ProblemTypeID = this.problemListForm.get("ProblemTypeID").value;
      this.problemListModel.ProblemTypeDesc = this.problemTypes.find(x => x.ProblemTypeId == this.problemListModel.ProblemTypeID).ProblemTypeDescription;
      this.problemListModel.ProblemDescription = this.problemListForm.get("ProblemDescription").value;
      this.problemListModel.ICD10Code = this.problemListForm.get("ICD10Code").value;
      this.problemListModel.SNOMEDCode = this.problemListForm.get("SNOMEDCode").value;
      this.problemListModel.Aggravatedby = this.problemListForm.get("Aggravatedby").value;
      this.problemListModel.AlleviatedBy = this.problemListForm.get("AlleviatedBy").value;
      this.problemListModel.DiagnosedDate = this.problemListForm.get("DiagnosedDate").value;
      this.problemListModel.Status = this.problemListForm.get("Status").value;
      this.problemListModel.ResolvedDate = this.problemListForm.get("ResolvedDate").value;
      this.problemListModel.AttendingPhysican = this.problemListForm.get("AttendingPhysican").value;
      this.problemListModel.Notes = this.problemListForm.get("Notes").value;
      this.problemListModel.visitDateandTime = this.problemListForm.get("VisitDateandTime").value;
      this.problemListModel.recordedDuring = this.problemListForm.get("recordedDuring").value;
      this.problemListModel.FileUpload = this.FileUploadProblemList;
      this.problemListModel.ViewFileProblemList = this.ViewFileProblemList;

      this.dialogRef.close(this.problemListModel);
    }
  }

  RemoveFileUpload(fileName: any, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadProblemList.splice(index, 1);
      }
    });
  }
}
