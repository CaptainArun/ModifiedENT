import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { ConfigurationService } from '../../../configuration.service';
import { PatientArrivalConditionModel } from '../../../Models/patientArrivalConditionModel';

@Component({
  selector: 'patient-arrival-condition-add',
  templateUrl: './patient-arrival-condition-add.component.html',
  styleUrls: ['./patient-arrival-condition-add.component.css']
})
export class PatientArrivalConditionAddComponent implements OnInit {
  // #region "Property Declaration"
  addPatientArrivalConditionForm: FormGroup;
  patientArrivalConditionModel: PatientArrivalConditionModel = new PatientArrivalConditionModel();
  patientArrivalConditionId: number = 0;
  showName: string = "Add";
  isReadOnly: boolean = false;
  // #endregion

  // #region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<PatientArrivalConditionAddComponent>, @Inject(MAT_DIALOG_DATA) public data, public configurationService: ConfigurationService, private util: UtilService) { }
  // #endregion

  // #region "ngOnInit"
  ngOnInit() {
    this.addPatientArrivalConditionForm = this.fb.group({
      PatientArrivalConditionCode: ["", Validators.required],
      PatientArrivalConditionDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setPatientArrivalConditionData();

    if (this.data != null) {
      this.patientArrivalConditionId = this.data.PatientArrivalConditionId;
      this.showName = "Edit";
      this.isReadOnly = true;
    }
  }
  // #endregion

  //#region "set Values For Form"
  setPatientArrivalConditionData() {
    if (this.data) {
      this.addPatientArrivalConditionForm.get('PatientArrivalConditionCode').setValue(this.data.Patientarrivalconditioncode);
      this.addPatientArrivalConditionForm.get('PatientArrivalConditionDescription').setValue(this.data.PatientArrivalconditionDescription);
      this.addPatientArrivalConditionForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  // #region "Save New Data"
  addEditPatientArrivalCondition() {
    if (this.addPatientArrivalConditionForm.valid) {
      this.patientArrivalConditionModel.PatientArrivalConditionId = this.patientArrivalConditionId;
      this.patientArrivalConditionModel.Patientarrivalconditioncode = this.addPatientArrivalConditionForm.get("PatientArrivalConditionCode").value;
      this.patientArrivalConditionModel.PatientArrivalconditionDescription = this.addPatientArrivalConditionForm.get("PatientArrivalConditionDescription").value;
      this.patientArrivalConditionModel.OrderNo = this.addPatientArrivalConditionForm.get("OrderNo").value;

      this.configurationService.addUpdatePatientArrivalCondition(this.patientArrivalConditionModel).then(res => {
        if (res) {
          this.util.showMessage("", "Patient arrival condition details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(res => {

          });
          this.dialogRef.close("Updated");
        }
      });
    }
  }
  // #endregion

  // #region "clear the Form values"
  clearForm() {
    this.addPatientArrivalConditionForm.reset();
    this.setPatientArrivalConditionData();
  }
  // #endregion

  // #region "To close the Pop up"
  dialogClose(): void {
    this.dialogRef.close();
  }
  // #endregion 

}