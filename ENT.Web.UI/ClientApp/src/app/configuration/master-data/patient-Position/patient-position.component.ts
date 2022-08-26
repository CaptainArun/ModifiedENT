import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addpatientPositionComponent } from "./add-patient-position/add-patient-position.component";
@Component({
    selector: "app-patientPositionComponent",
    styleUrls: ["./patient-position.component.css"],
    templateUrl: './patient-position.component.html'
  })

export class patientPositionComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  patientpositionDataGrid:any;
  //#endregion


  //#region "constructor"
  constructor(
    public dialog: MatDialog,
    public configurationservice: ConfigurationService,
    private config: UtilService,
    public customhttp: CustomHttpService,
  ) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.columnConfig = [
      {
        PropertyName: "PatientPositionCode",
        DisplayName: "Code",
        DisplayMode: "Text",
        LinkUrl: "",
        width: "15%",

      },
      {
        PropertyName: "PatientPositionDesc",
        DisplayName: "Description",
        DisplayMode: "Text",
        LinkUrl: "",
        width: "60%"
      },
      {
        PropertyName: "OrderNo",
        DisplayName: "order",
        DisplayMode: "Text",
        LinkUrl: "",
        width: "15%"
      }
    ];

  }    //#endregion


  //#region "ngOnInit"  
  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getpatientpositionGridData();
  }
  //#endregion
   //#region "get data for grid"  
   getpatientpositionGridData(){
    this.configurationservice.getpatientpositionGridData().then((res)=>{
    this.patientpositionDataGrid=res;  
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   addNewpatientPosition(){
    const newpatientPosition = this.dialog.open(addpatientPositionComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newpatientPosition.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getpatientpositionGridData();     
      }
    });
  } 
  //#endregion
   //#region "Edit/Update Data of Table"
   editpatientPosition(element: any) {
    this.configurationservice
      .getpatientPositionDataofId(element.Item.PatientPositionID)      
      .then((res) => {
        var editRecordofpatientPosition= res;
        let editDetailsofpatientPosition = this.dialog.open(addpatientPositionComponent, {
          data: editRecordofpatientPosition,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofpatientPosition.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getpatientpositionGridData();   
          }
        });
      });
  }
   //#endregion

      //#region "deletepatientposition"
      deletepatientposition(element: any) {
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
                .Deletepatientposition(element.Item.PatientPositionID)
                .then((res) => {
                    this.getpatientpositionGridData();   
                });
            }
          });
      }
       //#endregion  

}
