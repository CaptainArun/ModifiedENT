import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from '../../configuration.service';
import { RolesAddComponent } from './roles-add/roles-add.component';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
    // #region "property declaration"
    tableConfig: TableConfig = new TableConfig();
    rolesGrid: any;
    // #endregion

    // #region "constructor"
    constructor(public dialog: MatDialog, public configurationService: ConfigurationService, public customhttp: CustomHttpService) {
        this.tableConfig.showPagination = true;
        this.tableConfig.showView = false;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
        this.tableConfig.showDelete = false;
        this.tableConfig.columnConfig = [
            { PropertyName: "RoleName", DisplayName: "Name", DisplayMode: "Text", LinkUrl: "", width: "15%" },
            { PropertyName: "RoleDescription", DisplayName: "Description", DisplayMode: "Text", LinkUrl: "", width: "60%" },
            { PropertyName: "OrderNo", DisplayName: "Order", DisplayMode: "Text", LinkUrl: "", width: "15%" }
        ];
    }
    // #endregion

    // #region "ngOnInit"  
    ngOnInit() {
        this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
        this.getRolesGridData();
    }
    // #endregion

    // #region "get data for grid"  
    getRolesGridData() {
        this.configurationService.getRolesList().then(res => {
            this.rolesGrid = res;
        });
    }
    // #endregion

    // #region "add new data to Table"
    addNewRoles() {
        const newRole = this.dialog.open(RolesAddComponent, {
            height: "auto",
            width: "25%",
            autoFocus: false,
        });
        newRole.afterClosed().subscribe(result => {
            if (result == "Updated") {
                this.getRolesGridData();
            }
        });
    }
    // #endregion 

    // #region "Edit/Update Data of Table"
    editRoles(element: any) {
        this.configurationService.getRolesbyId(element.Item.RoleId).then(res => {
            var editRecordforRole = res;
            let editDetailsofRole = this.dialog.open(RolesAddComponent, {
                data: editRecordforRole,
                height: "auto",
                width: "25%",
                autoFocus: true,
            });
            editDetailsofRole.afterClosed().subscribe(result => {
                if (result == "Updated") {
                    this.getRolesGridData();
                }
            });
        });
    }
    // #endregion  

}