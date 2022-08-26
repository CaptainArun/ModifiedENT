import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { medicationUnitsMasterModel } from "../../../Models/medicationUnitsMasterModel";

@Component({
    selector: "app-addmedicationUnitsComponent",
    styleUrls: ["./add-medication-units.component.css"],
    templateUrl: './add-medication-units.component.html'
  })

export class addmedicationUnitsComponent implements OnInit{

//#region "Property Declaration"
addMedicationUnitsForm: FormGroup;
medicationUnitsMasterModel: medicationUnitsMasterModel = new medicationUnitsMasterModel();
MedicationUnitsId:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addmedicationUnitsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addMedicationUnitsForm = this.fb.group({           
            MedicationUnitsCode  : ["", Validators.required],
            MedicationUnitsDescription  : ["", Validators.required],
            OrderNo  : ["", Validators.required],
          });
         this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addMedicationUnitsForm.get('MedicationUnitsCode').setValue(this.data.MedicationUnitsCode);
      this.addMedicationUnitsForm.get('MedicationUnitsDescription').setValue(this.data.MedicationUnitsDescription);
      this.addMedicationUnitsForm.get('OrderNo').setValue(this.data.OrderNo);
      this.MedicationUnitsId=this.data.MedicationUnitsId;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update Allergy Units Data"
       editAddMedicationUnits() {
        if (this.addMedicationUnitsForm.valid) {       
          this.medicationUnitsMasterModel.MedicationUnitsId = this.MedicationUnitsId ;
         this.medicationUnitsMasterModel.MedicationUnitsCode  =  this.addMedicationUnitsForm.get("MedicationUnitsCode").value;
          this.medicationUnitsMasterModel.MedicationUnitsDescription  = this.addMedicationUnitsForm.get("MedicationUnitsDescription").value;
          this.medicationUnitsMasterModel.OrderNo = this.addMedicationUnitsForm.get("OrderNo").value;
          this.configurationservice
            .saveNewMedicationUnits(this.medicationUnitsMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Medication Units details saved successfully",
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
  this.addMedicationUnitsForm.reset();
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