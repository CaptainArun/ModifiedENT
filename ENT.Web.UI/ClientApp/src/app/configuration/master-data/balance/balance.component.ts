import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { BalanceAddComponent } from "./add-balance/add-balance.component";


@Component({
    selector: "app-balance",
      styleUrls: ["./balance.component.css"],
    templateUrl: './balance.component.html'
    })
    export class BalanceComponent implements OnInit{
      //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  balancegrid: any;
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
      { PropertyName: 'FCBalanceCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'FCBalanceDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getBalanceGridData();
  }
  getBalanceGridData() {
    this.configurationservice.Balancegrid().then((res) => {
      this.balancegrid = res;
      
    }
    );
  }
  //#region "AddBalance"

  addNewBalance() {
    const newBalance = this.MatDialog.open(BalanceAddComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newBalance.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getBalanceGridData();
      }
    });
  }
  //#endregion

  //#region "EditBalance"

  editBalance(element: any) {
    this.configurationservice.Balanceeditgrid(element.Item.FCBalanceID )
      .then((res) => {
        var editBalance = res;
        let editDetailsofBalance = this.MatDialog.open(BalanceAddComponent, {
          data: editBalance,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofBalance.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getBalanceGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteBalance"
  DeleteBalance(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.Deletebalance(element.Item.FCBalanceID ).then((res) => {
            this.getBalanceGridData();
          });
        }
      });
  }
  //#endregion

        
    }

