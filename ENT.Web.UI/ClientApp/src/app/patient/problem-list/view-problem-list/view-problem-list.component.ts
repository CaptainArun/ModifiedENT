import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NewPatientService } from "../../newPatient.service";
import { clsViewFile } from "../../models/clsViewFile";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-view-problem-list",
  templateUrl: "./view-problem-list.component.html",
  styleUrls: ["./view-problem-list.component.css"],
})

export class ViewProblemListComponent implements OnInit {

  ProblemListForm: FormGroup;
  patientID: number = 1;
  visitDateTime: any[] = [];
  visitId: any;
  recordedDuring: any;
  facilityId: number = 0;
  recordedBy: any[] = [];
  FileUploadProblemList: Array<File> = [];
  ViewFileProblemList: Array<clsViewFile> = [];

  constructor(public fb: FormBuilder, public newPatientService: NewPatientService, public dialogReg: MatDialogRef<ViewProblemListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.ProblemListForm = this.fb.group({
      visitDateandTime: [""],
      RecordedDate: ["", Validators.required],
      RecordedTime: [""],
      recordedDuring: [""],
      RecordedBy: ["", Validators.required],
    });
    this.ProblemListForm.disable();
    this.setViewProblist();
    this.setFileDataProblemList(this.data.filePath);

  }

  setViewProblist() {
    this.ProblemListForm.get("RecordedBy").setValue(this.data.RecordedBy);
    this.ProblemListForm.get("RecordedDate").setValue(new Date(this.data.RecordedDate));
    this.ProblemListForm.get("RecordedTime").setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.ProblemListForm.get("visitDateandTime").setValue(this.data.visitDateandTime);
    this.ProblemListForm.get("recordedDuring").setValue(this.data.recordedDuring);
  }

  bindVisitDateAndTime() {
    this.newPatientService.GetVisitsForPatient(this.patientID).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.visitId = res[i].VisitId;
      }
    });
  }

  RecordedDuring(data: any) {
    this.newPatientService.GetVisitsForPatient(this.patientID).then((res) => {
      for (let x = 0; x < res.length; x++) {
        if (x == data) {
          this.recordedDuring = res[x].recordedDuring;
        }
      }
    });
  }

  bindProviderName() {
    this.newPatientService.GetProviderNames(this.facilityId).then((res) => {
      this.recordedBy = res;
    });
  }

  dialogClose(): void {
    this.dialogReg.close();
  }

  setFileDataProblemList(Filedata) {
    if (Filedata.length > 0) {
      this.ViewFileProblemList = [];
      for (let i = 0; i < Filedata.length; i++) {
        let viewFile: clsViewFile = new clsViewFile();
        viewFile.FileName = Filedata[i].FileName;
        viewFile.Size = Filedata[i].FileSize;
        viewFile.FileUrl = Filedata[i].FileUrl
        viewFile.ActualFile = Filedata[i].ActualFile; //Actual file is base64 ...
        const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
        let FileData = new Blob([byteArray], { type: Filedata[i].FileType });
        let fileUrl = URL.createObjectURL(FileData);
        let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
        viewFile.FileBlobUrl = selectedFileBLOB;
        this.ViewFileProblemList.push(viewFile);
      }
    }
  }

}
