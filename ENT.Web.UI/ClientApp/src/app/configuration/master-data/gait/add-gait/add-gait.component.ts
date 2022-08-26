import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";

import { GaitMasterModel } from "../../../Models/gaitMasterModel";

@Component({
  selector: "app-addgait",
  styleUrls: ["./add-gait.component.css"],
  templateUrl: './add-gait.component.html'
})
export class GaitAddComponent implements OnInit {
  
    //#region "Property Declaration"
    GaitTypeForm: FormGroup;
    GaitMasterModel: GaitMasterModel = new GaitMasterModel();
    GaitID: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion


      //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<GaitAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion



  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.GaitTypeForm = this.fb.group({
      GaitCode: ["", Validators.required],
      GaitDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.GaitID = this.data.GaitID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.GaitTypeForm.get('GaitCode').setValue(this.data.GaitMasterCode);
      this.GaitTypeForm.get('GaitDesc').setValue(this.data.GaitMasterDesc);
      this.GaitTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
 //#endregion



 //#region "Edit/Update Gait Type Data"
 submitGait() {
  if (this.GaitTypeForm.valid) {
    this.GaitMasterModel.GaitMasterID = 0;
    this.GaitMasterModel.GaitMasterCode = this.GaitTypeForm.get("GaitCode").value;
    this.GaitMasterModel.GaitMasterDesc = this.GaitTypeForm.get("GaitDesc").value;
    this.GaitMasterModel.OrderNo = this.GaitTypeForm.get("OrderNo").value;
    this.configurationservice.saveGait(this.GaitMasterModel).then((res) => {
      if (res) {
        this.util.showMessage("", "Gait Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
  this.GaitTypeForm.reset();
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