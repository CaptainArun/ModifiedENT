import { Component, OnInit } from '@angular/core';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { MatDialog } from '@angular/material';
import { AddProcedureComponent } from './add-procedure/add-procedure.component';
import { ViewProcedureComponent } from './view-procedure/view-procedure.component';
import { EditProcedureComponent } from './edit-procedure/edit-procedure.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {
  patientId: number = 1;
  tableConfig: TableConfig = new TableConfig();
  ProcData: any;

  constructor(public newPatsvc: NewPatientService, public custHttp: CustomHttpService, public dialog: MatDialog, public activateRoute: ActivatedRoute, private config: UtilService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;

    this.tableConfig.columnConfig = [
      { PropertyName: 'VisitNo', DisplayName: 'Visit Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'TreatmentType', DisplayName: 'Treatment Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProcedureNotes', DisplayName: 'Procedure Notes', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PrimaryCPT', DisplayName: 'CPT Code ', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProcedureStatus', DisplayName: 'Procedure Status', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.newPatsvc.patientId = this.patientId;
    });
    this.getProcedureGridData();
  }

  getProcedureGridData() {
    this.newPatsvc.getProcedureforPatient(this.patientId).then(res => {
      this.ProcData = res;
    });
  }

  openAddProcedureForm() {
    const dialogRef = this.dialog.open(AddProcedureComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'update') {
        this.getProcedureGridData();
      }
    });
  }

  openProcedureViewRecord(element: any) {
    this.newPatsvc.getprocedurebyId(element.Item.procedureId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(ViewProcedureComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
    });
  }

  openProcedureEditRecord(element: any) {
    this.newPatsvc.getprocedurebyId(element.Item.procedureId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(EditProcedureComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'update') {
          this.getProcedureGridData();
        }
      });
    });
  }

  deleteProcedureRecord(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.newPatsvc.deleteProcedureRecord(element.Item.procedureId).then(data => {
            this.getProcedureGridData();
          });
        }
      });
  }

}
