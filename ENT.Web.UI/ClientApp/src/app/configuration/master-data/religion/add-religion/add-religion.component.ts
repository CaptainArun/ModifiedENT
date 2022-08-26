import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { ReligionMasterModel } from "../../../Models/religionMasterModel";

@Component({
  selector: "app-religion",
  styleUrls: ["./add-religion.component.css"],
  templateUrl: './add-religion.component.html'
})

export class addReligionComponent implements OnInit {

  //#region "Property Declaration"
  ReligionTypeForm: FormGroup;
  ReligionMasterModel: ReligionMasterModel = new ReligionMasterModel();
  ReligionID : number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addReligionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.ReligionTypeForm = this.fb.group({
      ReligionCode: ["", Validators.required],
      ReligionDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.ReligionID = this.data.ReligionID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.ReligionTypeForm.get('ReligionCode').setValue(this.data.ReligionCode);
      this.ReligionTypeForm.get('ReligionDesc').setValue(this.data.ReligionDesc);
      this.ReligionTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Religion Type Data"
  submitReligion() {
    if (this.ReligionTypeForm.valid) {
      this.ReligionMasterModel.ReligionID = 0;
      this.ReligionMasterModel.ReligionCode = this.ReligionTypeForm.get("ReligionCode").value;
      this.ReligionMasterModel.ReligionDesc = this.ReligionTypeForm.get("ReligionDesc").value;
      this.ReligionMasterModel.OrderNo = this.ReligionTypeForm.get("OrderNo").value;
      this.configurationservice.savereligion(this.ReligionMasterModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Religion Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.ReligionTypeForm.reset();
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
