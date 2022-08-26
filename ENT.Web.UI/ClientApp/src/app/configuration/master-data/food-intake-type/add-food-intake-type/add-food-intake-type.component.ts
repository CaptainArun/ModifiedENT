import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { foodIntakeTypeMasterModel } from "../../../Models/foodIntakeTypeMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addFoodIntakeTypeComponent",
    styleUrls: ["./add-food-intake-type.component.css"],
    templateUrl: './add-food-intake-type.component.html'
  })

export class addFoodIntakeTypeComponent implements OnInit{

    //#region "Property Declaration"
    addFoodIntakeTypeForm: FormGroup;
    foodIntakeTypeMasterModel: foodIntakeTypeMasterModel = new foodIntakeTypeMasterModel();
    FoodIntaketypeID:number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addFoodIntakeTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addFoodIntakeTypeForm = this.fb.group({           
            FoodIntakeTypeCode: ["", Validators.required],
            FoodIntakeTypeDescription: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addFoodIntakeTypeForm.get('FoodIntakeTypeCode').setValue(this.data.FoodIntakeTypeCode);
    this.addFoodIntakeTypeForm.get('FoodIntakeTypeDescription').setValue(this.data.FoodIntakeTypeDescription);
    this.addFoodIntakeTypeForm.get('OrderNo').setValue(this.data.OrderNo);
    this.FoodIntaketypeID=this.data.FoodIntaketypeID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New FoodIntakeType Data"
 saveNewFoodIntakeType() {
      if (this.addFoodIntakeTypeForm.valid) {       
        this.foodIntakeTypeMasterModel.FoodIntaketypeID=this.FoodIntaketypeID;
        this.foodIntakeTypeMasterModel.FoodIntakeTypeCode = this.addFoodIntakeTypeForm.get("FoodIntakeTypeCode").value;
        this.foodIntakeTypeMasterModel.FoodIntakeTypeDescription = this.addFoodIntakeTypeForm.get("FoodIntakeTypeDescription").value;
        this.foodIntakeTypeMasterModel.OrderNo = this.addFoodIntakeTypeForm.get("OrderNo").value;
       this.configurationservice
          .saveNewFoodIntakeType(this.foodIntakeTypeMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Food Intake Type details saved successfully",
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
this.addFoodIntakeTypeForm.reset();
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