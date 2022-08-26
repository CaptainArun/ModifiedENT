import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { StaffActivityAddComponent } from "./add-staff-activity/add-staff-activity-type.component"
@Component({
  selector: "app-StaffActivityTypeComponent",
  templateUrl: './staff-activity-type.component.html',
  styleUrls: ["./staff-activity-type.component.css"],
})

export class StaffActivityTypeComponent implements OnInit {

  tableConfig: TableConfig = new TableConfig;
  staffActivityGrid: any;

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
      { PropertyName: 'ActivityTypeCode', DisplayName: 'Activity Type Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'ActivityTypeDescription', DisplayName: 'Activity Type Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order No ', DisplayMode: "Text", LinkUrl: '', width: "15%", },
    ];
  }
  //endregion

  ngOnInit(): void {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getStaffActivityGridData();
  }

  //region to get data to grid
  getStaffActivityGridData() {
    this.configurationservice.getAllStaffActivity().then((res) => {
      this.staffActivityGrid = res;
    }
    );
  }
  //endregion

  //region To add data to grid
  addNewStaffActivity() {
    const newStaffActivityType = this.MatDialog.open(StaffActivityAddComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newStaffActivityType.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getStaffActivityGridData();
      }
    });
  }
  //endregion 

  //region To Edit values of grid
  editStaffActivityGrid(element: any) {
    this.configurationservice.getStaffActivitybyId(element.Item.ActivityTypeId)
      .then((res) => {
        let editStaffGrid = res;
        let editDetailofStaffActivity = this.MatDialog.open(StaffActivityAddComponent, {
          data: editStaffGrid,
          height: "auto",
          width: "25%",
          autoFocus: false,
        });
        editDetailofStaffActivity.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getStaffActivityGridData();
          }
        });
      });
  }
  //endregion

  //region To delete Data from grid
  deleteStaffActivityGrid(element: any) {
    this.config
      .showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deleteRecordOfStaffActivity(element.Item.ActivityTypeId).then((res) => {
            this.getStaffActivityGridData();
          });
        }
      });
  }
  //endregion



}