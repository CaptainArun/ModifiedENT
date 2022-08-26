import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { patientArrivalByMasterModel } from "../../../Models/patientArrivalByMasterModel";

@Component({
    selector: "app-addpatientArrivalByComponent",
    styleUrls: ["./add-patient-arrival-by.component.css"],
    templateUrl: './add-patient-arrival-by.component.html'
  })

export class addpatientArrivalByComponent implements OnInit{
//#region "Property Declaration"
    addPatientArrivalForm: FormGroup;
    patientArrivalByMasterModel:patientArrivalByMasterModel=new patientArrivalByMasterModel();
    patientArrivalByID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addpatientArrivalByComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion
    //#region "ngOnInit"
    ngOnInit(){
      this.addPatientArrivalForm = this.fb.group({           
        PABCode: ["", Validators.required],
        PABDesc: ["", Validators.required],
        OrderNo: ["", Validators.required],
        });   
        this.setValuesForForm();         
  }
  //#endregion

   //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addPatientArrivalForm.get('PABCode').setValue(this.data.PABCode);
    this.addPatientArrivalForm.get('PABDesc').setValue(this.data.PABDesc);
    this.addPatientArrivalForm.get('OrderNo').setValue(this.data.OrderNo);
    this.patientArrivalByID=this.data.PABID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

   //#region "save New Specialty Data"
   saveNewPatientArrivalBy() {
    if (this.addPatientArrivalForm.valid) {       
      this.patientArrivalByMasterModel.PABID=this.patientArrivalByID;
      this.patientArrivalByMasterModel.PABCode = this.addPatientArrivalForm.get("PABCode").value;
      this.patientArrivalByMasterModel.PABDesc = this.addPatientArrivalForm.get("PABDesc").value;
      this.patientArrivalByMasterModel.OrderNo = this.addPatientArrivalForm.get("OrderNo").value;
     this.configurationservice
        .saveNewPatientArrivalBy(this.patientArrivalByMasterModel)
        .then((res) => {
          if(res){
          this.util
            .showMessage(
              "",
              "Patient Arrival By details saved successfully",
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
  this.addPatientArrivalForm.reset();
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