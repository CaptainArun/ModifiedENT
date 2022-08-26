import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { medicationRouteMasterModel } from "../../../Models/medicationRouteMasterModel";

@Component({
    selector: "app-addmedicationRouteComponent",
    styleUrls: ["./add-medication-route.component.css"],
    templateUrl: './add-medication-route.component.html'
  })

export class addmedicationRouteComponent implements OnInit{

//#region "Property Declaration"
addMedicationRouteForm: FormGroup;
medicationRouteMasterModel: medicationRouteMasterModel = new medicationRouteMasterModel();
RouteId:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addmedicationRouteComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addMedicationRouteForm = this.fb.group({           
            RouteCode  : ["", Validators.required],
            RouteDescription  : ["", Validators.required],
            OrderNo  : ["", Validators.required],
          });
         this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addMedicationRouteForm.get('RouteCode').setValue(this.data.RouteCode);
      this.addMedicationRouteForm.get('RouteDescription').setValue(this.data.RouteDescription);
      this.addMedicationRouteForm.get('OrderNo').setValue(this.data.OrderNo);
      this.RouteId=this.data.RouteId;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Add/Edit Data"
       editAddMedicationRoute() {
        if (this.addMedicationRouteForm.valid) {       
          this.medicationRouteMasterModel.RouteId = this.RouteId ;
         this.medicationRouteMasterModel.RouteCode  =  this.addMedicationRouteForm.get("RouteCode").value;
          this.medicationRouteMasterModel.RouteDescription  = this.addMedicationRouteForm.get("RouteDescription").value;
          this.medicationRouteMasterModel.OrderNo = this.addMedicationRouteForm.get("OrderNo").value;
          this.configurationservice
            .saveNewMedicationRoute(this.medicationRouteMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Medication Route details saved successfully",
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
  this.addMedicationRouteForm.reset();
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