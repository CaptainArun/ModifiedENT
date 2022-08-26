import { Component, OnInit } from '@angular/core';
import { NewPatientService } from '../newPatient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { patientInsurancemodel } from '../models/patientInsuranceModel';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { MatDialog } from '@angular/material';
import { PatientInsuranceViewRecordComponent } from './patient-insurance-view-record/patient-insurance-view-record.component';
import { PatientInsuranceEditRecordComponent } from './patient-insurance-edit-record/patient-insurance-edit-record.component';
import { PatientInsuranceAddRecordComponent } from './patient-insurance-add-record/patient-insurance-add-record.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-insurance',
  templateUrl: './patient-insurance.component.html',
  styleUrls: ['./patient-insurance.component.css']
})
export class PatientInsuranceComponent implements OnInit {

  insuranceModel: patientInsurancemodel = new patientInsurancemodel;
  tableConfig: TableConfig = new TableConfig();

  visitDateTime: any[] = [];
  recordedduring: any = '';
  visitID: any;
  totalInfo: any;
  recordedBy: any[] = [];
  facilityId: number;
  getDate: Date;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  patientRelationship: any[] = [];
  patientId: any;

  constructor(public newPatientService: NewPatientService, public insurance: FormBuilder, public dialog: MatDialog, public custHTTP: CustomHttpService, public activateRoute: ActivatedRoute, private config: UtilService) {

    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;

    this.tableConfig.columnConfig = [
      {
        PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '', isVisible: true
      },
      { PropertyName: 'PolicyNo', DisplayName: 'Policy No', DisplayMode: 'Text', LinkUrl: '' },

      { PropertyName: 'InsuranceType', DisplayName: 'Insurance Type', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'InsuranceCategory', DisplayName: 'Insurance Category', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'InsuranceCompany', DisplayName: 'Insurance Company', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Proposer', DisplayName: 'Proposer', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'RelationshipToPatient', DisplayName: 'Relationship To Patient', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'GroupPolicyNo', DisplayName: 'Group Policy Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'ValidFrom', DisplayName: 'Valid From', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'ValidTo', DisplayName: 'Valid To', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
    ];
  }

  ngOnInit() {

    this.custHTTP.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.newPatientService.patientId = this.patientId;
    });

    this.getTotalPatientInsurance();

  }


  getTotalPatientInsurance() {

    this.newPatientService.GetPatientInsuranceList(this.newPatientService.patientId).then(res => {
      this.totalInfo = res;
    })
  }


  viewInsurance(data: any) {

    this.newPatientService.GetPatientInsuranceRecordbyID(data.Item.InsuranceID).then(res => {
      var insuranceDetails = res;
      const viewdetails = this.dialog.open(PatientInsuranceViewRecordComponent, {
        data: insuranceDetails,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      })
    })
  }

  updateInsurance(element: any) {

    this.newPatientService.GetPatientInsuranceRecordbyID(element.Item.InsuranceID).then(res => {
      var insuranceData = res;
      const editDetails = this.dialog.open(PatientInsuranceEditRecordComponent, {
        data: insuranceData,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      })
      editDetails.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTotalPatientInsurance();
        }
      })
    })
  }

  deleteInsurance(data: any) {

    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.newPatientService.DeleteInsuranceRecord(data.Item.InsuranceID).then(res => {

            this.getTotalPatientInsurance();
          })
        }
      });

    
  }

  addInsurance() {
    this.newPatientService.GetPatientInsuranceList(this.patientId).then(res => {
      var addDetails = res;
      const viewDetails = this.dialog.open(PatientInsuranceAddRecordComponent, {
        data: addDetails,
        height: 'auto',
        width: 'auto',
        autoFocus: false,

      });
      viewDetails.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.getTotalPatientInsurance();
        }
      })
    });

  }
}
