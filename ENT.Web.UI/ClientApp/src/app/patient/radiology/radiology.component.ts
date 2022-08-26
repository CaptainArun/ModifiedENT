import { Component, OnInit } from '@angular/core';
import { NewPatientService } from '../newPatient.service';
import { TableConfig } from '../../ux/columnConfig';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { MatDialog } from '@angular/material';
import { RadiologyViewComponent } from './radiology-view/radiology-view.component';
import { RadiologyEditComponent } from './radiology-edit/radiology-edit.component';
import { RadiologyAddComponent } from './radiology-add/radiology-add.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-radiology',
  templateUrl: './radiology.component.html',
  styleUrls: ['./radiology.component.css']
})

export class RadiologyComponent implements OnInit {
  RadiologyOrderForm: FormGroup;
  tableConfig: TableConfig = new TableConfig();
  patientId: number = 1;
  radiologyRec: any;

  constructor(public serv: NewPatientService, public fb: FormBuilder, public customHttp: CustomHttpService, public dialog: MatDialog, public activateRoute: ActivatedRoute, private config: UtilService) {
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
      { PropertyName: 'OrderingPhysician', DisplayName: 'Ordering Physician', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'RadiologyProcedure', DisplayName: 'Procedure Requested', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Type', DisplayName: 'Type', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Section', DisplayName: 'Section', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'PrimaryICD', DisplayName: 'Primary ICD Code', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'ProcedureRequestedDate', DisplayName: 'Procedure Request Date', DisplayMode: 'DateTime', FormatString:"dd-MM-yyyy", LinkUrl: '', isVisible: true },
    ]   
  }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.serv.patientId = this.patientId;
    });
    this.getRadiologyRecord();
  }

  getRadiologyRecord() {
    this.serv.getRadiologyRecord(this.patientId).then(res => {
      this.radiologyRec = res;
    });
  }

  openAddRadiologyForm() {
    const dialogRef = this.dialog.open(RadiologyAddComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'update') {
        this.getRadiologyRecord();
      }
    });
  }
  
  openRadiologyViewRecord(element: any) {
    this.serv.getRadiologyRecordbyId(element.Item.RadiologyID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(RadiologyViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
    }); 
  }

  openRadiologyEditRecord(element: any) {
    this.serv.getRadiologyRecordbyId(element.Item.RadiologyID).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(RadiologyEditComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'update') {
          this.getRadiologyRecord();
        }
      });
    });
  }
 
  deleteRadiologyRecord(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.serv.deleteRadiologyRec(element.Item.RadiologyID).then(res => {
            this.getRadiologyRecord();
          });
        }
      });
    }

}
