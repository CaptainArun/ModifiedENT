import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigurationService } from "../../../configuration.service";
import { foodIntakeCategoryMasterModel } from "../../../Models/foodIntakeCategoryMasterModel";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: "app-addFoodIntakeCategoryComponent",
    styleUrls: ["./add-food-intake-category.component.css"],
    templateUrl: './add-food-intake-category.component.html'
  })

export class addFoodIntakeCategoryComponent implements OnInit{

    //#region "Property Declaration"
    addFoodIntakeCategoryForm: FormGroup;
    foodIntakeCategoryMasterModel: foodIntakeCategoryMasterModel = new foodIntakeCategoryMasterModel();
    FoodIntakeMasterID:number=0;
    showvalue:string="Add";
    isReadOnly:boolean=false;
    //#endregion

 //#region "constructor"
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<addFoodIntakeCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    public configurationservice :ConfigurationService,
    private util: UtilService,
  ){ }
  //#endregion

  //#region "ngOnInit"
    ngOnInit(){
        this.addFoodIntakeCategoryForm = this.fb.group({           
            FoodIntakeMasterCode: ["", Validators.required],
            FoodIntakeMasterDesc: ["", Validators.required],
            OrderNo: ["", Validators.required],
          });    
          this.setValuesForForm();       
    }
    //#endregion
    //#region "set Values For Form"
   setValuesForForm(){
    if(this.data != null){
    this.addFoodIntakeCategoryForm.get('FoodIntakeMasterCode').setValue(this.data.FoodIntakeMasterCode);
    this.addFoodIntakeCategoryForm.get('FoodIntakeMasterDesc').setValue(this.data.FoodIntakeMasterDesc);
    this.addFoodIntakeCategoryForm.get('OrderNo').setValue(this.data.OrderNo);
    this.FoodIntakeMasterID=this.data.FoodIntakeMasterID;
    this.showvalue="Edit";
    this.isReadOnly=true;
  }
  }
   //#endregion

 //#region "save New FoodIntakeCategory Data"
 saveNewFoodIntakeCategory() {
      if (this.addFoodIntakeCategoryForm.valid) {       
        this.foodIntakeCategoryMasterModel.FoodIntakeMasterID=this.FoodIntakeMasterID;
        this.foodIntakeCategoryMasterModel.FoodIntakeMasterCode = this.addFoodIntakeCategoryForm.get("FoodIntakeMasterCode").value;
        this.foodIntakeCategoryMasterModel.FoodIntakeMasterDesc = this.addFoodIntakeCategoryForm.get("FoodIntakeMasterDesc").value;
        this.foodIntakeCategoryMasterModel.OrderNo = this.addFoodIntakeCategoryForm.get("OrderNo").value;
       this.configurationservice
          .saveNewFoodIntakeCategory(this.foodIntakeCategoryMasterModel)
          .then((res) => {
            if(res){
            this.util
              .showMessage(
                "",
                "Food Intake Category details saved successfully",
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
this.addFoodIntakeCategoryForm.reset();
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