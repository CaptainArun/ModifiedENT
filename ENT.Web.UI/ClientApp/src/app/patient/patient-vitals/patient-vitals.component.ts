import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { MatDialog } from '@angular/material';
import { PatientVitalViewComponent } from './patient-vital-view/patient-vital-view.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  Vitals: any;
  patientId: number;


  constructor(public serv: NewPatientService, public customHttp: CustomHttpService, public dialog: MatDialog, public activateRoute: ActivatedRoute, private config: UtilService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = false;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;


    this.tableConfig.columnConfig = [
      { PropertyName: 'visitDateandTime', DisplayName: 'visit Date and Time', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Height', DisplayName: 'Height', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Weight', DisplayName: 'Weight', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'IsDiabetic', DisplayName: 'Diabetic', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'IsBloodPressure', DisplayName: 'High Blood Pressure', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Temperature', DisplayName: 'Temperature', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'HeartRate', DisplayName: 'Heart Rate', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'RespiratoryRate', DisplayName: 'Respiratory Rate', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'O2Saturation', DisplayName: 'O2 Saturation', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BPDiastolic', DisplayName: 'BP Diastolic', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BPSystolic', DisplayName: 'BP Systolic', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BloodsugarRandom', DisplayName: 'Blood sugar (Random)', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BloodsugarFasting', DisplayName: 'Blood sugar (Fasting)', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BloodSugarPostpardinal', DisplayName: 'Blood sugar (PP)', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'PainScaleDesc', DisplayName: 'Pain Scale', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
           
    ];
  }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.serv.patientId = this.patientId;
    });
    this.getVitalsforPatient();

  }
//#region "Bind Table Data"
// set data from char to String in Table
  onBindItem(event: any) {   
    if (event.Item) {     
      if (event.Item.IsDiabetic == "y") {
        event.Item.IsDiabetic = "Yes";
      }
      else if(event.Item.IsDiabetic == "n") {
        event.Item.IsDiabetic = "No";      
    }
    else{
      event.Item.IsDiabetic = "Unknown";
  }
}
if (event.Item) {     
  if (event.Item.IsBloodPressure == "y") {
    event.Item.IsBloodPressure = "Yes";
  }
  else if(event.Item.IsBloodPressure == "n") {
    event.Item.IsBloodPressure = "No";      
}
else{
  event.Item.IsBloodPressure = "Unknown";
}
}
  }
  //#endregion

  openViewVitalsforPatient(element: any) {
    this.serv.getVitalsForPatientbyId(element.Item.VitalsId).then(data => {     
      var patientDetail = data;
      const dialogRef = this.dialog.open(PatientVitalViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });

    });
  }

  getVitalsforPatient() {
    this.serv.getvitalsforPatient(this.serv.patientId).then(res => {
      this.Vitals = res;   
    })
  }

  deleteVitalsforPatient(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.serv.deleteVitalsforPatient(element.Item.VitalsId).then(res => {
            this.getVitalsforPatient();
          })
        }
      });
  }
}
