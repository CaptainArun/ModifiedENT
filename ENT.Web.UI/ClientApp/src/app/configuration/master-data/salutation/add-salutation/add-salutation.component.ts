import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { SalutationMasterModel } from "src/app/configuration/Models/salutationMasterModel";
import { CustomHttpService } from '../../../../core/custom-http.service';

@Component({
  selector: "app-salutation",
  styleUrls: ["./add-salutation.component.css"],
  templateUrl: './add-salutation.component.html'
})

export class addSalutationComponent implements OnInit {

  //#region "Property Declaration"
  SalutationTypeForm: FormGroup;
  salutationMasterModel: SalutationMasterModel = new SalutationMasterModel();
  SalutationID: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addSalutationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.SalutationTypeForm = this.fb.group({
      SalutationCode: ["", Validators.required],
      SalutationDesc : ["", Validators.required],
      SalutationOrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.SalutationID = this.data.SalutationID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.SalutationTypeForm.get('SalutationCode').setValue(this.data.SalutationCode);
      this.SalutationTypeForm.get('SalutationDesc').setValue(this.data.SalutationDesc);
      this.SalutationTypeForm.get('SalutationOrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Salutation Type Data"
  submitSalutation() {
    if (this.SalutationTypeForm.valid) {
      this.salutationMasterModel.SalutationID  = 0;
      this.salutationMasterModel.SalutationCode = this.SalutationTypeForm.get("SalutationCode").value;
      this.salutationMasterModel.SalutationDesc = this.SalutationTypeForm.get("SalutationDesc").value;
      this.salutationMasterModel.OrderNo = this.SalutationTypeForm.get("SalutationOrderNo").value;

      this.configurationservice.savesalutation(this.salutationMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Salutation Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.SalutationTypeForm.reset();
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
