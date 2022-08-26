import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { StaffAddComponent } from '../staff-add/staff-add.component';
import { StaffService } from '../staff.service';
import { StaffEditComponent } from '../staff-edit/staff-edit.component';
//import { StaffEditComponent } from './staff-edit/staff-edit.component';

@Component({
  selector: 'staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  //#region "Property Decleration"
  searchForm: FormGroup;
  StaffList: any;
  tableConfig: TableConfig = new TableConfig();
  staffgrid: any;
  key: any;
  value: any;
  getSpecificHeaderSearch = [];
  searchKey: any;
  //#endregion
  //#region "Constructor"

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private customHttpSvc: CustomHttpService, private staffservice: StaffService) {

this.tableConfig.showPagination = true;
this.tableConfig.showView = false;
this.tableConfig.showIcon = false;
this.tableConfig.showEdit = true;
this.tableConfig.showAdd = false;
//this.tableConfig.showDelete = true;
    this.tableConfig.showOpen = false;

    this.tableConfig.columnConfig = [
      {PropertyName: 'EmployeeNo', DisplayName: 'Employee Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'FacilityName', DisplayName: 'FacilityName', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'EmployeeFullname', DisplayName: 'Staff Name', DisplayMode: 'Text', LinkUrl: '' },
      {PropertyName: 'CellNo', DisplayName: 'Cell Number', DisplayMode: 'Text', LinkUrl: '' },
      {PropertyName: 'EmployeeDepartmentDesc', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '' },
      {PropertyName: 'RoleDesc', DisplayName: 'Role', DisplayMode: 'Text', LinkUrl: '' },
      {PropertyName: 'DOJ', DisplayName: 'DOJ', FormatString: "dd-MM-yyyy", DisplayMode: 'DateTime', LinkUrl: '' },
      {PropertyName: 'Bloodgroup', DisplayName: 'Blood group', DisplayMode: 'Text', LinkUrl: '' },
    ]; 
  }
  //#endregion
  //#region "ng onInit"

  ngOnInit() {
    this.searchForm = this.fb.group({ searchStaff: [''] })
    this.staffGrid();
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
  }
  //#endregion
  //#region "Grid"
  staffGrid() {
    if (sessionStorage.getItem("searchStaff")) {

      this.staffservice.getStaff().then(data => {
        this.StaffList = data;
        this.staffgrid = this.StaffList;
        let searchKey = sessionStorage.getItem("searchStaff");
        this.searchForm.get('searchStaff').setValue(searchKey);
        this.searchStaffdata() ? sessionStorage.removeItem("searchStaff") : false;
      });
    } else {
      this.staffservice.getStaff().then(res => {
        this.StaffList = res;
        this.staffgrid = this.StaffList;
      });
    }
  }
  //#endregion
  //#region "Search Staff"
  searchStaffdata() {
    this.searchKey = this.searchForm.get('searchStaff').value.toLowerCase();
    if (!this.searchKey) {
      return this.staffgrid = this.StaffList;
    }

    this.key = Object.keys(this.StaffList[0]);
    this.getSpecificHeaderSearch.push(this.key[7], this.key[12], this.key[4],this.key[26],this.key[51]);

    this.staffgrid = this.StaffList.filter((user) => {
      return this.getSpecificHeaderSearch.find((property) => {
        this.value = JSON.stringify(user[property]).toLowerCase();
       return this.value.includes(this.searchKey);
      })
    })
    return (this.staffgrid) ? true : false;
  }

     //#endregion
  //#region "Edit"
  editStaff(element: any) {
    this.setsessionStorage();
    this.router.navigate(['home/staff/staffedit', element.Item.EmployeeId]);

    //this.staffservice.GetEmployeeByID(element.Item.EmployeeId).then(res => {
    //  var editRecord = res;

    //  //let editDetails = this.dialog.open(StaffEditComponent, {
    //  //  data: editRecord,
    //  //  height: 'auto',
    //  //  width: 'auto',
    //  //  autoFocus: true,
    //  //});
    //  //editDetails.afterClosed().subscribe((result) => {
    //  //  if (result == "Updated") {
    //  //    this.staffGrid();
    //  //  }
    //  //});
    //})
  }
  //#endregion
  //#region "Add"
  openAddStaff() {
    const dialogRef = this.dialog.open(StaffAddComponent, {
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "updated") {
        this.staffGrid();
      }
    });
  }
  //#endregion
  //#region "Set Seesion Storage"
  setsessionStorage() {
    let searchKey = this.searchForm.get('searchStaff').value;
    sessionStorage.setItem("searchStaff", searchKey);
  }

  //#endregion

  ////#region "Set pincode"
  //setpincode(event: any) {
  //  if (event.Item) {
  //    if (event.Item.Pincode == "" && event.Item.Pincode == 0) {
  //      event.Item.Pincode = "";
  //    }
  //  }
  //  else {
  //    event.Item.Pincode;
  //  }
  //}
    //(bindItem) = "setpincode($event)"

  //  //#endregion

}
