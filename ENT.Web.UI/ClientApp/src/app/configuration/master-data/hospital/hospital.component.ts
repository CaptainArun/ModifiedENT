import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { AddHospital } from './add-hospital/add-hospital.component'

@Component({
  selector: "app-ProcedureTypeComponent",
  styleUrls: ["./hospital.component.css"],
  templateUrl: './hospital.component.html'
})
export class HospitalComponent implements OnInit {

  tableConfig: TableConfig = new TableConfig;

  constructor(private config: UtilService, public MatDialog: MatDialog) {

    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.showOpen = true;
    this.tableConfig.columnConfig = [
      { PropertyName: 'AdmissionDateTime', DisplayName: 'Code', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
      { PropertyName: 'admissionTypeDesc', DisplayName: 'Description', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'order', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProviderName', DisplayName: 'ID', DisplayMode: 'Text', LinkUrl: '' },

    ];
  }
  ngOnInit() {

  }
  addNewSpeciality() {
    const newSpeciality = this.MatDialog.open(AddHospital, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newSpeciality.afterClosed().subscribe((result) => {
      if (result == "Updated") {
      }
    });
  } 
}
