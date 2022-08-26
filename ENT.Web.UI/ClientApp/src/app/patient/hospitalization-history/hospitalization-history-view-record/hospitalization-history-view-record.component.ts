import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hospitalization-history-view-record',
  templateUrl: './hospitalization-history-view-record.component.html',
  styleUrls: ['./hospitalization-history-view-record.component.css']
})
export class HospitalizationHistoryViewRecordComponent implements OnInit {
  HospitalViewForm: FormGroup;
  requiredViewFile: Array<clsViewFile> = [];

  constructor(public fb: FormBuilder, private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<HospitalizationHistoryViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.HospitalViewForm = this.fb.group({
      visitDateandTime: [''],
      RecordedDate: ['', Validators.required],
      RecordedTime: [''],
      recordedDuring: [''],
      RecordedBy: ['', Validators.required],
    })
    this.HospitalViewForm.disable();
    this.setMedicationView();
  }
  setMedicationView() {
    if (this.data.filePath.length > 0) {
      this.setFileData(this.data.filePath);
    }
    this.HospitalViewForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.HospitalViewForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.HospitalViewForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.HospitalViewForm.get('recordedDuring').setValue(this.data.recordedDuring);
    this.HospitalViewForm.get('visitDateandTime').setValue(this.data.visitDateandTime);
  }

  setFileData(Filedata:any) {
    this.requiredViewFile = [];
    for (let i = 0; i < Filedata.length; i++) {
      let viewFile: clsViewFile = new clsViewFile();
      viewFile.FileName = Filedata[i].FileName;
      viewFile.Size = Filedata[i].FileSize;
      viewFile.FileUrl = Filedata[i].FileUrl
      viewFile.ActualFile = Filedata[i].ActualFile; //Actual file is base64 ...
      const byteArray = new Uint8Array(atob(viewFile.ActualFile).split('').map(char => char.charCodeAt(0)));
      let alpha = new Blob([byteArray], { type: Filedata[i].FileType });
      let fileUrl = URL.createObjectURL(alpha);
      let selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
      viewFile.FileBlobUrl = selectedFileBLOB;
      this.requiredViewFile.push(viewFile);
    }
  }
  dialogClose(): void {
    this.dialogRef.close();
  }

}
