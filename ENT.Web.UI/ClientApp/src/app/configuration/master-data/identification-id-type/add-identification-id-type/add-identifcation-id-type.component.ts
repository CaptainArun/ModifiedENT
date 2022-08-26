import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { identificationIdTypeMasterModel } from '../../../Models/identificationIdTypeMasterModel';


@Component({
    selector: "app-addidenticationIdType",
    styleUrls: ["./add-identifcation-id-type.component.css"],
    templateUrl: './add-identifcation-id-type.component.html'
  })

export class addidenticationIdType implements OnInit{

    //#region "Property Declaration"
    addidentificationForm: FormGroup;
    identificationIdTypeMasterModel: identificationIdTypeMasterModel = new identificationIdTypeMasterModel();
    IDTId :number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addidenticationIdType>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addidentificationForm = this.fb.group({           
            IDTCode : ["", Validators.required],
            IDTDescription : ["", Validators.required],
            OrderNo : ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
   
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addidentificationForm.get('IDTCode').setValue(this.data.IDTCode);
    this.addidentificationForm.get('IDTDescription').setValue(this.data.IDTDescription);
    this.addidentificationForm.get('OrderNo').setValue(this.data.OrderNo);
    this.IDTId=this.data.IDTId;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New Data to grid"
    saveIdentification() {
      if (this.addidentificationForm.valid) {       
        this.identificationIdTypeMasterModel.IDTId=this.IDTId;
        this.identificationIdTypeMasterModel.IDTCode = this.addidentificationForm.get("IDTCode").value;
        this.identificationIdTypeMasterModel.IDTDescription = this.addidentificationForm.get("IDTDescription").value;
        this.identificationIdTypeMasterModel.OrderNo = this.addidentificationForm.get("OrderNo").value;
       this.configurationservice
         .saveIdentificationId(this.identificationIdTypeMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "IdentificationIdType saved successfully",
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
this.addidentificationForm.reset();
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
