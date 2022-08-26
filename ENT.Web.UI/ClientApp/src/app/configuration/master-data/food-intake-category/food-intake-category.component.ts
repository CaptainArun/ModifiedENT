import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addFoodIntakeCategoryComponent } from "./add-food-intake-category/add-food-intake-category.component";

@Component({
    selector: "app-foodIntakeCategoryComponent",
    styleUrls: ["./food-intake-category.component.css"],
    templateUrl: './food-intake-category.component.html'
  })

export class foodIntakeCategoryComponent implements OnInit{
  
  //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  foodIntakeCategoryDataGrid:any;
//#endregion
  
//#region "constructor"
    constructor(
      public dialog: MatDialog,
      public configurationservice :ConfigurationService,
      private config: UtilService,
      public customhttp: CustomHttpService,
    ){
      this.tableConfig.showPagination = true;
      this.tableConfig.showView = false;
      this.tableConfig.showIcon = false;
      this.tableConfig.showEdit = true;
      this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = true;
      this.tableConfig.columnConfig = [
        {
          PropertyName: "FoodIntakeMasterCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%",
          
        }  ,
        {
          PropertyName: "FoodIntakeMasterDesc",
          DisplayName: "Description",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"60%"
        }  ,
        {
          PropertyName: "OrderNo",
          DisplayName: "order",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%"
        }       
      ];

    }
    //#endregion

  //#region "ngOnInit"  
    ngOnInit() {
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.getfoodIntakeCategoryGridData();
    }
    //#endregion

     //#region "get data for grid"  
     getfoodIntakeCategoryGridData(){
      this.configurationservice.getFoodIntakeCategoryGridData().then((res)=>{
      this.foodIntakeCategoryDataGrid=res;    
      }
      );
     }
      //#endregion

  //#region "add new data to Table"
        addNewFoodIntakeCategory(){
      const newFoodIntakeCategory = this.dialog.open(addFoodIntakeCategoryComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newFoodIntakeCategory.afterClosed().subscribe((result) => {
        if (result == "Updated") {    
          this.getfoodIntakeCategoryGridData();     
        }
      });
    }  
    //#endregion 

     //#region "Edit/Update Data of Table"
    editNewFoodIntakeCategory(element: any) {
      this.configurationservice
        .getFoodIntakeCategoryDataofId(element.Item.FoodIntakeMasterID)      
        .then((res) => {
          var editRecordoffoodIntake = res;
          let editDetailsoffoodIntake = this.dialog.open(addFoodIntakeCategoryComponent, {
            data: editRecordoffoodIntake,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsoffoodIntake.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getfoodIntakeCategoryGridData();
            }
          });
        });
    }
     //#endregion  

     //#region "deletegetFoodIntakeCategory"
     deleteFoodIntakeCategory(element: any) {
      this.config
        .showMessage(
          "Delete",
          "Are you sure want to delete this item? This action cannot be undone.",
          BMSMessageBoxColorMode.Information,
          BMSMessageBoxMode.ConfrimBox
        )
        .then((res: any) => {
          if (res == true) {
            this.configurationservice
              .deleteFoodIntakeCategory(element.Item.FoodIntakeMasterID)
              .then((res) => {
                this.getfoodIntakeCategoryGridData();
              });
          }
        });
    }
     //#endregion  
}
