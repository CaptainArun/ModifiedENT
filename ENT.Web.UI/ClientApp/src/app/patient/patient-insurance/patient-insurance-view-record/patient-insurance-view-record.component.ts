import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { clsViewFile } from '../../models/clsViewFile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-patient-insurance-view-record',
  templateUrl: './patient-insurance-view-record.component.html',
  styleUrls: ['./patient-insurance-view-record.component.css']
})
export class PatientInsuranceViewRecordComponent implements OnInit {
  InsuranceViewForm: FormGroup;
  requiredViewFile: any = [];
  constructor(private sanitizer: DomSanitizer,public fb: FormBuilder, public popUpDialogRef: MatDialogRef<PatientInsuranceViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.InsuranceViewForm = this.fb.group({
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
        RecordedTime: [''],
      visitDateandTime: ['', Validators.required],
      recordedDuring: ['', Validators.required],
    })
    this.InsuranceViewForm.disable();
    this.setInsureForm();
  }
  dialogClose(): void {
    this.popUpDialogRef.close();
  }
  setInsureForm() {
    this.requiredViewFile = this.data.filePath
    this.setFileData(this.data.filePath)
    this.InsuranceViewForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));                            
    this.InsuranceViewForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.InsuranceViewForm.get('recordedDuring').setValue(this.data.recordedDuring);
    this.InsuranceViewForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.InsuranceViewForm.get('visitDateandTime').setValue(this.data.visitDateandTime);
  }
  setFileData(Filedata) {
    this.requiredViewFile = [];
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
      this.requiredViewFile.push(viewFile);
    }

  }
}
  
