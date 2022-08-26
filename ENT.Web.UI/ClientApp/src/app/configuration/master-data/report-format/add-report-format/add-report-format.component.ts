import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { CustomHttpService } from '../../../../core/custom-http.service';
import { reportFormatMasterModel } from "src/app/configuration/Models/reportformatMasterModel";

@Component({
  selector: "app-reportstatus",
  styleUrls: ["./add-report-format.component.css"],
  templateUrl: './add-report-format.component.html'
})

export class addReportFormatComponent implements OnInit {

  //#region "Property Declaration"
  ReportTypeForm: FormGroup;
  reportFormatMasterModel: reportFormatMasterModel = new reportFormatMasterModel();
  ReportFormatID : number = 0;
  showvalue: string = "Add";
  isReadOnly: boolean = false;
  //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addReportFormatComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice: ConfigurationService,
    public CustHttp: CustomHttpService,
    private util: UtilService,) {
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.ReportTypeForm = this.fb.group({
      ReportFormatCode : ["", Validators.required],
      ReportFormatDesc  : ["", Validators.required],
      OrderNo : ["", Validators.required],
    });
    this.setValuesForForm();

    if (this.data != null) {
      this.ReportFormatID  = this.data.ReportFormatID ;
      this.showvalue = "Edit";
      this.isReadOnly = true;
    }
  }

  //#region "set Values For Form"
  setValuesForForm() {
    if (this.data) {
      this.ReportTypeForm.get('ReportFormatCode').setValue(this.data.ReportFormatCode );
      this.ReportTypeForm.get('ReportFormatDesc').setValue(this.data.ReportFormatDesc );
      this.ReportTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    }
  }
  //#endregion

  //#region "Edit/Update Illness Type Data"
  submitReport() {
    if (this.ReportTypeForm.valid) {
      this.reportFormatMasterModel.ReportFormatID   = 0;
      this.reportFormatMasterModel.ReportFormatCode  = this.ReportTypeForm.get("ReportFormatCode").value;
      this.reportFormatMasterModel.ReportFormatDesc  = this.ReportTypeForm.get("ReportFormatDesc").value;
      this.reportFormatMasterModel.OrderNo = this.ReportTypeForm.get("OrderNo").value;
      this.configurationservice.saveReport(this.reportFormatMasterModel).then((res) => {
          if (res) {
            this.util.showMessage("","Report Type details saved successfully",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.MessageBox)
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
    this.ReportTypeForm.reset();
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
