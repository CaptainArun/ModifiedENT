import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientWorkHistoryModel } from '../models/PatientWorkHistoryModel';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { MatDialog, MatIcon } from '@angular/material';
import { WorkHistoryViewComponent } from './work-history-view/work-history-view.component';
import { WorkHistoryEditComponent } from './work-history-edit/work-history-edit.component';
import { WorkHistoryAddComponent } from './work-history-add/work-history-add.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';


@Component({
  selector: 'app-patient-work-history',
  templateUrl: './patient-work-history.component.html',
  styleUrls: ['./patient-work-history.component.css']
})
export class PatientWorkHistoryComponent implements OnInit {

  PatientWorkHistoryForm: FormGroup;

  PatientWorkHistoryModel: PatientWorkHistoryModel = new PatientWorkHistoryModel();

  //identification: any[] = [];
  //visitDandT: any[] = [];
  tableData: any;
  //recordby: any[] = [];
  //recordedDuring: any = '';
  //visitID: number;

  patientId: number = 1;
  //facilityID: number = 0;
  tableConfig: TableConfig = new TableConfig();

  constructor(public fb: FormBuilder, public patientService: NewPatientService, public customhttp: CustomHttpService, public dialogue: MatDialog, public activateRoute: ActivatedRoute, public config: UtilService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;


    this.tableConfig.columnConfig = [
      {
        PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '', isVisible: true  },

      { PropertyName: 'EmployerName', DisplayName: 'Employer', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {
        PropertyName: 'ContactPerson', DisplayName: 'Contact Person', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {
        PropertyName: 'PhoneNo', DisplayName: 'Phone Number', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Email', DisplayName: 'Email', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'CellPhone', DisplayName: 'Cell Phone', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'WorkDateFrom', DisplayName: 'From Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },
      {
        PropertyName: 'WorkDateTo', DisplayName: 'To Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '', isVisible: true },

      /*{ PropertyName: 'AddressLine1', DisplayName: 'Address Line1', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'AddressLine2', DisplayName: 'Address Line2', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Town', DisplayName: 'Town', DisplayMode: 'Text', LinkUrl: '', isVisible: false },
      { PropertyName: 'City', DisplayName: 'City', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'District', DisplayName: 'District', DisplayMode: 'Text', LinkUrl: '', isVisible: false },
      { PropertyName: 'State', DisplayName: 'State', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Country', DisplayName: 'Country', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'PIN', DisplayName: 'PIN', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'AdditionalNotes', DisplayName: 'AdditionalNotes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },*/


    ];
  }

  

  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.patientService.patientId = this.patientId;
      
    });
    this.getPatientWorkHistory();
  }

  
  openAddUpdateform() {
    const dialogRef = this.dialogue.open(WorkHistoryAddComponent, {
      //data: patientForm,
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "update") {
        this.getPatientWorkHistory();
      }
    });
  }
  

  

  openWorkHistoryViewRecord(element: any) {
   
    this.patientService.getPatientWorkHistorybyID(element.Item.PatientWorkHistoryID).then(data => {
      
      var patientDetail = data;
      const dialogRef = this.dialogue.open(WorkHistoryViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
   

    
    });
    
  }

  openWorkHistoryEditRecord(element: any) {
    
    this.patientService.getPatientWorkHistorybyID(element.Item.PatientWorkHistoryID).then(data => {
      
      var patientDetail = data;
      const dialogRef = this.dialogue.open(WorkHistoryEditComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getPatientWorkHistory();
        }
      });
    });
    /**/
  }

  getPatientWorkHistory() {
    this.patientService.getPatientWorkHistory(this.patientService.patientId).then(res => {
      this.tableData = res;

    })
  }

  

  deleteWorkHistory(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {


          this.patientService.deleteWorkHistory(element.Item.PatientWorkHistoryID).then(res => {
            this.getPatientWorkHistory();
          })
        }

      });
      }

}
