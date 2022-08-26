import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addBodySiteComponent } from "./add-body-site/add-body-site.component";

@Component({
    selector: "app-bodySiteComponent",
    styleUrls: ["./body-site.component.css"],
    templateUrl: './body-site.component.html'
  })

export class bodySiteComponent implements OnInit{
  
  //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  bodySiteDataGrid:any;
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
          PropertyName: "BodySiteCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%",
          
        }  ,
        {
          PropertyName: "BodySiteDesc",
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
      this.getbodySiteGridData();
    }
    //#endregion

     //#region "get data for grid"  
     getbodySiteGridData(){
      this.configurationservice.getBodySiteGridData().then((res)=>{
      this.bodySiteDataGrid=res;    
      }
      );
     }
      //#endregion

  //#region "add new data to Table"
        addNewBodySite(){
      const newBodySite = this.dialog.open(addBodySiteComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newBodySite.afterClosed().subscribe((result) => {
        if (result == "Updated") {    
          this.getbodySiteGridData();     
        }
      });
    }  
    //#endregion 

     //#region "Edit/Update Data of Table"
    editNewBodySite(element: any) {
      this.configurationservice
        .getBodySiteDataofId(element.Item.BodySiteID)      
        .then((res) => {
          var editRecordofbodySite = res;
          let editDetailsofbodySite = this.dialog.open(addBodySiteComponent, {
            data: editRecordofbodySite,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofbodySite.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getbodySiteGridData();
            }
          });
        });
    }
     //#endregion  

     //#region "delete Body Site"
     deleteBodySite(element: any) {
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
              .deleteBodySite(element.Item.BodySiteID)
              .then((res) => {
                this.getbodySiteGridData();
              });
          }
        });
    }
     //#endregion  
}
