import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { SmokingStatusMasterModel } from "src/app/configuration/Models/smokingStatusMasterModel";
import { CustomHttpService } from '../../../../core/custom-http.service';

@Component({
  selector: "app-smokingstatus",
  styleUrls: ["./add-smoking-status.component.css"],
  templateUrl: './add-smoking-status.component.html'
})

export class addSmokingStatusComponent implements OnInit {

  //#region "Property Declaration"
  SmokingTypeForm: FormGroup;
  smokingStatusMasterModel: SmokingStatusMasterModel = new SmokingStatusMasterModel();
  SmokingMasterID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addSmokingStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.SmokingTypeForm = this.fb.group({
      SmokingMasterCode: ["", Validators.required],
      SmokingMasterDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.SmokingMasterID = this.data.SmokingMasterID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.SmokingTypeForm.get('SmokingMasterCode').setValue(this.data.SmokingMasterCode);
      this.SmokingTypeForm.get('SmokingMasterDesc').setValue(this.data.SmokingMasterDesc);
      this.SmokingTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Smoking Type Data"
  submitSalutation() {
    if (this.SmokingTypeForm.valid) {
      this.smokingStatusMasterModel.SmokingMasterID  = 0;
      this.smokingStatusMasterModel.SmokingMasterCode = this.SmokingTypeForm.get("SmokingMasterCode").value;
      this.smokingStatusMasterModel.SmokingMasterDesc = this.SmokingTypeForm.get("SmokingMasterDesc").value;
      this.smokingStatusMasterModel.OrderNo = this.SmokingTypeForm.get("OrderNo").value;
      this.configurationservice.savesmoking(this.smokingStatusMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Smoking Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.SmokingTypeForm.reset();
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
