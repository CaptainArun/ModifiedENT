import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addRadiologyProcedureRequestedComponent } from "./add-radiology-procedure-requested/add-radiology-procedure-requested.component";
@Component({
    selector: "app-radiologyProcedureRequestedComponent",
    styleUrls: ["./radiology-procedure-requested.component.css"],
    templateUrl: './radiology-procedure-requested.component.html'
  })

export class radiologyProcedureRequestedComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  radiologyProcedureRequestedDataGrid:any;
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
        PropertyName: "RadiologyProcedureRequestedCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
      },
      {
        PropertyName: "RadiologyProcedureRequestedDesc",
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

  }   
   //#endregion


  //#region "ngOnInit"  
  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getradiologyProcedureRequestedGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getradiologyProcedureRequestedGridData(){
    this.configurationservice.getRadiologyProcedureRequestedGridData().then((res)=>{
    this.radiologyProcedureRequestedDataGrid=res;
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addRadiologyProcedureRequestedComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getradiologyProcedureRequestedGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditRadiologyProcedureRequested(element: any) {
    this.configurationservice
      .getRadiologyProcedureRequestedDataofId(element.Item.RadiologyProcedureRequestedID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addRadiologyProcedureRequestedComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getradiologyProcedureRequestedGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteRadiologyProcedureRequested(element: any) {
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
                .deleteRadiologyProcedureRequested(element.Item.RadiologyProcedureRequestedID)
                .then((res) => {
                    this.getradiologyProcedureRequestedGridData();
                });
            }
          });
      }
       //#endregion  

}
