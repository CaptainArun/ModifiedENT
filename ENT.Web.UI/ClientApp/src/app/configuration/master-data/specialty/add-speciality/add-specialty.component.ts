import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { specialityMasterModel } from "../../../Models/specialityMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addSpecialtyComponent",
    styleUrls: ["./add-specialty.component.css"],
    templateUrl: './add-specialty.component.html'
  })

export class addSpecialtyComponent implements OnInit{

    //#region "Property Declaration"
    addSpecialityForm: FormGroup;
    specialityMasterModel: specialityMasterModel = new specialityMasterModel();
    TenantSpecialityID:number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addSpecialtyComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addSpecialityForm = this.fb.group({           
            TenantSpecialityCode: ["", Validators.required],
            TenantSpecialityDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addSpecialityForm.get('TenantSpecialityCode').setValue(this.data.TenantSpecialityCode);
    this.addSpecialityForm.get('TenantSpecialityDescription').setValue(this.data.TenantSpecialityDescription);
    this.addSpecialityForm.get('OrderNo').setValue(this.data.OrderNo);
    this.TenantSpecialityID=this.data.TenantSpecialityID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New Specialty Data"
    saveNewSpecialty() {
      if (this.addSpecialityForm.valid) {       
        this.specialityMasterModel.TenantSpecialityID=this.TenantSpecialityID;
        this.specialityMasterModel.TenantSpecialityCode = this.addSpecialityForm.get("TenantSpecialityCode").value;
        this.specialityMasterModel.TenantSpecialityDescription = this.addSpecialityForm.get("TenantSpecialityDescription").value;
        this.specialityMasterModel.OrderNo = this.addSpecialityForm.get("OrderNo").value;
       this.configurationservice
          .saveNewSpecialty(this.specialityMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Specialty details saved successfully",
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
this.addSpecialityForm.reset();
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