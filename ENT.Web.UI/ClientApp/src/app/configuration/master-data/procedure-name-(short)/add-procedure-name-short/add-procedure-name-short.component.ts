import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProcedureNameMasterModel } from "../../../Models/procedureNameMasterModel";

@Component({
    selector: "app-addProcedureNameShortComponent",
    styleUrls: ["./add-procedure-name-short.component.css"],
    templateUrl: './add-procedure-name-short.component.html'
  })

export class addProcedureNameShortComponent implements OnInit{
//#region "Property Declaration"
    addProcedureNameForm: FormGroup;
    ProcedureNameMasterModel: ProcedureNameMasterModel = new ProcedureNameMasterModel();
    ProcedureID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addProcedureNameShortComponent>,
    @Inject(MAT_DIALOG_DATA) public data,    
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addProcedureNameForm = this.fb.group({           
            ProcedureCode: ["", Validators.required],
            ProcedureDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });
          this.setValuesForForm();         
    }
    //#endregion

      //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addProcedureNameForm.get('ProcedureCode').setValue(this.data.ProcedureCode);
    this.addProcedureNameForm.get('ProcedureDesc').setValue(this.data.ProcedureDesc);
    this.addProcedureNameForm.get('OrderNo').setValue(this.data.OrderNo);
    this.ProcedureID=this.data.ProcedureID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion
   
 //#region "save New ProcedureName Data"
    saveNewProcedureName(){
      if (this.addProcedureNameForm.valid) {       
        this.ProcedureNameMasterModel.ProcedureID= this.ProcedureID;
        this.ProcedureNameMasterModel.ProcedureCode = this.addProcedureNameForm.get("ProcedureCode").value;
        this.ProcedureNameMasterModel.ProcedureDesc = this.addProcedureNameForm.get("ProcedureDesc").value;
        this.ProcedureNameMasterModel.OrderNo = this.addProcedureNameForm.get("OrderNo").value;
       this.configurationservice
          .saveNewProcedureName(this.ProcedureNameMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Procedure Name details saved successfully",
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
  this.addProcedureNameForm.reset();
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