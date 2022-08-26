import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addRadiologyTypeComponent } from "./add-radiology-type/add-radiology-type.component";
@Component({
    selector: "app-RadiologyTypeComponent",
    styleUrls: ["./radiology-type.component.css"],
    templateUrl: './radiology-type.component.html'
  })

export class RadiologyTypeComponent implements OnInit{

      //#region property declaration
    tableConfig: TableConfig = new TableConfig();
   radiologyTypeDataGrid:any;
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
          PropertyName: "RadiologyTypeCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%"          
        }  ,
        {
          PropertyName: "RadiologyTypeDesc",
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
    this.getRadiologyTypeGridData();
  }
  //#endregion

      //#region "get data for grid"  
  getRadiologyTypeGridData(){
    this.configurationservice.getRadiologyTypeGridData().then((res)=>{
    this.radiologyTypeDataGrid=res;    
    }
    );
   }
    //#endregion
      
      //#region "add new data to Table"
    // add new data to Table
    addNewRadiologyType(){
      const newRadiologyType = this.dialog.open(addRadiologyTypeComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newRadiologyType.afterClosed().subscribe((result) => {
        if (result == "Updated") {     
          this.getRadiologyTypeGridData();    
        }
      });
    }  
    //#endregion  

      //#region "Edit/Update Data of Table"
    editRadiologyType(element: any) {        
      this.configurationservice
        .getRadiologyTypeDataofId(element.Item.RadiologyTypeID)      
        .then((res) => {
          var editRecordofRadiologyType = res;
          let editDetailsofRadiologyType = this.dialog.open(addRadiologyTypeComponent, {
            data: editRecordofRadiologyType,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofRadiologyType.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getRadiologyTypeGridData();    
            }
          });
        });
    }
     //#endregion 

      //#region "deleteRadiologyType"
    deleteRadiologyType(element: any) {    
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
              .deleteRadiologyType(element.Item.RadiologyTypeID)
              .then((res) => {
                this.getRadiologyTypeGridData();     
              });
          }
        });
    }
     //#endregion  
    
}
