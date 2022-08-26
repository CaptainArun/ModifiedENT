import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { MatDialog } from '@angular/material';
import { ViewPatientVisitComponent } from './view-patient-visit/view-patient-visit.component';
import { EditPatientVisitComponent } from './edit-patient-visit/edit-patient-visit.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.css']
})
export class PatientVisitComponent implements OnInit {
  patientId: number;
  tableConfig: TableConfig = new TableConfig();
  Visitdata: any;

  constructor(public newPatsvc: NewPatientService, public custHttp: CustomHttpService,private config: UtilService, public dialog: MatDialog, public activateRoute: ActivatedRoute) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;

    this.tableConfig.columnConfig = [

      { PropertyName: 'VisitNo', DisplayName: 'Visit No', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'VisitDate', DisplayName: 'Visit Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },
      { PropertyName: 'Visittime', DisplayName: 'Visit Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RecordedDate', DisplayName: 'Recorded Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'RecordedDate', DisplayName: 'Recorded Time', DisplayMode: 'DateTime', FormatString: 'h:mm a', LinkUrl: '' },
      { PropertyName: 'recordedDuring', DisplayName: 'Recorded During', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'RecordedBy', DisplayName: 'Recorded By', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'RecordedDuringID', DisplayName: 'Recorded During', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'UrgencyTypeID', DisplayName: 'Urgency Type', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'PatientArrivalConditionID', DisplayName: 'Patient Arrival Condition', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'FacilityID', DisplayName: 'Facility', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'ToConsult', DisplayName: 'To Consult', DisplayMode: 'Text',  LinkUrl: '' },
      // { PropertyName: 'ProviderID', DisplayName: 'Provider', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'ReferringFacility', DisplayName: 'Referring Facility', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ReferringProvider', DisplayName: 'Referring Provider', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ConsultationType', DisplayName: 'Consultation Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ChiefComplaint', DisplayName: 'Chief Complaint', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AccompaniedBy', DisplayName: 'Accompanied By', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'TokenNumber', DisplayName: 'Token Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Appointment', DisplayName: 'Appointment', DisplayMode: 'Text', LinkUrl: '' },
      // { PropertyName: 'PatientNextConsultation', DisplayName: 'Patient Next Consultation', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'AdditionalInformation', DisplayName: 'Additional Information', DisplayMode: 'Text', LinkUrl: '' },
     // { PropertyName: 'VisitReason', DisplayName: 'Visit Reason', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'patientArrivalCondition', DisplayName: 'Patient Arrival Condition', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'urgencyType', DisplayName: 'Urgency Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'visitStatus', DisplayName: 'Visit Status', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'visitType', DisplayName: 'Visit Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ProviderName', DisplayName: 'Provider Name', DisplayMode: 'Text', LinkUrl: '' },
    ];
  }

  ngOnInit() {
    /*this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
    });*/
    this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.newPatsvc.patientId = this.patientId;
    });
    this.getPatientVsitforPatient();
  }

  /*openAddUpdateform() {
    const dialogRef = this.dialog.open(AddProcedureComponent, {
      //data: patientForm,
      height: '630px',
      width: '1650px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "update") {
        this.getProcedureforPatient();
      }
    });
  }*/

  openVisitViewRecord(element: any) {

    this.newPatsvc.getPatientVisitbyId(element.Item.VisitId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(ViewPatientVisitComponent, {
        data: patientDetail,
        height: 'auto',
        width: '1200px',
        autoFocus: false,
      });
    });
  }

  openVisitEditRecord(element: any) {
    this.newPatsvc.getPatientVisitbyId(element.Item.VisitId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(EditPatientVisitComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getPatientVsitforPatient();
        }
      });
    });
  }


//delete 
  deleteProcedurePatient(element: any){
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
       if (res == true) {
         this.newPatsvc.deleteProcedureRecord(element.Item.VisitId).then(res => {
          this.getPatientVsitforPatient();
       })
         }
        });
    }

  getPatientVsitforPatient() {
    this.newPatsvc.getPatientVisit(this.patientId).then(res => {
      this.Visitdata = res;      
    })
  }
}


