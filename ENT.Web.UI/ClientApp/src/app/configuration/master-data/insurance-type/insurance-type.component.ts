import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addInsuranceTypeComponent } from './add-insurance-type/add-insurance-type.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "insuranceComponent",
  styleUrls: ["./insurance-type.component.css"],
  templateUrl: './insurance-type.component.html'
})

export class InsuranceComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  insurancegrid: any;
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
      { PropertyName: 'InsuranceTypeCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'InsuranceTypeDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getinsuranceGridData();
  }
  getinsuranceGridData() {
    this.configurationservice.Insurancegrid().then((res) => {
      this.insurancegrid = res;
    }
    );
  }
  //#region "AddInsurance"

  addNewinsurance() {
    const newInsurance = this.MatDialog.open(addInsuranceTypeComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newInsurance.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getinsuranceGridData();
      }
    });
  }
  //#endregion

  //#region "EditInsurance"

  editInsurance(element: any) {
    this.configurationservice.Insuranceeditgrid(element.Item.InsuranceTypeID)
      .then((res) => {
        var editinsurance = res;
        let editDetailsofinsurance = this.MatDialog.open(addInsuranceTypeComponent, {
          data: editinsurance,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofinsurance.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getinsuranceGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteInsurance"
  deleteInsurance(element: any) {
    this.config
      .showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteInsurance(element.Item.InsuranceTypeID).then((res) => {
            this.getinsuranceGridData();
          });
        }
      });
  }
  //#endregion

}
