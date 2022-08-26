import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { dosageFormMasterModel } from "../../../Models/dosageFormMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addDosageFormComponent",
    styleUrls: ["./add-dosage-form.component.css"],
    templateUrl: './add-dosage-form.component.html'
  })

export class addDosageFormComponent implements OnInit{

    //#region "Property Declaration"
    addDosageForm: FormGroup;
    dosageFormMasterModel: dosageFormMasterModel = new dosageFormMasterModel();
    DosageFormID :number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addDosageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addDosageForm = this.fb.group({           
            DosageFormCode : ["", Validators.required],
            DosageFormDescription : ["", Validators.required],
            OrderNo : ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
   
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addDosageForm.get('DosageFormCode').setValue(this.data.DosageFormCode);
    this.addDosageForm.get('DosageFormDescription').setValue(this.data.DosageFormDescription);
    this.addDosageForm.get('OrderNo').setValue(this.data.OrderNo);
    this.DosageFormID=this.data.DosageFormID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New Data to grid"
    saveNewdosageForm() {
      if (this.addDosageForm.valid) {       
        this.dosageFormMasterModel.DosageFormID=this.DosageFormID;
        this.dosageFormMasterModel.DosageFormCode = this.addDosageForm.get("DosageFormCode").value;
        this.dosageFormMasterModel.DosageFormDescription = this.addDosageForm.get("DosageFormDescription").value;
        this.dosageFormMasterModel.OrderNo = this.addDosageForm.get("OrderNo").value;
       this.configurationservice
          .saveNewDosageForm(this.dosageFormMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Dosage Form details saved successfully",
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
this.addDosageForm.reset();
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