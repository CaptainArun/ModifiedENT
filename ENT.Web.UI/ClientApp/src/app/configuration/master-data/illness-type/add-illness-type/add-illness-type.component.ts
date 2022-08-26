import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { illnessTypeMasterModel } from "src/app/configuration/Models/illnessTypeMasterModel";

@Component({
  selector: "app-illnessstatus",
  styleUrls: ["./add-illness-type.component.css"],
  templateUrl: './add-illness-type.component.html'
})

export class addIllnessTypeComponent implements OnInit {

  //#region "Property Declaration"
  IllnessTypeForm: FormGroup;
  illnessTypeMasterModel: illnessTypeMasterModel = new illnessTypeMasterModel();
  IllnessTypeID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addIllnessTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.IllnessTypeForm = this.fb.group({
      IllnessTypeCode: ["", Validators.required],
      IllnessTypeDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.IllnessTypeID = this.data.IllnessTypeID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.IllnessTypeForm.get('IllnessTypeCode').setValue(this.data.IllnessTypeCode);
      this.IllnessTypeForm.get('IllnessTypeDesc').setValue(this.data.IllnessTypeDesc);
      this.IllnessTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Illness Type Data"
  submitIllness() {
    if (this.IllnessTypeForm.valid) {
      this.illnessTypeMasterModel.IllnessTypeID  = 0;
      this.illnessTypeMasterModel.IllnessTypeCode = this.IllnessTypeForm.get("IllnessTypeCode").value;
      this.illnessTypeMasterModel.IllnessTypeDesc = this.IllnessTypeForm.get("IllnessTypeDesc").value;
      this.illnessTypeMasterModel.OrderNo = this.IllnessTypeForm.get("OrderNo").value;
      this.configurationservice.saveillness(this.illnessTypeMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Illness Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.IllnessTypeForm.reset();
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
