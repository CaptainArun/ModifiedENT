import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addSectionComponent } from './add-section/add-section.component'
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-section",
  styleUrls: ["./section.component.css"],
  templateUrl: './section.component.html'
})

export class sectionComponent implements OnInit {
    //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  sectiongrid: any;
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
      { PropertyName: 'BodySectionCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%",},
      { PropertyName: 'BodySectionDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
    //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getsectionGridData();
  }
  getsectionGridData() {
    this.configurationservice.sectioncategorygrid().then((res) => {
      this.sectiongrid = res;
    }
    );
  }
      //#region "Addsection"

  addNewsection() {
    const newsection = this.MatDialog.open(addSectionComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newsection.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getsectionGridData();
      }
    });
  }
      //#endregion

    //#region "Editsection"

  editsection(element: any) {
    this.configurationservice.sectioneditgridcategory(element.Item.BodySectionID)
      .then((res) => {
        var editsection = res;
        let editDetailsofsection = this.MatDialog.open(addSectionComponent, {
          data: editsection,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofsection.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getsectionGridData();
          }
        });
      });
  }
      //#endregion

  //#region "deletesection"
  deletesection(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.Deletedsection(element.Item.BodySectionID).then((res) => {            
              this.getsectionGridData();
            });
        }
      });
  }
      //#endregion

}
