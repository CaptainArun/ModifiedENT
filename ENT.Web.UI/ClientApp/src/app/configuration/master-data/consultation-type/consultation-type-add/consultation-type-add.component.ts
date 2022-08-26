import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { ConfigurationService } from '../../../configuration.service';
import { ConsultationTypeModel } from '../../../Models/consultationTypeModel';

@Component({
  selector: 'consultation-type-add',
  templateUrl: './consultation-type-add.component.html',
  styleUrls: ['./consultation-type-add.component.css']
})
export class ConsultationTypeAddComponent implements OnInit {
  // #region "Property Declaration"
  addConsultationTypeForm: FormGroup;
  consultationTypeModel: ConsultationTypeModel = new ConsultationTypeModel();
  consultationTypeId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  // #endregion

  // #region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ConsultationTypeAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  // #endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addConsultationTypeForm = this.fb.group({
      ConsultationTypeCode: ["", Validators.required],
      ConsultationTypeDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setConsultationTypeData();

    if (this.data != null) {
      this.consultationTypeId = this.data.ConsultationTypeId;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setConsultationTypeData() {
    if (this.data) {
    this.addConsultationTypeForm.get('ConsultationTypeCode').setValue(this.data.ConsultationTypeCode);
    this.addConsultationTypeForm.get('ConsultationTypeDescription').setValue(this.data.ConsultationTypeDescription);
    this.addConsultationTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  // #region "Save New Data"
  addEditConsultationType() {
    if (this.addConsultationTypeForm.valid) {
      this.consultationTypeModel.ConsultationTypeId = this.consultationTypeId;
      this.consultationTypeModel.ConsultationTypeCode = this.addConsultationTypeForm.get("ConsultationTypeCode").value;
      this.consultationTypeModel.ConsultationTypeDescription = this.addConsultationTypeForm.get("ConsultationTypeDescription").value;
      this.consultationTypeModel.OrderNo = this.addConsultationTypeForm.get("OrderNo").value;

      this.configurationService.addUpdateConsultationType(this.consultationTypeModel).then(res => {
        if (res) {
          this.util.showMessage("", "Consultation type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  // #endregion

  // #region "clear the Form values"
  clearForm() {
    this.addConsultationTypeForm.reset();
    this.setConsultationTypeData();
  }
  // #endregion

  // #region "To close the Pop up"
  dialogClose(): void {
    this.dialogRef.close();
  }
  // #endregion    

}