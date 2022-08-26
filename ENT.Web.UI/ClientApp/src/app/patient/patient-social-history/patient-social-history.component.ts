import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { CustomHttpService } from '../../core/custom-http.service';
import { NewPatientService } from '../newPatient.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PatientSocialHistoryAddComponent } from './patient-social-history-add/patient-social-history-add.component';
import { PatientSocialHistoryViewComponent } from './patient-social-history-view/patient-social-history-view.component';
import { PatientSocialHistoryEditComponent } from './patient-social-history-edit/patient-social-history-edit.component';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-patient-social-history',
  templateUrl: './patient-social-history.component.html',
  styleUrls: ['./patient-social-history.component.css']
})
export class PatientSocialHistoryComponent implements OnInit {

  tableConfig: TableConfig = new TableConfig();
  socialHistory: any;
  patientId: number;
  smokingStatus: string;
  drinkingStatus: string;
  constructor(public serv: NewPatientService, public fb: FormBuilder, public customHttp: CustomHttpService, public dialog: MatDialog, public activateRoute: ActivatedRoute, private config: UtilService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;


    this.tableConfig.columnConfig = [
      {PropertyName: 'visitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '', isVisible: true  },
      { PropertyName: 'Smoking', DisplayName: 'Smoking Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      {
        PropertyName: 'CigarettesPerDay', DisplayName: 'No of Cigarettes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Drinking', DisplayName: 'Drinking Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'ConsumptionPerDay', DisplayName: 'Alcohol Consumed', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'DrugHabitsDetails', DisplayName: 'Drug Habits', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'LifeStyleDetails', DisplayName: 'Lifestyle', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'CountriesVisited', DisplayName: 'Countries Visited', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      /*{ PropertyName: 'DailyActivities', DisplayName: 'Daily Activities', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'AdditionalNotes', DisplayName: 'Additonal Notes', DisplayMode: 'Text', LinkUrl: '', isVisible: true },*/
      


    ];
  }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.activateRoute.params.subscribe(params => {
      this.patientId = params['PatientId']
      this.serv.patientId = this.patientId;
    });

    this.getSocialHistory();
  }
  openAddUpdateform() {
    const dialogRef = this.dialog.open(PatientSocialHistoryAddComponent, {

      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "update") {
        this.getSocialHistory();
      }
    });
  }


  openSocialHistoryView(element: any) {
   
    this.serv.getSocialHistorybyId(element.Item.SocialHistoryId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(PatientSocialHistoryViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });

    });

  }

  openSocialHistoryEdit(element: any) {
   
    this.serv.getSocialHistorybyId(element.Item.SocialHistoryId).then(data => {
     
      var patientDetail = data;
      const dialogRef = this.dialog.open(PatientSocialHistoryEditComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getSocialHistory();
        }
      });
    });
    
  }

  getSocialHistory() {
    this.serv.getSocialHistorylist(this.serv.patientId).then(res => {
      this.socialHistory = res;
      for (var i = 0; i < res.length; i++) {
        if (this.socialHistory[i].Smoking == 1) {
          this.smokingStatus = "yes"
          this.socialHistory[i].Smoking = this.smokingStatus
        }
        if (this.socialHistory[i].Smoking == 2) {
          this.smokingStatus = "No"
          this.socialHistory[i].Smoking = this.smokingStatus
        }
        if (this.socialHistory[i].smoking == 3) {
          this.smokingStatus = "Occasional"
          this.socialHistory[i].Smoking = this.smokingStatus
        }
      }


      for (var j = 0; j < res.length; j++){
        if (this.socialHistory[j].Drinking == 1) {
          this.drinkingStatus = "Yes"
          this.socialHistory[j].Drinking = this.drinkingStatus
        }
        if (this.socialHistory[j].Drinking == 2) {
          this.drinkingStatus = "No"
          this.socialHistory[j].Drinking = this.drinkingStatus
        }
        if (this.socialHistory[j].Drinking == 3) {
          this.drinkingStatus = "Occasional"
          this.socialHistory[j].Drinking = this.drinkingStatus
        }
      }
    })
  }

  deleteSocialHistory(element: any) {
    this.config.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.serv.deleteSocialHistory(element.Item.SocialHistoryId).then(res => {

            this.getSocialHistory();
          })
        }
      });
  }
}
