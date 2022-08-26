import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addFoodIntakeTypeComponent } from "./add-food-intake-type/add-food-intake-type.component";

@Component({
    selector: "app-foodIntakeTypeComponent",
    styleUrls: ["./food-intake-type.component.css"],
    templateUrl: './food-intake-type.component.html'
  })

export class foodIntakeTypeComponent implements OnInit{
  
  //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  foodIntakeTypeDataGrid:any;
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
          PropertyName: "FoodIntakeTypeCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%",
          
        }  ,
        {
          PropertyName: "FoodIntakeTypeDescription",
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
      this.getfoodIntakeTypeGridData();
    }
    //#endregion

     //#region "get data for grid"  
     getfoodIntakeTypeGridData(){
      this.configurationservice.getFoodIntakeTypeGridData().then((res)=>{
      this.foodIntakeTypeDataGrid=res;    
      }
      );
     }
      //#endregion

  //#region "add new data to Table"
        addNewFoodIntakeType(){
      const newFoodIntakeType = this.dialog.open(addFoodIntakeTypeComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newFoodIntakeType.afterClosed().subscribe((result) => {
        if (result == "Updated") {    
          this.getfoodIntakeTypeGridData();     
        }
      });
    }  
    //#endregion 

     //#region "Edit/Update Data of Table"
    editNewFoodIntakeType(element: any) {
      this.configurationservice
        .getFoodIntakeTypeDataofId(element.Item.FoodIntaketypeID)      
        .then((res) => {
          var editRecordoffoodIntakeType = res;
          let editDetailsoffoodIntakeType = this.dialog.open(addFoodIntakeTypeComponent, {
            data: editRecordoffoodIntakeType,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsoffoodIntakeType.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getfoodIntakeTypeGridData();
            }
          });
        });
    }
     //#endregion  

     //#region "deletegetFoodIntakeType"
     deleteFoodIntakeType(element: any) {
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
              .deleteFoodIntakeType(element.Item.FoodIntaketypeID)
              .then((res) => {
                this.getfoodIntakeTypeGridData();
              });
          }
        });
    }
     //#endregion  
}
