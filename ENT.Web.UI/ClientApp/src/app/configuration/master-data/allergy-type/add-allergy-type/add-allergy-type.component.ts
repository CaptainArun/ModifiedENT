import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ConfigurationService } from "../../../configuration.service";
import { allergyTypeMasterModel } from "../../../Models/allergyTypeMasterModel";

@Component({
    selector: "app-addallergyTypeComponent",
    styleUrls: ["./add-allergy-type.component.css"],
    templateUrl: './add-allergy-type.component.html'
  })

export class addallergyTypeComponent implements OnInit{

//#region "Property Declaration"
addAllergyTypeForm: FormGroup;
allergyTypeMasterModel: allergyTypeMasterModel = new allergyTypeMasterModel();
AllergyTypeID:number=0;
showvalue:string="Add";
isReadOnly:boolean=false;
    //#endregion

  //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addallergyTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public configurationservice :ConfigurationService,
    private util: UtilService,
    ){  }
     //#endregion

    ngOnInit(){
        this.addAllergyTypeForm = this.fb.group({           
            AllergyTypeCode  : ["", Validators.required],
            AllergyTypeDescription  : ["", Validators.required],
            OrderNo  : ["", Validators.required],
          });
          this.setValuesForForm();            
    }

    //#region "set Values For Form"
    setValuesForForm(){
      if(this.data != null){
      this.addAllergyTypeForm.get('AllergyTypeCode').setValue(this.data.AllergyTypeCode);
      this.addAllergyTypeForm.get('AllergyTypeDescription').setValue(this.data.AllergyTypeDescription);
      this.addAllergyTypeForm.get('OrderNo').setValue(this.data.OrderNo);
      this.AllergyTypeID=this.data.AllergyTypeID;
      this.showvalue="Edit";
      this.isReadOnly=true;
    }
    }
     //#endregion

       //#region "Edit/Update Allergy Type Data"
       editAddAllergyType() {
        if (this.addAllergyTypeForm.valid) {       
          this.allergyTypeMasterModel.AllergyTypeID = this.AllergyTypeID ;
          this.allergyTypeMasterModel.AllergyTypeCode  =  this.addAllergyTypeForm.get("AllergyTypeCode").value;
          this.allergyTypeMasterModel.AllergyTypeDescription  = this.addAllergyTypeForm.get("AllergyTypeDescription").value;
          this.allergyTypeMasterModel.OrderNo = this.addAllergyTypeForm.get("OrderNo").value;
          this.configurationservice
            .saveNewAllergyType(this.allergyTypeMasterModel)
            .then((res) => {
              if(res){
              this.util
                .showMessage(
                  "",
                  "Allergy Type details saved successfully",
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
  this.addAllergyTypeForm.reset();
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
