import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { radiologyTypeMasterModel } from "../../../Models/radiologyTypeMasterModel";

@Component({
    selector: "app-addRadiologyTypeComponent",
    styleUrls: ["./add-radiology-type.component.css"],
    templateUrl: './add-radiology-type.component.html'
  })

export class addRadiologyTypeComponent implements OnInit{

//#region "Property Declaration"
addRadiologyTypeForm: FormGroup;
radiologyTypeMasterModel: radiologyTypeMasterModel = new radiologyTypeMasterModel();
RadiologyTypeID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addRadiologyTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addRadiologyTypeForm = this.fb.group({           
          RadiologyTypeCode : ["", Validators.required],
          RadiologyTypeDesc : ["", Validators.required],
          OrderNo : ["", Validators.required],
          });
          this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addRadiologyTypeForm.get('RadiologyTypeCode').setValue(this.data.RadiologyTypeCode);
      this.addRadiologyTypeForm.get('RadiologyTypeDesc').setValue(this.data.RadiologyTypeDesc);
      this.addRadiologyTypeForm.get('OrderNo').setValue(this.data.OrderNo);
      this.RadiologyTypeID=this.data.RadiologyTypeID;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update Radiology Type Data"
       editAddRadiologyType() {
        if (this.addRadiologyTypeForm.valid) {       
          this.radiologyTypeMasterModel.RadiologyTypeID = this.RadiologyTypeID ;
          this.radiologyTypeMasterModel.RadiologyTypeCode  =  this.addRadiologyTypeForm.get("RadiologyTypeCode").value;
          this.radiologyTypeMasterModel.RadiologyTypeDesc  = this.addRadiologyTypeForm.get("RadiologyTypeDesc").value;
          this.radiologyTypeMasterModel.OrderNo = this.addRadiologyTypeForm.get("OrderNo").value;
          this.configurationservice
            .saveNewRadiologyType(this.radiologyTypeMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Radiology Type details saved successfully",
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
  this.addRadiologyTypeForm.reset();
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