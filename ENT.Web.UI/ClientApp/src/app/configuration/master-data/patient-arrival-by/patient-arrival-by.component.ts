import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { addpatientArrivalByComponent } from "./add-patient-arrival-by/add-patient-arrival-by.component";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
@Component({
    selector: "app-patientArrivalByComponent",
    styleUrls: ["./patient-arrival-by.component.css"],
    templateUrl: './patient-arrival-by.component.html'
  })

export class patientArrivalByComponent implements OnInit{
  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  patientArrivalByDataGrid:any;
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
        PropertyName: "PABCode",
        DisplayName: "Code",
        DisplayMode: "Text",
        LinkUrl: "",
        width: "15%",

      },
      {
        PropertyName: "PABDesc",
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
    this.getpatientArrivalByGridData();
  }
  //#endregion
   //#region "get data for grid"  
   getpatientArrivalByGridData(){
    this.configurationservice.getpatientArrivalByGridData().then((res)=>{
    this.patientArrivalByDataGrid=res;  
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   addNewpatientArrivalBy(){
    const newpatientArrivalBy = this.dialog.open(addpatientArrivalByComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newpatientArrivalBy.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getpatientArrivalByGridData();      
      }
    });
  } 
  //#endregion
   //#region "Edit/Update Data of Table"
   editpatientArrivalBy(element: any) {
    this.configurationservice
      .getpatientArrivalByDataofId(element.Item.PABID)      
      .then((res) => {
        var editRecordofArrivalBy = res;
        let editDetailsofArrivalBy = this.dialog.open(addpatientArrivalByComponent, {
          data: editRecordofArrivalBy,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofArrivalBy.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getpatientArrivalByGridData();  
          }
        });
      });
  }
   //#endregion
   
      //#region "deletepatientArrivalBy"
      deletepatientArrivalBy(element: any) {
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
                .DeletepatientArrivalBy(element.Item.PABID)
                .then((res) => {
                  this.getpatientArrivalByGridData();  
                });
            }
          });
      }
       //#endregion  

}
