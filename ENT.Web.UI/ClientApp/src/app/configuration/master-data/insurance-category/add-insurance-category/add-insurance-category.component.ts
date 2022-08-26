import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { InsuranceCategoryMasterModel } from "src/app/configuration/Models/insurancecategoryMasterModel";

@Component({
  selector: "app-insurance",
  styleUrls: ["./add-insurance-category.component.css"],
  templateUrl: './add-insurance-category.component.html'
})

export class addInsuranceCategoryComponent implements OnInit {

  //#region "Property Declaration"
  InsuranceTypeForm: FormGroup;
  insuranceCategoryMasterModel: InsuranceCategoryMasterModel = new InsuranceCategoryMasterModel();
  InsuranceCategoryID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addInsuranceCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.InsuranceTypeForm = this.fb.group({
      InsuranceCategoryCode: ["", Validators.required],
      InsuranceCategoryDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.InsuranceCategoryID = this.data.InsuranceCategoryID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.InsuranceTypeForm.get('InsuranceCategoryCode').setValue(this.data.InsuranceCategoryCode);
      this.InsuranceTypeForm.get('InsuranceCategoryDesc').setValue(this.data.InsuranceCategoryDesc);
      this.InsuranceTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Insurance Type Data"
  submitInsurance() {
    if (this.InsuranceTypeForm.valid) {
      this.insuranceCategoryMasterModel.InsuranceCategoryID = 0;
      this.insuranceCategoryMasterModel.InsuranceCategoryCode = this.InsuranceTypeForm.get("InsuranceCategoryCode").value;
      this.insuranceCategoryMasterModel.InsuranceCategoryDesc = this.InsuranceTypeForm.get("InsuranceCategoryDesc").value;
      this.insuranceCategoryMasterModel.OrderNo = this.InsuranceTypeForm.get("OrderNo").value;
      this.configurationservice.saveInsurancecategory(this.insuranceCategoryMasterModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Insurance Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.InsuranceTypeForm.reset();
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
