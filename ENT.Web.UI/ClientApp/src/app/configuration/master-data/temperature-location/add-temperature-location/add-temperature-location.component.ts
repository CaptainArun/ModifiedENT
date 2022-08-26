import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import {temperatureLocationMasterModel}from '../../../Models/temperatureLocationMasterModel';

@Component({
    selector: "app-addpatientPositionComponent",
    styleUrls: ["./add-temperature-location.component.css"],
    templateUrl: './add-temperature-location.component.html'
  })

export class addtemperatureLocationComponent implements OnInit{
//#region "Property Declaration"
    addTemeratureLocationForm: FormGroup;
    temperatureLocationMasterModel:temperatureLocationMasterModel = new  temperatureLocationMasterModel();
    TemperatureLocationID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addtemperatureLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion
    //#region "ngOnInit"
    ngOnInit(){
      this.addTemeratureLocationForm = this.fb.group({           
        TemperatureLocationCode  : ["", Validators.required],
        TemperatureLocationDesc  : ["", Validators.required],
        OrderNo : ["", Validators.required],
        });   
        this.setValuesForForm();         
  }
  //#endregion

   //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addTemeratureLocationForm.get('TemperatureLocationCode').setValue(this.data.TemperatureLocationCode);
    this.addTemeratureLocationForm.get('TemperatureLocationDesc').setValue(this.data.TemperatureLocationDesc);
    this.addTemeratureLocationForm.get('OrderNo').setValue(this.data.OrderNo);
    this.TemperatureLocationID=this.data.TemperatureLocationID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

   //#region "save New temperature Location Data"
   saveNewtemperatureLocation() {
    if (this.addTemeratureLocationForm.valid) {       
      this.temperatureLocationMasterModel.TemperatureLocationID=this.TemperatureLocationID;
      this.temperatureLocationMasterModel.TemperatureLocationCode = this.addTemeratureLocationForm.get("TemperatureLocationCode").value;
      this.temperatureLocationMasterModel.TemperatureLocationDesc = this.addTemeratureLocationForm.get("TemperatureLocationDesc").value;
      this.temperatureLocationMasterModel.OrderNo = this.addTemeratureLocationForm.get("OrderNo").value;
     this.configurationservice
        .saveNewtemperatureLocation(this.temperatureLocationMasterModel)
        .then((res) => {
          if(res){
          this.util
            .showMessage(
              "",
              "Temperature Location details saved successfully",
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
  this.addTemeratureLocationForm.reset();
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