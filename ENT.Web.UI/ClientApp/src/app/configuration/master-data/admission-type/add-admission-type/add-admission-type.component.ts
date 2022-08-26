import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { admissionTypeMasterModel } from "../../../Models/admissionTypeMasterModel";

@Component({
    selector: "app-addadmissionTypeComponent",
    styleUrls: ["./add-admission-type.component.css"],
    templateUrl: './add-admission-type.component.html'
  })

export class addAdmissionTypeComponent implements OnInit{

//#region "Property Declaration"
addAdmissionTypeForm: FormGroup;
admissionTypeMasterModel: admissionTypeMasterModel = new admissionTypeMasterModel();
AdmissionTypeID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addAdmissionTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addAdmissionTypeForm = this.fb.group({           
          AdmissionTypeCode : ["", Validators.required],
          AdmissionTypeDesc : ["", Validators.required],
          OrderNo : ["", Validators.required],
          });
          this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addAdmissionTypeForm.get('AdmissionTypeCode').setValue(this.data.AdmissionTypeCode);
      this.addAdmissionTypeForm.get('AdmissionTypeDesc').setValue(this.data.AdmissionTypeDesc);
      this.addAdmissionTypeForm.get('OrderNo').setValue(this.data.OrderNo);
      this.AdmissionTypeID=this.data.AdmissionTypeID;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update Admission Type Data"
       editAddAdmissionType() {
        if (this.addAdmissionTypeForm.valid) {       
          this.admissionTypeMasterModel.AdmissionTypeID = this.AdmissionTypeID ;
          this.admissionTypeMasterModel.AdmissionTypeCode  =  this.addAdmissionTypeForm.get("AdmissionTypeCode").value;
          this.admissionTypeMasterModel.AdmissionTypeDesc  = this.addAdmissionTypeForm.get("AdmissionTypeDesc").value;
          this.admissionTypeMasterModel.OrderNo = this.addAdmissionTypeForm.get("OrderNo").value;
          this.configurationservice
            .saveNewAdmissionType(this.admissionTypeMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Admission Type details saved successfully",
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
  this.addAdmissionTypeForm.reset();
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