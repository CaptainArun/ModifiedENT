import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addmedicationStatusComponent } from "./add-medication-status/add-medication-status.component";

@Component({
    selector: "app-medicationStatusComponent",
    styleUrls: ["./medication-status.component.css"],
    templateUrl: './medication-status.component.html'
  })

export class medicationStatusComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  medicationStatusDataGrid:any;
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
       PropertyName: "MedicationStatusCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
     },
      {
        PropertyName: "MedicationstatusDescription",
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
    this.getMedicationStatusGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getMedicationStatusGridData(){
    this.configurationservice.getMedicationStatusGridData().then((res)=>{
    this.medicationStatusDataGrid=res;    
     }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addmedicationStatusComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getMedicationStatusGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditMedicationStatus(element: any) {
    this.configurationservice
      .getMedicationStatusDataofId(element.Item.MedicationStatusId)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addmedicationStatusComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getMedicationStatusGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteMedicationStatus(element: any) {
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
                .deleteMedicationStatus(element.Item.MedicationStatusId)
                .then((res) => {
                    this.getMedicationStatusGridData();
                });
            }
          });
      }
       //#endregion  

}
