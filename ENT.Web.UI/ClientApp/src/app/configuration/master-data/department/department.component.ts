import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { DepartmentAddComponent } from "./add-department/add-department.component";



@Component({
    selector: "app-department",
      styleUrls: ["./department.component.css"],
    templateUrl: './department.component.html'
    })
    export class DepartmentComponent implements OnInit{
      //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  departmentgrid: any;
  //#endregion

  //#region "constructor"

  constructor(private config: UtilService, public MatDialog: MatDialog, public CustHttp: CustomHttpService, public configurationservice: ConfigurationService,) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.showOpen = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'DepartCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'DepartmentDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getDepartmentGridData();
  }
  getDepartmentGridData() {
    this.configurationservice. Departmentgrid().then((res) => {
      this.departmentgrid = res;
    }
    );
  }
  //#region "AddDepartment"

  addNewDepartment() {
    const newDepartment = this.MatDialog.open (DepartmentAddComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newDepartment.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getDepartmentGridData();
      }
    });
  }
  //#endregion

  //#region "EditDepartment"

  editDepartment(element: any) {
    
    this.configurationservice.Departmenteditgrid(element.Item.DepartmentID )
      .then((res) => {
        var editDepartment= res;
        let editDetailsofDepartment= this.MatDialog.open( DepartmentAddComponent, {
          data: editDepartment,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofDepartment.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getDepartmentGridData();
          }
        });
      });
  }

  //#endregion

  //#region "deleteDepartmentce"
  DeleteDepartment(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteDepartment(element.Item.DepartmentID ).then((res) => {
            this.getDepartmentGridData();
          });
        }
      });
  }
  //#endregion

        
    }

