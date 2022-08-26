import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addSpecialtyComponent } from "./add-speciality/add-specialty.component";

@Component({
    selector: "app-specialtyComponent",
    styleUrls: ["./specialty.component.css"],
    templateUrl: './specialty.component.html'
  })

export class SpecialtyComponent implements OnInit{
  
  //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  specialtyDataGrid:any;
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
          PropertyName: "TenantSpecialityCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%",
          
        }  ,
        {
          PropertyName: "TenantSpecialityDescription",
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
      this.getSpecialtyGridData();
    }
    //#endregion

     //#region "get data for grid"  
     getSpecialtyGridData(){
      this.configurationservice.getSpecialtyGridData().then((res)=>{
      this.specialtyDataGrid=res;    
      }
      );
     }
      //#endregion

  //#region "add new data to Table"
        addNewSpeciality(){
      const newSpeciality = this.dialog.open(addSpecialtyComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newSpeciality.afterClosed().subscribe((result) => {
        if (result == "Updated") {    
          this.getSpecialtyGridData();     
        }
      });
    }  
    //#endregion 

     //#region "Edit/Update Data of Table"
    editNewSpeciality(element: any) {
      this.configurationservice
        .getSpecialtyDataofId(element.Item.TenantSpecialityID)      
        .then((res) => {
          var editRecordofSpecialty = res;
          let editDetailsofSpecialty = this.dialog.open(addSpecialtyComponent, {
            data: editRecordofSpecialty,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofSpecialty.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getSpecialtyGridData();
            }
          });
        });
    }
     //#endregion  

     //#region "deleteSpeciality"
    deleteSpeciality(element: any) {
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
              .DeleteSpecialityData(element.Item.TenantSpecialityID)
              .then((res) => {
                this.getSpecialtyGridData();
              });
          }
        });
    }
     //#endregion  
}
