import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { AdddPatientCarePlanComponent } from './add-patient-care-plan/add-patient-careplan.component';
import { EditPatientCarePlanComponent} from './edit-patient-care-plan/edit-patient-careplan.component'
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { ViewPatientCarePlanComponent } from './view-patient-care-plan/view-patient-careplan.component';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-careplan',
  templateUrl:'./patientcareplan.component.html',
  styleUrls: ['./patientcareplan.component.css']
})

export class PatientCarePlanComponent implements OnInit {
  patientId: number;
  tableConfig: TableConfig = new TableConfig();
  Visitdata: any;
  constructor(public newPatsvc: NewPatientService, public custHttp: CustomHttpService, public dialog: MatDialog, public activateRoute: ActivatedRoute, private config: UtilService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', FormatString: 'h:mm a', LinkUrl: '', isVisible: true },
      {
        PropertyName: 'PlanningActivity', DisplayName: 'Planned Activity', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'StartDate', DisplayName: 'Start Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },
      { PropertyName: 'EndDate', DisplayName: 'End Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },
      { PropertyName: 'CarePlanStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Progress', DisplayName: 'Progress', DisplayMode: 'Text', LinkUrl: '' },

/*      { PropertyName: 'RecordedDate', DisplayName: 'Recorded Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'recordedDuring', DisplayName: 'Recorded During', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RecordedBy', DisplayName: 'Recorded By', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Duration', DisplayName: 'Duration', DisplayMode: 'Text', LinkUrl: '' },

      { PropertyName: 'NextVisitDate', DisplayName: 'Next Visit Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },*/
    ];
  }

  ngOnInit() {
      this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.newPatsvc.patientId = this.patientId;
    });
    this.getCareplanpatient();
  }
  //view Record
  openVisitViewRecord(element: any) {
 this.newPatsvc.bindcareplanId(element.Item.CarePlanId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(ViewPatientCarePlanComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
 });
 }
  //Edit Record
  openPatientEditRecord(element: any) {
      this.newPatsvc.bindcareplanId(element.Item.CarePlanId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(EditPatientCarePlanComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getCareplanpatient();
        }
      });
    });
  }
  //Add record
 openAddUpdateform() {
    const dialogRef = this.dialog.open(AdddPatientCarePlanComponent, {
      //data: patientForm,
      height: 'auto',
      width: '1650px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Update") {
        this.getCareplanpatient();
      }
    });
  }
  //Delete Record
  deleteCarePlanPatient(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.newPatsvc.bindcareplanDelete(element.Item.CarePlanId).then(data => {
            this.getCareplanpatient();
          })
        }
      });
  }
  //Get record
  getCareplanpatient() {
  this.newPatsvc.bindcareplan(this.patientId).then(res => {
    this.Visitdata = res;
 })
  }
  setplanningactivity(event: any) {
    if (event.Item) {
      if (event.Item.PlanningActivity) {
        event.Item.PlanningActivity=window.atob(event.Item.PlanningActivity)
      }
    }
    else {
      event.Item.PlanningActivity;
    }

    //#endregion
  }
}
