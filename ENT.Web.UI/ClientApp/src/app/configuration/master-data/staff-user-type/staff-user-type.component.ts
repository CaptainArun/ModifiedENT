import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { staffUserAddComponent } from "./add-staff-user/add-staff-user-type.component"
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-staffUserType",
  templateUrl: './staff-user-type.component.html',
  styleUrls: ["./staff-user-type.component.css"],
})

export class staffUserTypeComponent implements OnInit {

  tableConfig: TableConfig = new TableConfig;
  staffUserGrid: any;

  //region constructor
  constructor(private config: UtilService, public MatDialog: MatDialog, public CustHttp: CustomHttpService, public configurationservice: ConfigurationService,) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.showOpen = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'UserTypeCode', DisplayName: 'User Type Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'UserTypeDescription', DisplayName: 'User Type Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order No', DisplayMode: "Text", LinkUrl: '', width: "15%", },
    ];
  }
  //endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getStaffUserGridData();
  }

  //region To get grid Data
  getStaffUserGridData() {
    this.configurationservice.getAllStaffUserData().then((res) => {
      this.staffUserGrid = res;
    }
    );
  }
  //regionend

  //region To add data to grid
  addNewStaffUser() {
    const newStaffUserType = this.MatDialog.open(staffUserAddComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newStaffUserType.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getStaffUserGridData();
      }
    });
  }
  //regionend 

  //region To Edit values of grid
  editStaffUserGrid(element: any) {
    this.configurationservice.getStaffUserById(element.Item.UserTypeId)
      .then((res) => {
        let editStaffUserGrid = res;
        let editDetailofStaffUser = this.MatDialog.open(staffUserAddComponent, {
          data: editStaffUserGrid,
          height: "auto",
          width: "25%",
          autoFocus: false,
        });
        editDetailofStaffUser.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getStaffUserGridData();
          }
        });
      });
  }
  //regionend

  //region To delete Data from grid
  deleteStaffUser(element: any) {
    this.config
      .showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deleteRecordofStaffUser(element.Item.UserTypeId).then((res) => {
            this.getStaffUserGridData()
          });
        }
      });
  }
  //regionend




}