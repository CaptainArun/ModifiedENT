import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../core/custom-http.service';
import { DiagnosisAddComponent } from './diagnosis-add/diagnosis-add.component';
import { DiagnosisViewComponent } from './diagnosis-view/diagnosis-view.component';
import { DiagnosisEditComponent } from './diagnosis-edit/diagnosis-edit.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: any;
  diagnosisData: any;

  constructor(public newPatientService: NewPatientService, public dialog: MatDialog, public custHttp: CustomHttpService, public activateRoute: ActivatedRoute, private config: UtilService) {
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
      { PropertyName: 'ChiefComplaint', DisplayName: 'Chief Complaint', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemAreaValues', DisplayName: 'Problem Area', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemDuration', DisplayName: 'Problem Duration', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'SymptomsValues', DisplayName: 'Symptoms', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PainScaleDesc', DisplayName: 'Pain level', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemTypeValues', DisplayName: 'Problem Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProblemStatus', DisplayName: 'Problem Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ICD10', DisplayName: 'Primary ICD Code', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.newPatientService.patientId = this.patientId;
    });
    this.getDiagnosisRecord();
  }

  // Grid
  getDiagnosisRecord() {
    this.newPatientService.getDiagnosisforPatient(this.patientId).then(res => {
      this.diagnosisData = res;
    });
  }

  // Add record
  openAddDiagnosisForm() {
    const dialogRef = this.dialog.open(DiagnosisAddComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Update") {
        this.getDiagnosisRecord();
      }
    });
  }

  // View record
  openDiagnosisViewRecord(element: any) {
    this.newPatientService.getDiagnosisbyId(element.Item.DiagnosisId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(DiagnosisViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
    });
  }

  // Edit record
  openDiagnosisEditRecord(element: any) {
    this.newPatientService.getDiagnosisbyId(element.Item.DiagnosisId).then(data => {
      var patientDetail = data;
      let dialogRef = this.dialog.open(DiagnosisEditComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getDiagnosisRecord();
        }
      });
    });
  }

  // Delete record
  deleteDiagnosisRecord(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.newPatientService.deleteDiagnosisRecord(element.Item.DiagnosisId).then(res => {
            this.getDiagnosisRecord();
          });
        }
      });
  }

}
