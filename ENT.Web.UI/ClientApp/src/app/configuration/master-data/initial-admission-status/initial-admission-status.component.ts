import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addInitialAdmissionStatusComponent } from "./add-initial-admission-status/add-initial-admission-status.component";
@Component({
    selector: "app-initialAdmissionStatusComponent",
    styleUrls: ["./initial-admission-status.component.css"],
    templateUrl: './initial-admission-status.component.html'
  })

export class InitialAdmissionStatusComponent implements OnInit{
   //#region "property declaration"
   tableConfig: TableConfig = new TableConfig();
   InitialAdmissionStatusDataGrid:any;
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
          PropertyName: "AdmissionStatusCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%"          
        }  ,
        {
          PropertyName: "AdmissionStatusDesc",
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
    this.getInitialAdmissionStatusGridData();
  }
  //#endregion

   //#region "get data for grid"  
   getInitialAdmissionStatusGridData(){
    this.configurationservice.getInitialAdmissionStatusGridData().then((res)=>{
    this.InitialAdmissionStatusDataGrid=res;     
    }
    );
   }
    //#endregion
    
  //#region "add new data to Table"
    // add new data to Table
    addNewInitialAdmissionStatus(){
      const newInitialAdmissionStatus = this.dialog.open(addInitialAdmissionStatusComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newInitialAdmissionStatus.afterClosed().subscribe((result) => {
        if (result == "Updated") {  
          this.getInitialAdmissionStatusGridData();       
        }
      });
    }  
    //#endregion  
    
    //#region "Edit/Update Data of Table"
    editInitialAdmissionStatus(element: any) {
      this.configurationservice
        .getInitialAdmissionStatusDataofId(element.Item.AdmissionStatusID)      
        .then((res) => {
          var editRecordofSpecialty = res;
          let editDetailsofSpecialty = this.dialog.open(addInitialAdmissionStatusComponent, {
            data: editRecordofSpecialty,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofSpecialty.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getInitialAdmissionStatusGridData();    
            }
          });
        });
    }
     //#endregion 

      //#region "deleteInitialAdmissionStatus"
    deleteInitialAdmissionStatus(element: any) {    
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
              .deleteInitialAdmissionStatus(element.Item.AdmissionStatusID)
              .then((res) => {
                this.getInitialAdmissionStatusGridData();    
              });
          }
        });
    }
     //#endregion  
    
}