import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { countryModel } from "../../../Models/countryModel";

@Component({
  selector: "app-addCountryComponent",
  styleUrls: ["./add-country.component.css"],
  templateUrl: './add-country.component.html'
})
export class addCountryComponent implements OnInit {
  
  //#region "Property Declaration"
    countryForm: FormGroup;
    countryModel: countryModel = new countryModel();
    CountryId: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addCountryComponent>,
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
  if (this.countryForm.valid) {

    this.countryModel.CountryId = this.CountryId;
    this.countryModel.CountryCode = this.countryForm.get("countryCode").value;
    this.countryModel.CountryDescription = this.countryForm.get("countryDesc").value;
    this.countryModel.OrderNo = this.countryForm.get("OrderNo").value;
    
    this.configurationservice.addUpdateCountry(this.countryModel).then((res) => {
      if (res) {
        this.util.showMessage("", "Country details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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