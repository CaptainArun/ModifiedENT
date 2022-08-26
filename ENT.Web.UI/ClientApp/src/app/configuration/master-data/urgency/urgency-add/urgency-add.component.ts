import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { ConfigurationService } from '../../../configuration.service';
import { UrgencyTypeModel } from '../../../Models/urgencyTypeModel';

@Component({
  selector: 'urgency-add',
  templateUrl: './urgency-add.component.html',
  styleUrls: ['./urgency-add.component.css']
})
export class UrgencyAddComponent implements OnInit {
  // #region "Property Declaration"
  addUrgencyForm: FormGroup;
  urgencyTypeModel: UrgencyTypeModel = new UrgencyTypeModel();
  urgencyId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  // #endregion

  // #region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<UrgencyAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  // #endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addUrgencyForm = this.fb.group({
      UrgencyTypeCode: ["", Validators.required],
      UrgencyTypeDescription: ["", Validators.required],
      UrgencyTypeOrder: ["", Validators.required],
    });
    this.setUrgencyData();

    if (this.data != null) {
      this.urgencyId = this.data.UrgencyTypeId;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setUrgencyData() {
    if (this.data) {
      this.addUrgencyForm.get('UrgencyTypeCode').setValue(this.data.UrgencyTypeCode);
      this.addUrgencyForm.get('UrgencyTypeDescription').setValue(this.data.UrgencyTypeDescription);
      this.addUrgencyForm.get('UrgencyTypeOrder').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  // #region "Save New Data"
  addEditUrgency() {
    if (this.addUrgencyForm.valid) {
      this.urgencyTypeModel.UrgencyTypeId = this.urgencyId;
      this.urgencyTypeModel.UrgencyTypeCode = this.addUrgencyForm.get("UrgencyTypeCode").value;
      this.urgencyTypeModel.UrgencyTypeDescription = this.addUrgencyForm.get("UrgencyTypeDescription").value;
      this.urgencyTypeModel.OrderNo = this.addUrgencyForm.get("UrgencyTypeOrder").value;

      this.configurationService.addUpdateUrgency(this.urgencyTypeModel).then(res => {
        if (res) {
          this.util.showMessage("", "Urgency details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  // #endregion

  // #region "clear the Form values"
  clearForm() {
    this.addUrgencyForm.reset();
    this.setUrgencyData();
  }
  // #endregion

  // #region "To close the Pop up"
  dialogClose(): void {
    this.dialogRef.close();
  }
  // #endregion 

}