import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addDosageFormComponent } from "./add-dosage-form/add-dosage-form.component";
@Component({
    selector: "app-dosageFormComponent",
    styleUrls: ["./dosage-form.component.css"],
    templateUrl: './dosage-form.component.html'
  })

export class dosageFormComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  dosageFormDataGrid:any;
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
        PropertyName: "DosageFormCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
      },
      {
        PropertyName: "DosageFormDescription",
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
    this.getdosageFormGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getdosageFormGridData(){
    this.configurationservice.getDosageFormGridData().then((res)=>{
    this.dosageFormDataGrid=res;
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addDosageFormComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getdosageFormGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditdosageForm(element: any) {
    this.configurationservice
      .getDosageFormDataofId(element.Item.DosageFormID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addDosageFormComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getdosageFormGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deletedosageForm(element: any) {
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
                .deleteDosageForm(element.Item.DosageFormID)
                .then((res) => {
                    this.getdosageFormGridData();
                });
            }
          });
      }
       //#endregion  

}
