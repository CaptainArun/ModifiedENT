import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { patientEatRegularlyMasterModel } from "../../../Models/patientEatRegularlyMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addPatientEatRegularlyComponent",
    styleUrls: ["./add-patient-eat-regularly.component.css"],
    templateUrl: './add-patient-eat-regularly.component.html'
  })

export class addPatientEatRegularlyComponent implements OnInit{

    //#region "Property Declaration"
    addPatientEatRegularlyForm: FormGroup;
    patientEatRegularlyMasterModel: patientEatRegularlyMasterModel = new patientEatRegularlyMasterModel();
    PatientEatMasterID:number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addPatientEatRegularlyComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addPatientEatRegularlyForm = this.fb.group({           
            PatientEatMasterCode: ["", Validators.required],
            PatientEatMasterDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addPatientEatRegularlyForm.get('PatientEatMasterCode').setValue(this.data.PatientEatMasterCode);
    this.addPatientEatRegularlyForm.get('PatientEatMasterDesc').setValue(this.data.PatientEatMasterDesc);
    this.addPatientEatRegularlyForm.get('OrderNo').setValue(this.data.OrderNo);
    this.PatientEatMasterID=this.data.PatientEatMasterID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New PatientEatRegularly Data"
    saveNewPatientEatRegularly() {
      if (this.addPatientEatRegularlyForm.valid) {       
        this.patientEatRegularlyMasterModel.PatientEatMasterID=this.PatientEatMasterID;
        this.patientEatRegularlyMasterModel.PatientEatMasterCode = this.addPatientEatRegularlyForm.get("PatientEatMasterCode").value;
        this.patientEatRegularlyMasterModel.PatientEatMasterDesc = this.addPatientEatRegularlyForm.get("PatientEatMasterDesc").value;
        this.patientEatRegularlyMasterModel.OrderNo = this.addPatientEatRegularlyForm.get("OrderNo").value;
       this.configurationservice
          .saveNewPatientEatRegularly(this.patientEatRegularlyMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Patient Eat Regularly details saved successfully",
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
this.addPatientEatRegularlyForm.reset();
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