import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { PatientTypeMastermodel } from "../../../Models/patientTypeMasterModel"

@Component({
  selector: "app-patient",
  styleUrls: ["./add-patient-type.component.css"],
  templateUrl: './add-patient-type.component.html'
})

export class addPatientTypeComponent implements OnInit {

  //#region "Property Declaration"
  patienttypeform: FormGroup;
  patientTypeMastermodel: PatientTypeMastermodel = new PatientTypeMastermodel();
  PatientTypeID : number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addPatientTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.patienttypeform = this.fb.group({
      PatientTypeCode : ["", Validators.required],
      PatientTypeDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.PatientTypeID  = this.data.PatientTypeID ;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.patienttypeform.get('PatientTypeCode').setValue(this.data.PatientTypeCode);
      this.patienttypeform.get('PatientTypeDesc').setValue(this.data.PatientTypeDesc);
      this.patienttypeform.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update patient Type Data"
  submitpatient() {
    if (this.patienttypeform.valid) {
      this.patientTypeMastermodel.PatientTypeID  = 0;
      this.patientTypeMastermodel.PatientTypeCode = this.patienttypeform.get("PatientTypeCode").value;
      this.patientTypeMastermodel.PatientTypeDesc = this.patienttypeform.get("PatientTypeDesc").value;
      this.patientTypeMastermodel.OrderNo = this.patienttypeform.get("OrderNo").value;
      this.configurationservice.savepatienttype(this.patientTypeMastermodel).then((res) => {
        if (res) {
          this.util.showMessage("", "Patient Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
            .then((res) => {
              this.dialogRef.close("Updated");

            }
            );
        }
      });
    }
  }
  //#endregion

  //#region "clear the Form values"
  cleartheForm() {
    this.patienttypeform.reset();
    this.setValuesForForm();
  }
  //#endregion 

  //#region "To close the Pop up"
  //To close the Pop up
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion    
}
