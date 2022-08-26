import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { initialAdmissionStatusMasterModel } from "../../../Models/initialAdmissionStatusMasterModel";

@Component({
    selector: "app-addinitialAdmissionStatusComponent",
    styleUrls: ["./add-initial-admission-status.component.css"],
    templateUrl: './add-initial-admission-status.component.html'
  })

export class addInitialAdmissionStatusComponent implements OnInit{

//#region "Property Declaration"
addInitialAdmissionStatusForm: FormGroup;
initialAdmissionStatusMasterModel: initialAdmissionStatusMasterModel = new initialAdmissionStatusMasterModel();
AdmissionStatusID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false; 
//#endregion
 
   //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addInitialAdmissionStatusComponent>,    
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
  ngOnInit(){
    this.addInitialAdmissionStatusForm = this.fb.group({           
      AdmissionStatusCode: ["", Validators.required],
      AdmissionStatusDesc: ["", Validators.required],
      OrderNo: ["", Validators.required],
      });   
      this.setValuesForForm();
}
//#endregion

 //#region "set Values For Form"
 setValuesForForm(){
  if(this.data != null){
  this.addInitialAdmissionStatusForm.get('AdmissionStatusCode').setValue(this.data.AdmissionStatusCode);
  this.addInitialAdmissionStatusForm.get('AdmissionStatusDesc').setValue(this.data.AdmissionStatusDesc);
  this.addInitialAdmissionStatusForm.get('OrderNo').setValue(this.data.OrderNo);
  this.AdmissionStatusID=this.data.AdmissionStatusID;
  this.showvalue="Edit";
  this.isReadOnly=true;
}
}
 //#endregion

//#region "save New InitialAdmissionStatus Data"
saveNewInitialAdmissionStatus() {
  if (this.addInitialAdmissionStatusForm.valid) {       
    this.initialAdmissionStatusMasterModel.AdmissionStatusID= this.AdmissionStatusID;
    this.initialAdmissionStatusMasterModel.AdmissionStatusCode = this.addInitialAdmissionStatusForm.get("AdmissionStatusCode").value;
    this.initialAdmissionStatusMasterModel.AdmissionStatusDesc = this.addInitialAdmissionStatusForm.get("AdmissionStatusDesc").value;
    this.initialAdmissionStatusMasterModel.OrderNo = this.addInitialAdmissionStatusForm.get("OrderNo").value;
   this.configurationservice
      .saveNewInitialAdmissionStatus(this.initialAdmissionStatusMasterModel)
      .then((res) => {
        if(res){
        this.util
          .showMessage(
            "",
            "Initial Admission Status details saved successfully",
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
  this.addInitialAdmissionStatusForm.reset();
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