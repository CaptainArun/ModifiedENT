import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { addressTypeModel } from "src/app/configuration/Models/addressTypeModel";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";

@Component({
  selector: "app-addAddressTypeComponent",
  styleUrls: ["./add-address-type.component.css"],
  templateUrl: './add-address-type.component.html'
})
export class addAddressTypeComponent implements OnInit {

  //#region "Property Declaration"
  AddressTypeTypeForm: FormGroup;
  addressTypeModel: addressTypeModel = new addressTypeModel();
  AddressTypeId: number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addAddressTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.AddressTypeTypeForm = this.fb.group({
      AddressTypeCode: ["", Validators.required],
      AddressTypeDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.AddressTypeId = this.data.AddressTypeId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }
  //#endregion "ngOnInit"

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.AddressTypeTypeForm.get('AddressTypeCode').setValue(this.data.AddressTypeCode);
      this.AddressTypeTypeForm.get('AddressTypeDesc').setValue(this.data.AddressTypeDescription);
      this.AddressTypeTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update AddressType Type Data"
  submitAddressType() {
    if (this.AddressTypeTypeForm.valid) {

      this.addressTypeModel.AddressTypeId = this.AddressTypeId;
      this.addressTypeModel.AddressTypeCode = this.AddressTypeTypeForm.get("AddressTypeCode").value;
      this.addressTypeModel.AddressTypeDescription = this.AddressTypeTypeForm.get("AddressTypeDesc").value;
      this.addressTypeModel.OrderNo = this.AddressTypeTypeForm.get("OrderNo").value;

      this.configurationservice.addUpdateAddressType(this.addressTypeModel).then((res) => {
        if (res) {
          this.util.showMessage("", "Address Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
    this.AddressTypeTypeForm.reset();
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
