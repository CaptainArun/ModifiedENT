import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addInsuranceCategoryComponent } from './add-insurance-category/add-insurance-category.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "insuranceComponent",
  styleUrls: ["./insurance-category.component.css"],
  templateUrl: './insurance-category.component.html'
})

export class InsuranceCategoryComponent implements OnInit {
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
      { PropertyName: 'InsuranceCategoryCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'InsuranceCategoryDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getinsuranceGridData();
  }
  getinsuranceGridData() {
    this.configurationservice.Insurancecategorygrid().then((res) => {
      this.insurancegrid = res;
    }
    );
  }
  //#region "AddInsurance"

  addNewinsurance() {
    const newInsurance = this.MatDialog.open(addInsuranceCategoryComponent, {
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
    this.configurationservice.Insuranceeditgridcategory(element.Item.InsuranceCategoryID)
      .then((res) => {
        var editinsurance = res;
        let editDetailsofinsurance = this.MatDialog.open(addInsuranceCategoryComponent, {
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
          this.configurationservice.DeleteInsurancecategory(element.Item.InsuranceCategoryID).then((res) => {
            this.getinsuranceGridData();
          });
        }
      });
  }
  //#endregion

}
