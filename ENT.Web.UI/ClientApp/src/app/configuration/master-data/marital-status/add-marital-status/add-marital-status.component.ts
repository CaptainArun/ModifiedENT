import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { MaritalnStatusMasterModel } from "../../../Models/martialStatusMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-maritalstatus",
  styleUrls: ["./add-marital-status.component.css"],
  templateUrl: './add-marital-status.component.html'
  })
export class addmartialStatusComponent implements OnInit{

    //#region "Property Declaration"
    addMartialForm: FormGroup;
    MaritalnStatusMasterModel: MaritalnStatusMasterModel = new MaritalnStatusMasterModel();
    MaritalStatusID  :number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addmartialStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addMartialForm = this.fb.group({           
            MaritalStatusCode : ["", Validators.required],
            MaritalStatusDesc : ["", Validators.required],
            OrderNo : ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
   
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addMartialForm.get('MaritalStatusCode').setValue(this.data.MaritalStatusCode);
    this.addMartialForm.get('MaritalStatusDesc').setValue(this.data.MaritalStatusDesc);
    this.addMartialForm.get('OrderNo').setValue(this.data.OrderNo);
    this.MaritalStatusID=this.data.MaritalStatusID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New Data to grid"
    savemartial() {
      if (this.addMartialForm.valid) {       
        this.MaritalnStatusMasterModel.MaritalStatusID=this.MaritalStatusID;
        this.MaritalnStatusMasterModel.MaritalStatusCode = this.addMartialForm.get("MaritalStatusCode").value;
        this.MaritalnStatusMasterModel.MaritalStatusDesc = this.addMartialForm.get("MaritalStatusDesc").value;
        this.MaritalnStatusMasterModel.OrderNo = this.addMartialForm.get("OrderNo").value;
        this.configurationservice.savemartialstatus(this.MaritalnStatusMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Martial Status details saved successfully",
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
this.addMartialForm.reset();
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
