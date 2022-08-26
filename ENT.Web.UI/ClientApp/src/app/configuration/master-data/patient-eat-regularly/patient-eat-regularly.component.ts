import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addPatientEatRegularlyComponent } from "./add-patient-eat-regularly/add-patient-eat-regularly.component";

@Component({
    selector: "app-patientEatRegularlyComponent",
    styleUrls: ["./patient-eat-regularly.component.css"],
    templateUrl: './patient-eat-regularly.component.html'
  })

export class patientEatRegularlyComponent implements OnInit{
  
  //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  patientEatRegularlyDataGrid:any;
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
          PropertyName: "PatientEatMasterCode",
          DisplayName: "Code",
          DisplayMode: "Text",
          LinkUrl: "",
          width:"15%",
          
        }  ,
        {
          PropertyName: "PatientEatMasterDesc",
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
      this.getpatientEatRegularlyGridData();
    }
    //#endregion

     //#region "get data for grid"  
     getpatientEatRegularlyGridData(){
      this.configurationservice.getPatientEatRegularlyGridData().then((res)=>{
      this.patientEatRegularlyDataGrid=res;    
      }
      );
     }
      //#endregion

  //#region "add new data to Table"
        addNewpatientEatRegularly(){
      const newAddData = this.dialog.open(addPatientEatRegularlyComponent, {      
        height: "auto",
        width: "25%",
        autoFocus: false,
      });
      newAddData.afterClosed().subscribe((result) => {
        if (result == "Updated") {    
          this.getpatientEatRegularlyGridData();     
        }
      });
    }  
    //#endregion 

     //#region "Edit/Update Data of Table"
    editNewpatientEatRegularly(element: any) {
      this.configurationservice
        .getPatientEatRegularlyDataofId(element.Item.PatientEatMasterID)      
        .then((res) => {
          var editRecordofpatientEatRegularly = res;
          let editDetailsofpatientEatRegularly = this.dialog.open(addPatientEatRegularlyComponent, {
            data: editRecordofpatientEatRegularly,
            height: "auto",
            width: "25%",
            autoFocus: true,
          });
          editDetailsofpatientEatRegularly.afterClosed().subscribe((result) => {
            if (result == "Updated") {
              this.getpatientEatRegularlyGridData();
            }
          });
        });
    }
     //#endregion  

     //#region "delete Patient Eat Regularly"
    deletePatientEatRegularly(element: any) {
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
              .deletePatientEatRegularly(element.Item.PatientEatMasterID)
              .then((res) => {
                this.getpatientEatRegularlyGridData();
              });
          }
        });
    }
     //#endregion  
}
