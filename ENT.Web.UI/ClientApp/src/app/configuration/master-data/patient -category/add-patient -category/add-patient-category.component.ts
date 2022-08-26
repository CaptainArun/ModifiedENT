import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { PatientcategoryMastermodel } from "../../../Models/patientCategoryMasterModel"

@Component({
  selector: "app-patient",
  styleUrls: ["./add-patient-category.component.css"],
  templateUrl: './add-patient-category.component.html'
})

export class addPatientcategoryComponent implements OnInit {

  //#region "Property Declaration"
  patienttypeform: FormGroup;
  PatientcategoryMastermodel: PatientcategoryMastermodel = new PatientcategoryMastermodel();
  PatientCategoryID : number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addPatientcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.patienttypeform = this.fb.group({
      PatientCategoryCode : ["", Validators.required],
      PatientCategoryDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.PatientCategoryID  = this.data.PatientCategoryID ;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.patienttypeform.get('PatientCategoryCode').setValue(this.data.PatientCategoryCode);
      this.patienttypeform.get('PatientCategoryDesc').setValue(this.data.PatientCategoryDesc);
      this.patienttypeform.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update patient Type Data"
  submitpatient() {
    if (this.patienttypeform.valid) {
      this.PatientcategoryMastermodel.PatientCategoryID = 0;
      this.PatientcategoryMastermodel.PatientCategoryCode = this.patienttypeform.get("PatientCategoryCode").value;
      this.PatientcategoryMastermodel.PatientCategoryDesc = this.patienttypeform.get("PatientCategoryDesc").value;
      this.PatientcategoryMastermodel.OrderNo = this.patienttypeform.get("OrderNo").value;
      this.configurationservice.savepatientcategory(this.PatientcategoryMastermodel).then((res) => {
        if (res) {
          this.util.showMessage("", "Patient category details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
