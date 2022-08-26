import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addmedicationUnitsComponent } from "./add-medication-units/add-medication-units.component";

@Component({
    selector: "app-medicationUnitsComponent",
    styleUrls: ["./medication-units.component.css"],
    templateUrl: './medication-units.component.html'
  })

export class medicationUnitsComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  medicationUnitsDataGrid:any;
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
       PropertyName: "MedicationUnitsCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
     },
      {
        PropertyName: "MedicationUnitsDescription",
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
    this.getMedicationUnitsGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getMedicationUnitsGridData(){
    this.configurationservice.getMedicationUnitsGridData().then((res)=>{
    this.medicationUnitsDataGrid=res;          
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addmedicationUnitsComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getMedicationUnitsGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditMedicationUnits(element: any) {
    this.configurationservice
      .getMedicationUnitsDataofId(element.Item.MedicationUnitsId)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addmedicationUnitsComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getMedicationUnitsGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteMedicationUnits(element: any) {
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
                .deleteMedicationUnits(element.Item.MedicationUnitsId)
                .then((res) => {
                    this.getMedicationUnitsGridData();
                });
            }
          });
      }
       //#endregion  

}
