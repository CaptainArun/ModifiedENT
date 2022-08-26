import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { severityMasterModel } from "../../../Models/severityMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addseverityComponent",
    styleUrls: ["./add-severity.component.css"],
    templateUrl: './add-severity.component.html'
  })

export class addseverityComponent implements OnInit{

    //#region "Property Declaration"
    addSeverityForm: FormGroup;
    severityMasterModel: severityMasterModel = new severityMasterModel();
    AllergySeverityId :number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addseverityComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addSeverityForm = this.fb.group({           
            AllergySeverityCode : ["", Validators.required],
            AllergySeverityDescription : ["", Validators.required],
            OrderNo : ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
   
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addSeverityForm.get('AllergySeverityCode').setValue(this.data.AllergySeverityCode);
    this.addSeverityForm.get('AllergySeverityDescription').setValue(this.data.AllergySeverityDescription);
    this.addSeverityForm.get('OrderNo').setValue(this.data.OrderNo);
    this.AllergySeverityId=this.data.AllergySeverityId;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New Severity Data"
    saveNewSeverity() {
      if (this.addSeverityForm.valid) {       
        this.severityMasterModel.AllergySeverityId=this.AllergySeverityId;
        this.severityMasterModel.AllergySeverityCode = this.addSeverityForm.get("AllergySeverityCode").value;
        this.severityMasterModel.AllergySeverityDescription = this.addSeverityForm.get("AllergySeverityDescription").value;
        this.severityMasterModel.OrderNo = this.addSeverityForm.get("OrderNo").value;
       this.configurationservice
          .saveNewSeverity(this.severityMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Severity details saved successfully",
                BMSMessageBoxColorMode.Information,
                BMSMessageBoxMode.MessageBox
              )
              .then((res) => {});
            this.dialogRef.close("Updated");
              }
          });
      }
    }
//#endregion
 
//#region "clear the Form values"
cleartheForm(){
this.addSeverityForm.reset();
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