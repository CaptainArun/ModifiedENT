import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import {patientPositionMasterModel}from '../../../Models/patientPositionMasterModel';

@Component({
    selector: "app-addpatientPositionComponent",
    styleUrls: ["./add-patient-position.component.css"],
    templateUrl: './add-patient-position.component.html'
  })

export class addpatientPositionComponent implements OnInit{
//#region "Property Declaration"
    addPatientPositionForm: FormGroup;
    patientPositionMasterModel:patientPositionMasterModel = new  patientPositionMasterModel();
    PatientPositionID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addpatientPositionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion
    //#region "ngOnInit"
    ngOnInit(){
      this.addPatientPositionForm = this.fb.group({           
        PatientPositionCode : ["", Validators.required],
        PatientPositionDesc : ["", Validators.required],
        OrderNo : ["", Validators.required],
        });   
        this.setValuesForForm();         
  }
  //#endregion

   //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addPatientPositionForm.get('PatientPositionCode').setValue(this.data.PatientPositionCode);
    this.addPatientPositionForm.get('PatientPositionDesc').setValue(this.data.PatientPositionDesc);
    this.addPatientPositionForm.get('OrderNo').setValue(this.data.OrderNo);
    this.PatientPositionID=this.data.PatientPositionID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

   //#region "save New Specialty Data"
   saveNewPatientPosition() {
    if (this.addPatientPositionForm.valid) {       
      this.patientPositionMasterModel.PatientPositionID=this.PatientPositionID;
      this.patientPositionMasterModel.PatientPositionCode = this.addPatientPositionForm.get("PatientPositionCode").value;
      this.patientPositionMasterModel.PatientPositionDesc = this.addPatientPositionForm.get("PatientPositionDesc").value;
      this.patientPositionMasterModel.OrderNo = this.addPatientPositionForm.get("OrderNo").value;
     this.configurationservice
        .saveNewPatientPosition(this.patientPositionMasterModel)
        .then((res) => {
          if(res){
          this.util
            .showMessage(
              "",
              "Patient Position details saved successfully",
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
  this.addPatientPositionForm.reset();
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