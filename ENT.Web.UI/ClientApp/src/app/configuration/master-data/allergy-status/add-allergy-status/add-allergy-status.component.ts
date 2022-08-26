import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { allergyStatusMasterModel } from "../../../Models/allergyStatusMasterModel";

@Component({
    selector: "app-addallergyStatusComponent",
    styleUrls: ["./add-allergy-status.component.css"],
    templateUrl: './add-allergy-status.component.html'
  })

export class addallergyStatusComponent implements OnInit{

//#region "Property Declaration"
addAllergyStatusForm: FormGroup;
allergyStatusMasterModel: allergyStatusMasterModel = new allergyStatusMasterModel();
AllergyStatusMasterID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addallergyStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addAllergyStatusForm = this.fb.group({           
            AllergyStatusMasterCode  : ["", Validators.required],
            AllergyStatusMasterDesc  : ["", Validators.required],
            OrderNo  : ["", Validators.required],
          });
         this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addAllergyStatusForm.get('AllergyStatusMasterCode').setValue(this.data.AllergyStatusMasterCode);
      this.addAllergyStatusForm.get('AllergyStatusMasterDesc').setValue(this.data.AllergyStatusMasterDesc);
      this.addAllergyStatusForm.get('OrderNo').setValue(this.data.OrderNo);
      this.AllergyStatusMasterID=this.data.AllergyStatusMasterID;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update Allergy Status Data"
       editAddAllergyStatus() {
        if (this.addAllergyStatusForm.valid) {       
          this.allergyStatusMasterModel.AllergyStatusMasterID = this.AllergyStatusMasterID ;
         this.allergyStatusMasterModel.AllergyStatusMasterCode  =  this.addAllergyStatusForm.get("AllergyStatusMasterCode").value;
          this.allergyStatusMasterModel.AllergyStatusMasterDesc  = this.addAllergyStatusForm.get("AllergyStatusMasterDesc").value;
          this.allergyStatusMasterModel.OrderNo = this.addAllergyStatusForm.get("OrderNo").value;
          this.configurationservice
            .saveNewAllergyStatus(this.allergyStatusMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Allergy Status details saved successfully",
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
  this.addAllergyStatusForm.reset();
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