import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addAdmissionTypeComponent } from "./add-admission-type/add-admission-type.component";
@Component({
    selector: "app-admissionTypeComponent",
    styleUrls: ["./admission-type.component.css"],
    templateUrl: './admission-type.component.html'
  })

export class AdmissionTypeComponent implements OnInit{

      //#region property declaration
    tableConfig: TableConfig = new TableConfig();
   admissionTypeDataGrid:any;
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
          PropertyName: "AdmissionTypeCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%"          
        }  ,
        {
          PropertyName: "AdmissionTypeDesc",
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
    this.getAdmissionTypeGridData();
  }
  //#endregion

      //#region "get data for grid"  
  getAdmissionTypeGridData(){
    this.configurationservice.getAdmissionTypeGridData().then((res)=>{
    this.admissionTypeDataGrid=res;    
    }
    );
   }
    //#endregion
      
      //#region "add new data to Table"
    // add new data to Table
    addNewAdmissionType(){
      const newAdmissionType = this.dialog.open(addAdmissionTypeComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newAdmissionType.afterClosed().subscribe((result) => {
        if (result == "Updated") {     
          this.getAdmissionTypeGridData();    
        }
      });
    }  
    //#endregion  

      //#region "Edit/Update Data of Table"
    editAdmissionType(element: any) {        
      this.configurationservice
        .getAdmissionTypeDataofId(element.Item.AdmissionTypeID)      
        .then((res) => {
          var editRecordofAdmissionType = res;
          let editDetailsofAdmissionType = this.dialog.open(addAdmissionTypeComponent, {
            data: editRecordofAdmissionType,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofAdmissionType.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getAdmissionTypeGridData();    
            }
          });
        });
    }
     //#endregion 

      //#region "deleteAdmissionType"
    deleteAdmissionType(element: any) {    
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
              .deleteAdmissionType(element.Item.AdmissionTypeID)
              .then((res) => {
                this.getAdmissionTypeGridData();     
              });
          }
        });
    }
     //#endregion  
    
}
