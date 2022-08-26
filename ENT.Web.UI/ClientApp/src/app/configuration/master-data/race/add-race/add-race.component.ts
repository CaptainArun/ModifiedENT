import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { RaceMasterModel } from "../../../Models/RaceMasterModel";

@Component({
  selector: "app-race",
  styleUrls: ["./add-race.component.css"],
  templateUrl: './add-race.component.html'
})

export class addRaceComponent implements OnInit {

  //#region "Property Declaration"
  RaceTypeForm: FormGroup;
  RaceMasterModel: RaceMasterModel = new RaceMasterModel();
  RaceID : number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addRaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.RaceTypeForm = this.fb.group({
      RaceCode: ["", Validators.required],
      RaceDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.RaceID = this.data.RaceID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.RaceTypeForm.get('RaceCode').setValue(this.data.RaceCode);
      this.RaceTypeForm.get('RaceDesc').setValue(this.data.RaceDesc);
      this.RaceTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Race Type Data"
  submitRace() {
    if (this.RaceTypeForm.valid) {
      this.RaceMasterModel.RaceID = 0;
      this.RaceMasterModel.RaceCode = this.RaceTypeForm.get("RaceCode").value;
      this.RaceMasterModel.RaceDesc = this.RaceTypeForm.get("RaceDesc").value;
      this.RaceMasterModel.OrderNo = this.RaceTypeForm.get("OrderNo").value;
      this.configurationservice.saverace(this.RaceMasterModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Race Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.RaceTypeForm.reset();
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
