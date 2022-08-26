import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { paymentTypeModel } from "../../../Models/paymentTypeModel";

@Component({
  selector: "app-addPaymentTypeComponent",
  styleUrls: ["./add-payment-type.component.css"],
  templateUrl: './add-payment-type.component.html'
})
export class addPaymentTypeComponent implements OnInit {
  
//#region "Property Declaration"
    paymentTypeForm: FormGroup;
    paymentTypeModel: paymentTypeModel = new paymentTypeModel();
    PaymentTypeId: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion

//#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addPaymentTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) { 
  }
  //#endregion

//#region "ngOnInit"
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.paymentTypeForm = this.fb.group({
      PaymentTypeCode: ["", Validators.required],
      PaymentTypeDescription: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.PaymentTypeId = this.data.PaymentTypeId;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }
//#endregion "ngOnInit"

//#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.paymentTypeForm.get('PaymentTypeCode').setValue(this.data.PaymentTypeCode);
      this.paymentTypeForm.get('PaymentTypeDescription').setValue(this.data.PaymentTypeDescription);
      this.paymentTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
 //#endregion

//#region "Edit/Update"
 save() {
  if (this.paymentTypeForm.valid) {

    this.paymentTypeModel.PaymentTypeId = this.PaymentTypeId;
    this.paymentTypeModel.PaymentTypeCode = this.paymentTypeForm.get("PaymentTypeCode").value;
    this.paymentTypeModel.PaymentTypeDescription = this.paymentTypeForm.get("PaymentTypeDescription").value;
    this.paymentTypeModel.OrderNo = this.paymentTypeForm.get("OrderNo").value;
    
    this.configurationservice.addUpdatePaymentType(this.paymentTypeModel).then((res) => {
      if (res) {
        this.util.showMessage("", "Payment Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
  this.paymentTypeForm.reset();
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