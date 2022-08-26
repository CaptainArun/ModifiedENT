import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addProcedureNameShortComponent } from "./add-procedure-name-short/add-procedure-name-short.component";

@Component({
    selector: "app-ProcedureNameShortComponent",
    styleUrls: ["./procedure-name-short.component.css"],
    templateUrl: './procedure-name-short.component.html'
  })

export class ProcedureNameShortComponent implements OnInit{
   //#region "Property Declaration"
   tableConfig: TableConfig = new TableConfig();
   procedureNameShortDataGrid:any;
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
        PropertyName: "ProcedureCode",
        DisplayName: "Code",
        DisplayMode: "Text",
        LinkUrl: "",
        width:"15%",
        
      }  ,
      {
        PropertyName: "ProcedureDesc",
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
      this.getProcedureNameShortGridData();
    }
    //#endregion

  //#region "get data for grid"  
 getProcedureNameShortGridData(){
  this.configurationservice.getProcedureNameShortGridData().then((res)=>{
  this.procedureNameShortDataGrid=res;    
  }
  );
 }
  //#endregion

   //#region "add new data to Table"
   // add new data to Table
   addNewprocedureName(){
    const newprocedureName = this.dialog.open(addProcedureNameShortComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newprocedureName.afterClosed().subscribe((result) => {
      if (result == "Updated") {    
        this.getProcedureNameShortGridData();
      }
    });
  } 
  //#endregion

  //#region "Edit/Update Data of Table"
editNewProcedureNameShort(element: any) {
  this.configurationservice
    .getProcedureNameShortDataofId(element.Item.ProcedureID)      
    .then((res) => {
      var editRecordofProcedureName = res;
      let editDetailsofProcedureName = this.dialog.open(addProcedureNameShortComponent, {
        data: editRecordofProcedureName,
        height: "auto",
        width: "25%",
        autoFocus: true,
      });
      editDetailsofProcedureName.afterClosed().subscribe((result) => {
        if (result == "Updated") {
          this.getProcedureNameShortGridData();
        }
      });
    });
}
 //#endregion  

      //#region "deleteProcedureNameShort"
      deleteProcedureNameShort(element: any) {
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
                .DeleteProcedureNameShortData(element.Item.ProcedureID)
                .then((res) => {
                  this.getProcedureNameShortGridData();
                });
            }
          });
      }
       //#endregion  
  }