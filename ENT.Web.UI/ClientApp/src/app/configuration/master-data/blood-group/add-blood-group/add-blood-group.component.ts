import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { BloodGroupMasterModel } from '../../../Models/bloodGroupMasterModel';

@Component({
  selector: "app-Bloodgroup",
  styleUrls: ["./add-Blood-group.component.css"],
  templateUrl: './add-Blood-group.component.html'
})

export class addBloodGroupComponent implements OnInit {

  //#region "Property Declaration"
  bloodgroupForm: FormGroup;
  BloodGroupMasterModel: BloodGroupMasterModel = new BloodGroupMasterModel();
  BloodGroupID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addBloodGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.bloodgroupForm = this.fb.group({
      BloodGroupCode: ["", Validators.required],
      BloodGroupDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.BloodGroupID  = this.data.BloodGroupID ;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.bloodgroupForm.get('BloodGroupCode').setValue(this.data.BloodGroupCode);
      this.bloodgroupForm.get('BloodGroupDesc').setValue(this.data.BloodGroupDesc);
      this.bloodgroupForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Blood Type Data"
  submitBlood() {
    if (this.bloodgroupForm.valid) {
      this.BloodGroupMasterModel.BloodGroupID   = 0;
      this.BloodGroupMasterModel.BloodGroupCode = this.bloodgroupForm.get("BloodGroupCode").value;
      this.BloodGroupMasterModel.BloodGroupDesc = this.bloodgroupForm.get("BloodGroupDesc").value;
      this.BloodGroupMasterModel.OrderNo = this.bloodgroupForm.get("OrderNo").value;
      this.configurationservice.savebloodgroup(this.BloodGroupMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Blood group details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.bloodgroupForm.reset();
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
