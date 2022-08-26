import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { dispenseFormMasterModel } from "../../../Models/dispenseFormMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addDispenseFormComponent",
    styleUrls: ["./add-dispense-form.component.css"],
    templateUrl: './add-dispense-form.component.html'
  })

export class addDispenseFormComponent implements OnInit{

    //#region "Property Declaration"
    addDispenseForm: FormGroup;
    dispenseFormMasterModel: dispenseFormMasterModel = new dispenseFormMasterModel();
    DispenseFormID :number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addDispenseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addDispenseForm = this.fb.group({           
            DispenseFormCode : ["", Validators.required],
            DispenseFormDescription : ["", Validators.required],
            OrderNo : ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
   
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addDispenseForm.get('DispenseFormCode').setValue(this.data.DispenseFormCode);
    this.addDispenseForm.get('DispenseFormDescription').setValue(this.data.DispenseFormDescription);
    this.addDispenseForm.get('OrderNo').setValue(this.data.OrderNo);
    this.DispenseFormID=this.data.DispenseFormID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New Data to grid"
    saveNewDispenseForm() {
      if (this.addDispenseForm.valid) {       
        this.dispenseFormMasterModel.DispenseFormID=this.DispenseFormID;
        this.dispenseFormMasterModel.DispenseFormCode = this.addDispenseForm.get("DispenseFormCode").value;
        this.dispenseFormMasterModel.DispenseFormDescription = this.addDispenseForm.get("DispenseFormDescription").value;
        this.dispenseFormMasterModel.OrderNo = this.addDispenseForm.get("OrderNo").value;
       this.configurationservice
          .saveNewDispenseForm(this.dispenseFormMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "DispenseForm details saved successfully",
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
this.addDispenseForm.reset();
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