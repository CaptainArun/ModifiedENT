import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NewPatientService } from "../../newPatient.service";
import { PatientProblemListModel } from "../../../triage/models/patientProblemListModel";
import { MatAutocompleteTrigger, MatDialogRef } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { TriageService } from "../../../triage/triage.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode, } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { DomSanitizer } from "@angular/platform-browser";
import { clsViewFile } from "../../models/clsViewFile";

@Component({
  selector: "app-AddProblemListComponent",
  templateUrl: "./add-problem-list.component.html",
  styleUrls: ["./add-problem-list.component.css"],
})

export class AddProblemListComponent implements OnInit {

  //#region "Property Declaration"
  problemlistForm: FormGroup;
  problemListModel: PatientProblemListModel = new PatientProblemListModel();
  recordedDuringget: any = "";
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
  //#endregion "Property Declaration"

  //#region "constructor"
  constructor(
    public newPatientService: NewPatientService, public fb: FormBuilder, public dialogRef: MatDialogRef<AddProblemListComponent>, public custHttp: CustomHttpService, public triageService: TriageService, private util: UtilService, private sanitizer: DomSanitizer
  ) { }
  //#endregion "constructor"

  //#region "ngOnInit"
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));

    this.problemlistForm = this.fb.group({
      ProblemlistId: [""],
      ProblemTypeID: ["", Validators.required],
      ProblemDescription: ["", Validators.required],
      ICD10Code: [""],
      SNOMEDCode: [""],
      Aggravatedby: [""],
      DiagnosedDate: [""],
      ResolvedDate: [""],
      Status: ["", Validators.required],
      AttendingPhysican: ["", Validators.required],
      AlleviatedBy: [""],
      FileName: [""],
      Notes: [""],
      VisitDateandTime: ["", Validators.required],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'})],
      recordedDuring: ["", Validators.required],
      RecordedBy: ["", Validators.required],
    });

    this.bindVisitDateAndTime();
    this.bindProviderName();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
    this.bindAllProblemTypes();
    this.getproblemstatusvalue();
  }
  ngAfterViewInit() {
    this.triggerICD.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.problemlistForm.get('ICD10Code').setValue('');
      }
    });

    this.triggerSnomed.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.problemlistForm.get('SNOMEDCode').setValue('');
      }
    });
  }
  //#endregion "ngOnInit"

  //#region region "Save Function"
  addProblemList() {
    if (this.problemlistForm.valid) {
      this.sendDateWithTime();
      this.problemListModel.ProblemlistId = 0;
      this.problemListModel.PatientId = this.newPatientService.patientId;
      this.problemListModel.VisitId = this.visitId;
      this.problemListModel.RecordedDate = this.getDateAndTime;
      this.problemListModel.RecordedBy = this.problemlistForm.get("RecordedBy").value;
      this.problemListModel.ProblemTypeID = this.problemlistForm.get("ProblemTypeID").value;
      this.problemListModel.ProblemDescription = this.problemlistForm.get("ProblemDescription").value;
      this.problemListModel.ICD10Code = this.problemlistForm.get("ICD10Code").value;
      this.problemListModel.SNOMEDCode = this.problemlistForm.get("SNOMEDCode").value;
      this.problemListModel.Aggravatedby = this.problemlistForm.get("Aggravatedby").value;
      this.problemListModel.AlleviatedBy = this.problemlistForm.get("AlleviatedBy").value;
      this.problemListModel.DiagnosedDate = this.problemlistForm.get("DiagnosedDate").value;
      this.problemListModel.Status = this.problemlistForm.get("Status").value;
      this.problemListModel.ResolvedDate = this.problemlistForm.get("ResolvedDate").value;
      this.problemListModel.AttendingPhysican = this.problemlistForm.get("AttendingPhysican").value;
      this.problemListModel.Notes = this.problemlistForm.get("Notes").value;

      this.newPatientService.AddUpdateProblemListForVisit(this.problemListModel).then((res) => {
        if (res.ProblemlistId > 0) {
          if (this.FileUploadProblemList.length > 0) {

            const formData = new FormData();
            this.FileUploadProblemList.forEach(file => {
              formData.append('file', file, file.name);
            });

            this.newPatientService.FileUploadMultiple(formData, res.ProblemlistId, "Patient/ProblemList").then(res => { });
            this.util.showMessage("", "Problem List saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
              this.dialogRef.close("Updated");
            });
          }
        } else {
          this.util.showMessage("Error", "Problem List details Not saved", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => { });

        }
      });
    }
  }
  //#endregionregion "Save Function"

  //#region get methods
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

  setRecordedDuring(data: any) {
    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then((res) => {
      for (let x = 0; x < res.length; x++) {
        if (x == data) {
          this.recordedDuringget = res[x].recordedDuring;
          this.problemlistForm.get("recordedDuring").setValue(this.recordedDuringget);
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
    this.problemlistForm.get("ICD10Code").valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllDiagnosisCodes(key).then((data) => {
            this.diagnosisCode = data;
          });
        } else {
          this.diagnosisCode = null;
          this.icdtootltip = null;

        }
      }
    });
  }

  bindAllSnomedCTCodes() {
    this.problemlistForm.get("SNOMEDCode").valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllSnomedCTCodes(key).then((data) => {
            this.snomedCTCode = data;
          });
        } else {
          this.snomedCTCode = null;
          this.snoomedtootltip = null;
        }
      }
    });
  }

  sendDateWithTime() {
    this.getDate = new Date(this.problemlistForm.get("RecordedDate").value);

    if (this.problemlistForm.get("RecordedDate").value != "") {
      if (this.problemlistForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (
          parseInt(
            this.problemlistForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH = parseInt(this.problemlistForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (
        this.problemlistForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.problemlistForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.problemlistForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.problemlistForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  closeForm() {
    this.problemlistForm.reset();
    this.recordedDuringget = "";
    this.FileUploadNames = [];
    this.FileUploadProblemList = [];
    this.ViewFileProblemList = [];
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
  //#endregion get methods

  //#region File Upload problemList
  public FileUploadProblemListMethod(file: any): void {
    let files = file.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (let i = 0; i < files.length; i++) {
        let Temporaryfiles: File = <File>files[i];
        this.FileUploadProblemList.push(Temporaryfiles);
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Temporaryfiles.name;
        viewFile.Size = Math.round(Temporaryfiles.size / 1024) + " KB";
        let fileUrl = URL.createObjectURL(Temporaryfiles);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        let lowerCaseFilename = (viewFile.FileName).toLowerCase();
        let ConfrimFile = (this.FileUploadNames.length > 0) ? this.FileUploadNames.includes(lowerCaseFilename) : false;
        if (ConfrimFile) {
          this.util.showMessage("", "File Already Exist " + Temporaryfiles.name, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then(res => {
          });
        }
        else {
          this.ViewFileProblemList.push(viewFile);
          this.FileUploadNames.push(lowerCaseFilename); //file name storing...
        }
      }
      this.attachmentProblemList.nativeElement.value = '';
    }

  }

  RemoveFileProblemList(fileName: any, index: number): void {
    this.util.showMessage("Delete", "Are you sure want to Delete? This action cannot be undone.", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.ConfrimBox).then((res) => {
      if (res) {
        this.FileUploadNames.splice(index, 1);

        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = fileName;

        let temporaryFileView: Array<clsViewFile> = [];
        for (const tempFileView of this.ViewFileProblemList) {
          if (tempFileView.FileName != fileName) {
            temporaryFileView.push(tempFileView);
          }
        }
        this.ViewFileProblemList = [];
        this.ViewFileProblemList = temporaryFileView;

        let temporaryFileupload: Array<File> = [];
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
  //#endregion File Upload

}
