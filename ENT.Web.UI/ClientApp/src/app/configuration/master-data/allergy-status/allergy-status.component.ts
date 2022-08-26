import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addallergyStatusComponent } from "./add-allergy-status/add-allergy-status.component";

@Component({
    selector: "app-allergyStatusComponent",
    styleUrls: ["./allergy-status.component.css"],
    templateUrl: './allergy-status.component.html'
  })

export class allergyStatusComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  allergyStatusDataGrid:any;
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
       PropertyName: "AllergyStatusMasterCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
     },
      {
        PropertyName: "AllergyStatusMasterDesc",
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
    this.getallergyStatusGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getallergyStatusGridData(){
    this.configurationservice.getallergyStatusGridData().then((res)=>{
    this.allergyStatusDataGrid=res;        
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addallergyStatusComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getallergyStatusGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditAllergyStatus(element: any) {
    this.configurationservice
      .getallergyStatusDataofId(element.Item.AllergyStatusMasterID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addallergyStatusComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getallergyStatusGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteAllergyStatus(element: any) {
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
                .deleteAllergyStatus(element.Item.AllergyStatusMasterID)
                .then((res) => {
                    this.getallergyStatusGridData();
                });
            }
          });
      }
       //#endregion  

}
