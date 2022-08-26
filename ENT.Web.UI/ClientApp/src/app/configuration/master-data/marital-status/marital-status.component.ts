import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addmartialStatusComponent } from "./add-marital-status/add-marital-status.component";
@Component({
    selector: "app-maritalstatuscomponent",
    styleUrls: ["./marital-status.component.css"],
  templateUrl: './martial-status.component.html'
  })
export class martialStatusComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  martialstausgrid:any;
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
        PropertyName: "MaritalStatusCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
      },
      {
        PropertyName: "MaritalStatusDesc",DisplayName: "Description",DisplayMode: "Text",LinkUrl: "",width: "60%"
      },
      {
        PropertyName: "OrderNo",DisplayName: "order",DisplayMode: "Text",LinkUrl: "",width: "15%"
      }
    ];

  }   
   //#endregion


  //#region "ngOnInit"  
  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getMartialStatusGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getMartialStatusGridData(){
    this.configurationservice.getmartialstatus().then((res)=>{
    this.martialstausgrid=res;
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openmartialbutton(){
    const addNewPopup = this.dialog.open(addmartialStatusComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getMartialStatusGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   editmartialform(element: any) {
    this.configurationservice
      .getmartialstatusid(element.Item.MaritalStatusID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addmartialStatusComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getMartialStatusGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deletemartialform(element: any) {
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
                .deletemartialstatus(element.Item.MaritalStatusID)
                .then((res) => {
                    this.getMartialStatusGridData();
                });
            }
          });
      }
       //#endregion  

}
