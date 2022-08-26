import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { toConsultModel } from "src/app/configuration/Models/toConsultModel";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";

@Component({
  selector: "app-addToConsultComponent",
  styleUrls: ["./add-to-consult.component.css"],
  templateUrl: './add-to-consult.component.html'
})
export class addToConsultComponent implements OnInit {

  //#region "Property Declaration"
  countryForm: FormGroup;
  toConsultModel: toConsultModel = new toConsultModel();
  CountryId: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addToConsultComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.countryForm = this.fb.group({
      countryCode: ["", Validators.required],
      countryDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.CountryId = this.data.CountryId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }
  //#endregion ngOnInit

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.countryForm.get('countryCode').setValue(this.data.CountryCode);
      this.countryForm.get('countryDesc').setValue(this.data.CountryDescription);
      this.countryForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update "
  save() {
    // if (this.countryForm.valid) {

    //   this.toConsultModel.CountryId = this.CountryId;
    //   this.toConsultModel.CountryCode = this.countryForm.get("countryCode").value;
    //   this.toConsultModel.CountryDescription = this.countryForm.get("countryDesc").value;
    //   this.toConsultModel.OrderNo = this.countryForm.get("OrderNo").value;

    //   this.configurationservice.addUpdateCountry(this.toConsultModel).then((res) => {
    //     if (res) {
    //       this.util.showMessage("", "Country details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
    //         .then((res) => {
    //           this.dialogRef.close("Updated");
    //         }
    //         );
    //     }
    //   });
    // }
  }
  //#endregion

  //#region "clear the Form values"
  cleartheForm() {
    this.countryForm.reset();
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
