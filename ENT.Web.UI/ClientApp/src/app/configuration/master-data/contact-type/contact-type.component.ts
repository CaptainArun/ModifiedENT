import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addContactTypeComponent } from './add-contact-type/add-contact-type.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-contacttypecomponent",
  styleUrls: ["./contact-type.component.css"],
  templateUrl: './contact-type.component.html'
})

export class ContactTypeComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  contactgrid: any;
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
      { PropertyName: 'ContactTypeCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'ContactTypeDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getcontacttypeGridData();
  }
  getcontacttypeGridData() {
    this.configurationservice.getcontacttype().then((res) => {
      this.contactgrid = res;
    }
    );
  }
  //#region "AddContact"

  addconatct() {
    const newContact = this.MatDialog.open(addContactTypeComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newContact.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getcontacttypeGridData();
      }
    });
  }
  //#endregion

  //#region "editContact"

  editcontact(element: any) {
    this.configurationservice.getconatcttypeid(element.Item.ContactTypeId)
      .then((res) => {
        var editContact = res;
        let editDetailsofcontact = this.MatDialog.open(addContactTypeComponent, {
          data: editContact,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofcontact.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getcontacttypeGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteContact"
  deletedContact(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deletecontacttype(element.Item.ContactTypeId).then((res) => {
            this.getcontacttypeGridData();
          });
        }
      });
  }
  //#endregion

}
