import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { radiologyProcedureRequestedMasterModel } from "../../../Models/radiologyProcedureRequestedMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addRadiologyProcedureRequestedComponent",
    styleUrls: ["./add-radiology-procedure-requested.component.css"],
    templateUrl: './add-radiology-procedure-requested.component.html'
  })

export class addRadiologyProcedureRequestedComponent implements OnInit{

    //#region "Property Declaration"
    addRadiologyProcedureRequestedForm: FormGroup;
    radiologyProcedureRequestedMasterModel: radiologyProcedureRequestedMasterModel = new radiologyProcedureRequestedMasterModel();
    RadiologyProcedureRequestedID :number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addRadiologyProcedureRequestedComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addRadiologyProcedureRequestedForm = this.fb.group({           
            RadiologyProcedureRequestedCode : ["", Validators.required],
            RadiologyProcedureRequestedDesc : ["", Validators.required],
            OrderNo : ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
   
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addRadiologyProcedureRequestedForm.get('RadiologyProcedureRequestedCode').setValue(this.data.RadiologyProcedureRequestedCode);
    this.addRadiologyProcedureRequestedForm.get('RadiologyProcedureRequestedDesc').setValue(this.data.RadiologyProcedureRequestedDesc);
    this.addRadiologyProcedureRequestedForm.get('OrderNo').setValue(this.data.OrderNo);
    this.RadiologyProcedureRequestedID=this.data.RadiologyProcedureRequestedID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New RadiologyProcedureRequested Data"
    saveNewRadiologyProcedureRequested() {
      if (this.addRadiologyProcedureRequestedForm.valid) {       
        this.radiologyProcedureRequestedMasterModel.RadiologyProcedureRequestedID=this.RadiologyProcedureRequestedID;
        this.radiologyProcedureRequestedMasterModel.RadiologyProcedureRequestedCode = this.addRadiologyProcedureRequestedForm.get("RadiologyProcedureRequestedCode").value;
        this.radiologyProcedureRequestedMasterModel.RadiologyProcedureRequestedDesc = this.addRadiologyProcedureRequestedForm.get("RadiologyProcedureRequestedDesc").value;
        this.radiologyProcedureRequestedMasterModel.OrderNo = this.addRadiologyProcedureRequestedForm.get("OrderNo").value;
       this.configurationservice
          .saveNewRadiologyProcedureRequested(this.radiologyProcedureRequestedMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Radiology Procedure Requested details saved successfully",
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
this.addRadiologyProcedureRequestedForm.reset();
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