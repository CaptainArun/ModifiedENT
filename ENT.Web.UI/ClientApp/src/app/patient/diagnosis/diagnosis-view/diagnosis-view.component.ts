import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-diagnosis-view',
  templateUrl: './diagnosis-view.component.html',
  styleUrls: ['./diagnosis-view.component.css']
})
export class DiagnosisViewComponent implements OnInit {
  DiagnosisViewForm: FormGroup;
  viewImageFiles: Array<clsViewFile> = [];

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<DiagnosisViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.DiagnosisViewForm = this.fb.group({
      visitDateandTime: [''],
      RecordedDate: ['', Validators.required],
      RecordedTime: [''],
      recordedDuring: [''],
      RecordedBy: ['', Validators.required],
    })
    this.DiagnosisViewForm.disable();
    this.setMedicationView();
  }

  setMedicationView() {
    this.DiagnosisViewForm.get('visitDateandTime').setValue(this.data.visitDateandTime);
    this.DiagnosisViewForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.DiagnosisViewForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.DiagnosisViewForm.get('recordedDuring').setValue(this.data.recordedDuring);
    this.DiagnosisViewForm.get('RecordedBy').setValue(this.data.RecordedBy);
    if (this.data.filePath.length > 0) {
      this.setFilesData(this.data.filePath);
    }
  }

  setFilesData(Filedata) {
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

      this.viewImageFiles.push(viewFile);
    }
  }
 
  dialogClose(): void {
    this.dialogRef.close();
  }
  
}
