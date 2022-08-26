import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addmedicationRouteComponent } from "./add-medication-route/add-medication-route.component";

@Component({
    selector: "app-medicationRouteComponent",
    styleUrls: ["./medication-route.component.css"],
    templateUrl: './medication-route.component.html'
  })

export class medicationRouteComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  medicationRouteDataGrid:any;
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
       PropertyName: "RouteCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
     },
      {
        PropertyName: "RouteDescription",
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
    this.getMedicationRouteGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getMedicationRouteGridData(){
    this.configurationservice.getMedicationRouteGridData().then((res)=>{
    this.medicationRouteDataGrid=res;    
     }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addmedicationRouteComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getMedicationRouteGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditMedicationRoute(element: any) {
    this.configurationservice
      .getMedicationRouteDataofId(element.Item.RouteId)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addmedicationRouteComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getMedicationRouteGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteMedicationRoute(element: any) {
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
                .deleteMedicationRoute(element.Item.RouteId)
                .then((res) => {
                    this.getMedicationRouteGridData();
                });
            }
          });
      }
       //#endregion  

}
