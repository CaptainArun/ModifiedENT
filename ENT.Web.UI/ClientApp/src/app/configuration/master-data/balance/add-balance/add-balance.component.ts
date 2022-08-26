import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { BalanceMasterModel } from "../../../Models/balanceMasterModel";


@Component({
  selector: "app-addbalance",
  styleUrls: ["./add-balance.component.css"],
  templateUrl: './add-balance.component.html'
})
export class BalanceAddComponent implements OnInit {
  
    //#region "Property Declaration"
    BalanceTypeForm: FormGroup;
    BalanceMasterModel: BalanceMasterModel=new BalanceMasterModel();
    BalanceID: number = 0;
    showvalue: string = "Add";
    isReadOnly: boolean = false;
    //#endregion


      //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<BalanceAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion



  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.BalanceTypeForm = this.fb.group({
      BalanceCode: ["", Validators.required],
      BalanceDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.BalanceID = this.data.BalanceID;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.BalanceTypeForm.get('BalanceCode').setValue(this.data.FCBalanceCode );
      this.BalanceTypeForm.get('BalanceDesc').setValue(this.data.FCBalanceDesc );
      this.BalanceTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
 //#endregion



 //#region "Edit/Update Balance Type Data"
 submitBalance() {
  if (this.BalanceTypeForm.valid) {
    this.BalanceMasterModel.FCBalanceID = 0;
    this.BalanceMasterModel.FCBalanceCode  = this.BalanceTypeForm.get("BalanceCode").value;
    this.BalanceMasterModel.FCBalanceDesc  = this.BalanceTypeForm.get("BalanceDesc").value;
    this.BalanceMasterModel.OrderNo = this.BalanceTypeForm.get("OrderNo").value;
    this.configurationservice.saveBalance(this.BalanceMasterModel).then((res) => {
      if (res) {
        this.util.showMessage("", "Balance Type details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
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
  this.BalanceTypeForm.reset();
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