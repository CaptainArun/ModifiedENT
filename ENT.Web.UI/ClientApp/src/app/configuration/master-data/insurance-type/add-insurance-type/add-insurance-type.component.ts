import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { InsuranceTypeMasterModel } from "src/app/configuration/Models/insurancetypeMasterModel";

@Component({
  selector: "app-insurance",
  styleUrls: ["./add-insurance-type.component.css"],
  templateUrl: './add-insurance-type.component.html'
})

export class addInsuranceTypeComponent implements OnInit {

  //#region "Property Declaration"
  InsuranceTypeForm: FormGroup;
  insuranceTypeMasterModel: InsuranceTypeMasterModel = new InsuranceTypeMasterModel();
  InsuranceTypeID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addInsuranceTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregionInsuranceCategoryCode

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.InsuranceTypeForm = this.fb.group({
      InsuranceTypeCode: ["", Validators.required],
      InsuranceTypeDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.InsuranceTypeID = this.data.InsuranceTypeID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.InsuranceTypeForm.get('InsuranceTypeCode').setValue(this.data.InsuranceTypeCode);
      this.InsuranceTypeForm.get('InsuranceTypeDesc').setValue(this.data.InsuranceTypeDesc);
      this.InsuranceTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Insurance Type Data"
  submitInsurance() {
    if (this.InsuranceTypeForm.valid) {
      this.insuranceTypeMasterModel.InsuranceTypeID = 0;
      this.insuranceTypeMasterModel.InsuranceTypeCode = this.InsuranceTypeForm.get("InsuranceTypeCode").value;
      this.insuranceTypeMasterModel.InsuranceTypeDesc = this.InsuranceTypeForm.get("InsuranceTypeDesc").value;
      this.insuranceTypeMasterModel.OrderNo = this.InsuranceTypeForm.get("OrderNo").value;
      this.configurationservice.saveInsurancetype(this.insuranceTypeMasterModel).then((res) => {
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
