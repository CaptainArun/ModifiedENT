import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addtemperatureLocationComponent } from "./add-temperature-location/add-temperature-location.component";
@Component({
    selector: "app-temperatureLocationComponent",
    styleUrls: ["./temperature-location.component.css"],
    templateUrl: './temperature-location.component.html'
  })

export class temperatureLocationComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  temperatureLocationDataGrid:any;
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
        PropertyName: "TemperatureLocationCode",
        DisplayName: "Code",
        DisplayMode: "Text",
        LinkUrl: "",
        width: "15%",

      },
      {
        PropertyName: "TemperatureLocationDesc",
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
    this.gettemperatureLocationGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
   gettemperatureLocationGridData(){
    this.configurationservice.gettemperatureLocationGridData().then((res)=>{
    this.temperatureLocationDataGrid=res;  
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   addNewtemperatureLocation(){
    const newtemperatureLocation = this.dialog.open(addtemperatureLocationComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newtemperatureLocation.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.gettemperatureLocationGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   edittemperatureLocation(element: any) {
    this.configurationservice
      .gettemperatureLocationDataofId(element.Item.TemperatureLocationID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addtemperatureLocationComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.gettemperatureLocationGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deletetemperatureLocation(element: any) {
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
                .deletetemperatureLocation(element.Item.TemperatureLocationID)
                .then((res) => {
                    this.gettemperatureLocationGridData();
                });
            }
          });
      }
       //#endregion  

}
