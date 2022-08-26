import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
//import { referredLabMasterModel } from "src/app/configuration/Models/referredLabMasterModel";
import { referredLabMasterModel } from "src/app/configuration/Models/referredLabMasterModel";

@Component({
  selector: "app-referredstatus",
  styleUrls: ["./add-referred-lab.component.css"],
  templateUrl: './add-referred-lab.component.html'
})

export class addReferredLabComponent implements OnInit {

  //#region "Property Declaration"
  ReferredTypeForm: FormGroup;
  referredLabMasterModel: referredLabMasterModel = new referredLabMasterModel();
  ReferredLabID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addReferredLabComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.ReferredTypeForm = this.fb.group({
      ReferredLabCode: ["", Validators.required],
      ReferredLabDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.ReferredLabID = this.data.ReferredLabID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.ReferredTypeForm.get('ReferredLabCode').setValue(this.data.ReferredLabCode);
      this.ReferredTypeForm.get('ReferredLabDesc').setValue(this.data.ReferredLabDesc);
      this.ReferredTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Illness Type Data"
  submitReferred() {
    if (this.ReferredTypeForm.valid) {
      this.referredLabMasterModel.ReferredLabID  = 0;
      this.referredLabMasterModel.ReferredLabCode = this.ReferredTypeForm.get("ReferredLabCode").value;
      this.referredLabMasterModel.ReferredLabDesc = this.ReferredTypeForm.get("ReferredLabDesc").value;
      this.referredLabMasterModel.OrderNo = this.ReferredTypeForm.get("OrderNo").value;
      this.configurationservice.saveReferred(this.referredLabMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Referred Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.ReferredTypeForm.reset();
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
