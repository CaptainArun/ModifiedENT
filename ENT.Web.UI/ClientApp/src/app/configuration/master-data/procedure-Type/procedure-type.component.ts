import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addProcedureTypeComponent } from "./add-procedure-type/add-procedure-type.component";
@Component({
    selector: "app-procedureTypeComponent",
    styleUrls: ["./procedure-type.component.css"],
    templateUrl: './procedure-type.component.html'
  })

export class ProcedureTypeComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  procedureTypeDataGrid:any;
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
          PropertyName: "ProcedureTypeCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%",
          
        }  ,
        {
          PropertyName: "ProcedureTypeDesc",
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
      this.getProcedureTypeGridData();
    }
    //#endregion

       //#region "get data for grid"  
       getProcedureTypeGridData(){
        this.configurationservice.getProcedureTypeGridData().then((res)=>{
        this.procedureTypeDataGrid=res;   
        
        }
        );
       }
        //#endregion
    
   //#region "add new data to Table"
   // add new data to Table
    addNewProcedureType(){
      const newProcedureType = this.dialog.open(addProcedureTypeComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newProcedureType.afterClosed().subscribe((result) => {
        if (result == "Updated") {       
          this.getProcedureTypeGridData();  
        }
      });
    } 
    //#endregion

    //#region "Edit/Update Data of Table"
    editProcedureType(element: any) {
      this.configurationservice
        .getProcedureTypeDataofId(element.Item.ProcedureTypeID)      
        .then((res) => {
          var editRecordofSpecialty = res;
          let editDetailsofSpecialty = this.dialog.open(addProcedureTypeComponent, {
            data: editRecordofSpecialty,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofSpecialty.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getProcedureTypeGridData();
            }
          });
        });
    }
     //#endregion 

      //#region "deleteProcedureType"
    deleteProcedureType(element: any) {    
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
              .DeleteProcedureTypeData(element.Item.ProcedureTypeID)
              .then((res) => {
                this.getProcedureTypeGridData();  
              });
          }
        });
    }
     //#endregion  

  }
