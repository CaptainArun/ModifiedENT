import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { ProcedureTypeMasterModel } from "../../../Models/procedureTypeMasterModel";

@Component({
    selector: "app-addProcedureTypeComponent",
    styleUrls: ["./add-procedure-type.component.css"],
    templateUrl: './add-procedure-type.component.html'
  })

export class addProcedureTypeComponent implements OnInit{
//#region "Property Declaration"
    addProcedureTypeForm: FormGroup;
    procedureTypeMasterModel: ProcedureTypeMasterModel = new ProcedureTypeMasterModel();
    ProcedureTypeID:number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
 constructor(
  public fb: FormBuilder,
  public dialogRef: MatDialogRef<addProcedureTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,    
  public configurationservice :ConfigurationService,
  private util: UtilService,
){ }
//#endregion
  //#region "ngOnInit"
    ngOnInit(){
        this.addProcedureTypeForm = this.fb.group({           
            ProcedureTypeCode: ["", Validators.required],
            ProcedureTypeDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });
          this.setValuesForForm();   
    }
    //#endregion

    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addProcedureTypeForm.get('ProcedureTypeCode').setValue(this.data.ProcedureTypeCode);
    this.addProcedureTypeForm.get('ProcedureTypeDesc').setValue(this.data.ProcedureTypeDesc);
    this.addProcedureTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    this.ProcedureTypeID=this.data.ProcedureTypeID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

     //#region "save New procedure Type Data"
     saveNewProcedureType() {
      if (this.addProcedureTypeForm.valid) {       
        this.procedureTypeMasterModel.ProcedureTypeID=this.ProcedureTypeID;
        this.procedureTypeMasterModel.ProcedureTypeCode = this.addProcedureTypeForm.get("ProcedureTypeCode").value;
        this.procedureTypeMasterModel.ProcedureTypeDesc = this.addProcedureTypeForm.get("ProcedureTypeDesc").value;
        this.procedureTypeMasterModel.OrderNo = this.addProcedureTypeForm.get("OrderNo").value;
       this.configurationservice
          .saveNewProceduretype(this.procedureTypeMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Procedure Type details saved successfully",
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
  this.addProcedureTypeForm.reset();
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