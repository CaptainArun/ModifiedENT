import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { DrinkingStatusMasterModel } from "src/app/configuration/Models/drinkingStatusMasterModel";

@Component({
  selector: "app-drinkingstatus",
  styleUrls: ["./add-drinking-status.component.css"],
  templateUrl: './add-drinking-status.component.html'
})

export class addDrinkingStatusComponent implements OnInit {

  //#region "Property Declaration"
  DrinkingTypeForm: FormGroup;
  drinkingStatusMasterModel: DrinkingStatusMasterModel = new DrinkingStatusMasterModel();
  DrinkingMasterID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addDrinkingStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.DrinkingTypeForm = this.fb.group({
      DrinkingMasterCode: ["", Validators.required],
      DrinkingMasterDesc : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.DrinkingMasterID = this.data.DrinkingMasterID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.DrinkingTypeForm.get('DrinkingMasterCode').setValue(this.data.DrinkingMasterCode);
      this.DrinkingTypeForm.get('DrinkingMasterDesc').setValue(this.data.DrinkingMasterDesc);
      this.DrinkingTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Drinking Type Data"
  submitDrinking() {
    if (this.DrinkingTypeForm.valid) {
      this.drinkingStatusMasterModel.DrinkingMasterID  = 0;
      this.drinkingStatusMasterModel.DrinkingMasterCode = this.DrinkingTypeForm.get("DrinkingMasterCode").value;
      this.drinkingStatusMasterModel.DrinkingMasterDesc = this.DrinkingTypeForm.get("DrinkingMasterDesc").value;
      this.drinkingStatusMasterModel.OrderNo = this.DrinkingTypeForm.get("OrderNo").value;
      this.configurationservice.savedrinking(this.drinkingStatusMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Drinking Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.DrinkingTypeForm.reset();
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
