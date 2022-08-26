import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { ConfigurationService } from '../../../configuration.service';
import { VisitStatusModel } from '../../../Models/visitStatusModel';

@Component({
  selector: 'visit-status-add',
  templateUrl: './visit-status-add.component.html',
  styleUrls: ['./visit-status-add.component.css']
})
export class VisitStatusAddComponent implements OnInit {
  // #region "Property Declaration"
  addVisitStatusForm: FormGroup;
  visitStatusModel: VisitStatusModel = new VisitStatusModel();
  visitStatusId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  // #endregion

  // #region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<VisitStatusAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  // #endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addVisitStatusForm = this.fb.group({
      VisitStatusCode: ["", Validators.required],
      VisitStatusDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setVisitStatusData();

    if (this.data != null) {
      this.visitStatusId = this.data.VisitStatusId;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setVisitStatusData() {
    if (this.data) {
      this.addVisitStatusForm.get('VisitStatusCode').setValue(this.data.VisitStatusCode);
      this.addVisitStatusForm.get('VisitStatusDescription').setValue(this.data.VisitStatusDescription);
      this.addVisitStatusForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  // #region "Save New Data"
  addEditVisitStatus() {
    if (this.addVisitStatusForm.valid) {
      this.visitStatusModel.VisitStatusId = this.visitStatusId;
      this.visitStatusModel.VisitStatusCode = this.addVisitStatusForm.get("VisitStatusCode").value;
      this.visitStatusModel.VisitStatusDescription = this.addVisitStatusForm.get("VisitStatusDescription").value;
      this.visitStatusModel.OrderNo = this.addVisitStatusForm.get("OrderNo").value;

      this.configurationService.addUpdateVisitStatus(this.visitStatusModel).then(res => {
        if (res) {
          this.util.showMessage("", "Visit status details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  // #endregion

  // #region "clear the Form values"
  clearForm() {
    this.addVisitStatusForm.reset();
    this.setVisitStatusData();
  }
  // #endregion

  // #region "To close the Pop up"
  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }
  // #endregion    

}