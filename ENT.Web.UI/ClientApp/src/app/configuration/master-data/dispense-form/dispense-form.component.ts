import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addDispenseFormComponent } from "./add-dispense-form/add-dispense-form.component";
@Component({
    selector: "app-dispenseFormComponent",
    styleUrls: ["./dispense-form.component.css"],
    templateUrl: './dispense-form.component.html'
  })

export class dispenseFormComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  dispenseFormDataGrid:any;
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
        PropertyName: "DispenseFormCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
      },
      {
        PropertyName: "DispenseFormDescription",
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
    this.getDispenseFormGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getDispenseFormGridData(){
    this.configurationservice.getDispenseFormGridData().then((res)=>{
    this.dispenseFormDataGrid=res;
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addDispenseFormComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getDispenseFormGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditDispenseForm(element: any) {
    this.configurationservice
      .getDispenseFormDataofId(element.Item.DispenseFormID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addDispenseFormComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getDispenseFormGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteDispenseForm(element: any) {
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
                .deleteDispenseForm(element.Item.DispenseFormID)
                .then((res) => {
                    this.getDispenseFormGridData();
                });
            }
          });
      }
       //#endregion  

}
