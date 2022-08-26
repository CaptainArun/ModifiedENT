import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { bodySiteMasterModel } from "../../../Models/bodySiteMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addBodySiteComponent",
    styleUrls: ["./add-body-site.component.css"],
    templateUrl: './add-body-site.component.html'
  })

export class addBodySiteComponent implements OnInit{

    //#region "Property Declaration"
    addBodySiteForm: FormGroup;
    bodySiteMasterModel: bodySiteMasterModel = new bodySiteMasterModel();
    BodySiteID:number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addBodySiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addBodySiteForm = this.fb.group({           
            BodySiteCode: ["", Validators.required],
            BodySiteDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addBodySiteForm.get('BodySiteCode').setValue(this.data.BodySiteCode);
    this.addBodySiteForm.get('BodySiteDesc').setValue(this.data.BodySiteDesc);
    this.addBodySiteForm.get('OrderNo').setValue(this.data.OrderNo);
    this.BodySiteID=this.data.BodySiteID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New BodySite Data"
    saveNewBodySite() {
      if (this.addBodySiteForm.valid) {       
        this.bodySiteMasterModel.BodySiteID=this.BodySiteID;
        this.bodySiteMasterModel.BodySiteCode = this.addBodySiteForm.get("BodySiteCode").value;
        this.bodySiteMasterModel.BodySiteDesc = this.addBodySiteForm.get("BodySiteDesc").value;
        this.bodySiteMasterModel.OrderNo = this.addBodySiteForm.get("OrderNo").value;
       this.configurationservice
          .saveNewBodySite(this.bodySiteMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Body Site details saved successfully",
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
this.addBodySiteForm.reset();
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