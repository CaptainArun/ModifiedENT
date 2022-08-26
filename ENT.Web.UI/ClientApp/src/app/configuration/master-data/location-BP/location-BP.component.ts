import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addlocationBpComponent } from "./add-location-BP/add-location-BP.component";
@Component({
    selector: "app-locationBpComponent",
    styleUrls: ["./location-BP.component.css"],
    templateUrl: './location-BP.component.html'
  })

export class locationBpComponent implements OnInit{

    //#region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    locationBPDataGrid:any;
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
          PropertyName: "BPLocationCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%"          
        }  ,
        {
          PropertyName: "BPLocationDescription",
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
    this.getLocationBpGridData();
  }
  //#endregion

  //#region "get data for grid"  
  getLocationBpGridData(){
    this.configurationservice.getLocationBpGridData().then((res)=>{
    this.locationBPDataGrid=res;      
    }
    );
   }
    //#endregion
      
  //#region "add new data to Table"
    // add new data to Table
    addNewLocationBp(){
      const newLocationBp = this.dialog.open(addlocationBpComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newLocationBp.afterClosed().subscribe((result) => {
        if (result == "Updated") {     
            this.getLocationBpGridData();
        }
      });
    }  
    //#endregion  

    //#region "Edit/Update Data of Table"
    editLocationBp(element: any) {        
      this.configurationservice
        .getLocationBpDataofId(element.Item.BPLocationId)      
        .then((res) => {
          var editRecordofAdmissionType = res;
          let editDetailsofAdmissionType = this.dialog.open(addlocationBpComponent, {
            data: editRecordofAdmissionType,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofAdmissionType.afterClosed().subscribe((result) => {
            if (result == "Updated") {
                this.getLocationBpGridData();
            }
          });
        });
    }
     //#endregion 

     //#region "deleteAdmissionType"
    deleteLocationBp(element: any) {    
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
              .deleteLocationBp(element.Item.BPLocationId)
              .then((res) => {
                this.getLocationBpGridData();
              });
          }
        });
    }
     //#endregion  
    
}
