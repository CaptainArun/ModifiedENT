import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { medicationStatusMasterModel } from "../../../Models/medicationStatusMasterModel";

@Component({
    selector: "app-addmedicationStatusComponent",
    styleUrls: ["./add-medication-status.component.css"],
    templateUrl: './add-medication-status.component.html'
  })

export class addmedicationStatusComponent implements OnInit{

//#region "Property Declaration"
addMedicationStatusForm: FormGroup;
medicationStatusMasterModel: medicationStatusMasterModel = new medicationStatusMasterModel();
MedicationStatusId:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addmedicationStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addMedicationStatusForm = this.fb.group({           
            MedicationStatusCode  : ["", Validators.required],
            MedicationstatusDescription  : ["", Validators.required],
            OrderNo  : ["", Validators.required],
          });
         this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addMedicationStatusForm.get('MedicationStatusCode').setValue(this.data.MedicationStatusCode);
      this.addMedicationStatusForm.get('MedicationstatusDescription').setValue(this.data.MedicationstatusDescription);
      this.addMedicationStatusForm.get('OrderNo').setValue(this.data.OrderNo);
      this.MedicationStatusId=this.data.MedicationStatusId;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update Medication Status Data"
       editAddMedicationStatus() {
        if (this.addMedicationStatusForm.valid) {       
          this.medicationStatusMasterModel.MedicationStatusId = this.MedicationStatusId ;
         this.medicationStatusMasterModel.MedicationStatusCode  =  this.addMedicationStatusForm.get("MedicationStatusCode").value;
          this.medicationStatusMasterModel.MedicationstatusDescription  = this.addMedicationStatusForm.get("MedicationstatusDescription").value;
          this.medicationStatusMasterModel.OrderNo = this.addMedicationStatusForm.get("OrderNo").value;
          this.configurationservice
            .saveNewMedicationStatus(this.medicationStatusMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Medication Status details saved successfully",
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
  this.addMedicationStatusForm.reset();
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