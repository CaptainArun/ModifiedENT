import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { GenderMasterModel } from "src/app/configuration/Models/GenderMasterModel";

@Component({
  selector: "app-gender",
  styleUrls: ["./add-gender.component.css"],
  templateUrl: './add-gender.component.html'
})

export class addGenderComponent implements OnInit {

  //#region "Property Declaration"
  GenderTypeForm: FormGroup;
  genderMasterModel: GenderMasterModel = new GenderMasterModel();
  GenderID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addGenderComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.GenderTypeForm = this.fb.group({
      GenderCode: ["", Validators.required],
      GenderDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.GenderID = this.data.GenderID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.GenderTypeForm.get('GenderCode').setValue(this.data.GenderCode);
      this.GenderTypeForm.get('GenderDesc').setValue(this.data.GenderDesc);
      this.GenderTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Gender Type Data"
  submitGender() {
    if (this.GenderTypeForm.valid) {
      this.genderMasterModel.GenderID = 0;
      this.genderMasterModel.GenderCode = this.GenderTypeForm.get("GenderCode").value;
      this.genderMasterModel.GenderDesc = this.GenderTypeForm.get("GenderDesc").value;
      this.genderMasterModel.OrderNo = this.GenderTypeForm.get("OrderNo").value;
      this.configurationservice.saveGender(this.genderMasterModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Gender Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.GenderTypeForm.reset();
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
