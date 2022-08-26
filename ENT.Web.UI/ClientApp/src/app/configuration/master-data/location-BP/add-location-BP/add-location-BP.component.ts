import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import {locationBpMasterModel}from '../../../Models/locationBpMasterModel';

@Component({
    selector: "app-addlocationBpComponent",
    styleUrls: ["./add-location-BP.component.css"],
    templateUrl: './add-location-BP.component.html'
  })

export class addlocationBpComponent implements OnInit{

//#region "Property Declaration"
addlocationBpForm: FormGroup;
locationBpMasterModel: locationBpMasterModel = new locationBpMasterModel();
BPLocationId :number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addlocationBpComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){ 
     }
     //#endregion

    ngOnInit(){
        this.addlocationBpForm = this.fb.group({           
            BPLocationCode  : ["", Validators.required],
            BPLocationDescription  : ["", Validators.required],
            OrderNo  : ["", Validators.required],
          });
          this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addlocationBpForm.get('BPLocationCode').setValue(this.data.BPLocationCode);
      this.addlocationBpForm.get('BPLocationDescription').setValue(this.data.BPLocationDescription);
      this.addlocationBpForm.get('OrderNo').setValue(this.data.OrderNo);
      this.BPLocationId=this.data.BPLocationId;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update location Bp Data"
       editAddLocationBP() {
        if (this.addlocationBpForm.valid) {       
          this.locationBpMasterModel.BPLocationId = this.BPLocationId ;
          this.locationBpMasterModel.BPLocationCode  =  this.addlocationBpForm.get("BPLocationCode").value;
          this.locationBpMasterModel.BPLocationDescription  = this.addlocationBpForm.get("BPLocationDescription").value;
          this.locationBpMasterModel.OrderNo = this.addlocationBpForm.get("OrderNo").value;
          this.configurationservice
            .saveNewLocationBP(this.locationBpMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Location BP details saved successfully",
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
  this.addlocationBpForm.reset();
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