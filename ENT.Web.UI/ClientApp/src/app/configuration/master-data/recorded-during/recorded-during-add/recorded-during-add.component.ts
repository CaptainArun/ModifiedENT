import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { ConfigurationService } from '../../../configuration.service';
import { RecordedDuringModel } from '../../../Models/recordedDuringModel';

@Component({
  selector: 'recorded-during-add',
  templateUrl: './recorded-during-add.component.html',
  styleUrls: ['./recorded-during-add.component.css']
})
export class RecordedDuringAddComponent implements OnInit {
  // #region "Property Declaration"
  addRecordedDuringForm: FormGroup;
  recordedDuringModel: RecordedDuringModel = new RecordedDuringModel();
  recordedDuringId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  // #endregion

  // #region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<RecordedDuringAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  // #endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addRecordedDuringForm = this.fb.group({
      RecordedDuringCode: ["", Validators.required],
      RecordedDuringDescription: ["", Validators.required],
      RecordedDuringOrder: ["", Validators.required],
    });
    this.setRecordedDuringData();

    if (this.data != null) {
      this.recordedDuringId = this.data.RecordedDuringId;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setRecordedDuringData() {
    if (this.data) {
      this.addRecordedDuringForm.get('RecordedDuringCode').setValue(this.data.RecordedDuringCode);
      this.addRecordedDuringForm.get('RecordedDuringDescription').setValue(this.data.RecordedDuringDescription);
      this.addRecordedDuringForm.get('RecordedDuringOrder').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  // #region "Save New Data"
  addEditRecordedDuring() {
    if (this.addRecordedDuringForm.valid) {
      this.recordedDuringModel.RecordedDuringId = this.recordedDuringId;
      this.recordedDuringModel.RecordedDuringCode = this.addRecordedDuringForm.get("RecordedDuringCode").value;
      this.recordedDuringModel.RecordedDuringDescription = this.addRecordedDuringForm.get("RecordedDuringDescription").value;
      this.recordedDuringModel.OrderNo = this.addRecordedDuringForm.get("RecordedDuringOrder").value;

      this.configurationService.addUpdateRecordedDuring(this.recordedDuringModel).then(res => {
        if (res) {
          this.util.showMessage("", "Recorded during details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  // #endregion

  // #region "clear the Form values"
  clearForm() {
    this.addRecordedDuringForm.reset();
    this.setRecordedDuringData();
  }
  // #endregion

  // #region "To close the Pop up"
  dialogClose(): void {
    this.dialogRef.close();
  }
  // #endregion 

}