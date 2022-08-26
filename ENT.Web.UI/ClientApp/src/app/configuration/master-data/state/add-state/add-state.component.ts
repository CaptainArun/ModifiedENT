import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";

import { stateModel } from "../../../Models/stateModel";

@Component({
  selector: "app-addStateComponent",
  styleUrls: ["./add-state.component.css"],
  templateUrl: './add-state.component.html'
})
export class addStateComponent implements OnInit {
  
//#region "Property Declaration"
    stateForm: FormGroup;
    stateModel: stateModel = new stateModel();
    StateId: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

//#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

//#region "ngOnInit"
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.stateForm = this.fb.group({
      StateCode: ["", Validators.required],
      StateDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.StateId = this.data.StateId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }
//#endregion "ngOnInit"

//#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.stateForm.get('StateCode').setValue(this.data.StateCode);
      this.stateForm.get('StateDescription').setValue(this.data.StateDescription);
      this.stateForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
 //#endregion

//#region "Edit/Update"
 save() {
  if (this.stateForm.valid) {

    this.stateModel.StateId =  this.StateId;
    this.stateModel.StateCode = this.stateForm.get("StateCode").value;
    this.stateModel.StateDescription = this.stateForm.get("StateDescription").value;
    this.stateModel.OrderNo = this.stateForm.get("OrderNo").value;

    this.configurationservice.addUpdateState(this.stateModel).then((res) => {
      if (res) {
        this.util.showMessage("", "state details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
  this.stateForm.reset();
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