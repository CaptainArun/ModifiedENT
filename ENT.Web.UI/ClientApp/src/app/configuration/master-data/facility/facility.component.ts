import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { facilityAddComponent } from './add-facility/add-facility.component';

@Component({
  selector: "app-facilityComponent",
  templateUrl: './facility.component.html',
  styleUrls: ["./facility.component.css"],
})
export class facilityComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig;
  facilityGrid: any;

  constructor(private config: UtilService, public MatDialog: MatDialog, public CustHttp: CustomHttpService, public configurationservice: ConfigurationService,) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;
    this.tableConfig.showOpen = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: "Text", LinkUrl: '', width: "35%", },
      { PropertyName: 'Email', DisplayName: 'Email', DisplayMode: "Text", LinkUrl: '', width: "25%", },
      { PropertyName: 'State', DisplayName: 'State', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'Telephone', DisplayName: 'Telephone', DisplayMode: "Text", LinkUrl: '', width: "25%", },
    ];
  }

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getFacilityGridData();
  }

  getFacilityGridData() {
    this.configurationservice.getAllFacilityData().then((res) => {
      this.facilityGrid = res;
    }
    );
  }

  //#region "AddFacility"
  addNewFacility() {
    const newFacility = this.MatDialog.open(facilityAddComponent, {
      height: "auto",
      width: "70%",
      autoFocus: false,
    });
    newFacility.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getFacilityGridData();
      }
    });
  }
  //#endregion

  //#region "editFacility"
  editFacilityGrid(element: any) {
    this.configurationservice.getFacilityById(element.Item.FacilityId)
      .then((res) => {
        let editFacility = res;
        let editDetailofFacility = this.MatDialog.open(facilityAddComponent, {
          data: editFacility,
          height: "auto",
          width: "70%",
          autoFocus: false,
        });
        editDetailofFacility.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getFacilityGridData();
          }
        });
      });
  }
  //#endregion
}

