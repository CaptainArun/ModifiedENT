import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { FamilyHistoryStatusMasterModel } from "src/app/configuration/Models/familyHistoryStatusMasterModel";

@Component({
  selector: "app-familyhistorystatus",
  styleUrls: ["./add-family-history-status.component.css"],
  templateUrl: './add-family-history-status.component.html'
})

export class addFamilyHistoryStatusComponent implements OnInit {

  //#region "Property Declaration"
  FamilyTypeForm: FormGroup;
  familyHistoryStatusMasterModel: FamilyHistoryStatusMasterModel = new FamilyHistoryStatusMasterModel();
  FamilyHistoryStatusID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addFamilyHistoryStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.FamilyTypeForm = this.fb.group({
      FamilyHistoryStatusCode: ["", Validators.required],
      FamilyHistoryStatusDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.FamilyHistoryStatusID = this.data.FamilyHistoryStatusID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data != null) {
      this.FamilyTypeForm.get('FamilyHistoryStatusCode').setValue(this.data.FamilyHistoryStatusCode);
      this.FamilyTypeForm.get('FamilyHistoryStatusDesc').setValue(this.data.FamilyHistoryStatusDesc);
      this.FamilyTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update FamilyHistoryStatus Type Data"
  submitFamily() {
    if (this.FamilyTypeForm.valid) {
      this.familyHistoryStatusMasterModel.FamilyHistoryStatusID  = 0;
      this.familyHistoryStatusMasterModel.FamilyHistoryStatusCode = this.FamilyTypeForm.get("FamilyHistoryStatusCode").value;
      this.familyHistoryStatusMasterModel.FamilyHistoryStatusDesc = this.FamilyTypeForm.get("FamilyHistoryStatusDesc").value;
      this.familyHistoryStatusMasterModel.OrderNo = this.FamilyTypeForm.get("OrderNo").value;
      this.configurationservice.savefamily(this.familyHistoryStatusMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","family history Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.FamilyTypeForm.reset();
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
