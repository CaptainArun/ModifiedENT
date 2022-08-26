import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { addallergyTypeComponent } from "./add-allergy-type/add-allergy-type.component";
@Component({
    selector: "app-allergyTypeComponent",
    styleUrls: ["./allergy-type.component.css"],
    templateUrl: './allergy-type.component.html'
  })

export class allergyTypeComponent implements OnInit{

  //#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig();
  allergytypeDataGrid:any;
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
       PropertyName: "AllergyTypeCode", DisplayName: "Code",DisplayMode: "Text", LinkUrl: "",width: "15%",
      },
      {
        PropertyName: "AllergyTypeDescription",
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
    this.getallergyTypeGridData();
  }
  //#endregion
 
  //#region "get data for grid"  
  getallergyTypeGridData(){
    this.configurationservice.getallergyTypeGridData().then((res)=>{
    this.allergytypeDataGrid=res;      
    
    }
    );
   }
    //#endregion

  //#region "add new data to Table"
   // add new data to Table
   openaddNewButtonFunction(){
    const addNewPopup = this.dialog.open(addallergyTypeComponent, {      
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    addNewPopup.afterClosed().subscribe((result) => {
      if (result == "Updated") {   
        this.getallergyTypeGridData();
      }
    });
  } 
  //#endregion

   //#region "Edit/Update Data of Table"
   openEditAllergyType(element: any) {
    this.configurationservice
      .getallergyTypeDataofId(element.Item.AllergyTypeID)      
      .then((res) => {
        var editRecord= res;
        let editDetails= this.dialog.open(addallergyTypeComponent, {
          data: editRecord,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getallergyTypeGridData();
          }
        });
      });
  }
   //#endregion

      //#region "delete record"
      deleteAllergyType(element: any) {
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
                .deleteAllergyType(element.Item.AllergyTypeID)
                .then((res) => {
                    this.getallergyTypeGridData();
                });
            }
          });
      }
       //#endregion  

}
