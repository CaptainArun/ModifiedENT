import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NewPatientViewRecordComponent } from './patient-view-record/newPatient-viewRecord.component';

import { FormGroup, FormBuilder } from '@angular/forms';
import { TableConfig } from '../ux/columnConfig';
import { NewPatientService } from './newPatient.service';
import { NewPatientRegModel } from './models/newPatientRegModel';
import { CustomHttpService } from '../core/custom-http.service';
import { AddNewPatientComponent } from './add-new-patient/add-new-patient.component';
import { NewPatientEditRecordComponent } from './patient-edit-record/newPatient-editRecord.component';
import { FlexCardConfig } from '../ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css']
})
export class NewPatientComponent implements OnInit {

  searchForm: FormGroup;
  tableConfig: TableConfig = new TableConfig();
  patientList: any;
  newPatientRegModel: NewPatientRegModel = new NewPatientRegModel();
  identificationType: any;
  patientRelations: any;
  RegisterAt: string = "Primary Hospital";
  patientId: number;
  searchKey: any;
  searchData: any;
  key: any;
  value: any;
  getSpecificHeaderSearch = [];
  public PatientListCard: FlexCardConfig = new FlexCardConfig();
  showCard: any;

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    private newPatientSvc: NewPatientService, private customHttpSvc: CustomHttpService,) {
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showView = true;
    // this.tableConfig.showIcon = false;
    // this.tableConfig.showEdit = true;
    // this.tableConfig.showAdd = false;
    // //this.tableConfig.showDelete = true;
    // this.tableConfig.showOpeningItem = true;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientFullName', DisplayName: 'Patient Full Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PrimaryContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'MRNo', DisplayName: 'MR#', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Gender', DisplayName: 'Gender', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientAge', DisplayName: 'Age', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientCategory', DisplayName: 'Patient Category', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Bloodgroup', DisplayName: 'Blood group', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Emergencycontactnumber', DisplayName: 'Emergency Contact Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'NKFirstname', DisplayName: 'Next of Kin Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'NKPrimarycontactnumber', DisplayName: 'Next of Kin Contact', DisplayMode: 'Text', LinkUrl: '' }
    // ];

    
    this.PatientListCard.FlexDataConfig = [
      //Header
      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
      { PropertyName: 'PatientFullName', DisplayName: 'Patient Name', SectionType: "Header" },
      { PropertyName: 'PrimaryContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNo', DisplayName: 'MR Number', SectionType: "Header" },

      //Content

      { PropertyName: 'Gender', DisplayName: 'Gender', SectionType: "Content" },
      { PropertyName: 'PatientAge', DisplayName: 'Age', SectionType: "Content" },
      { PropertyName: 'PatientCategory', DisplayName: 'Category', ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'Bloodgroup', DisplayName: 'Bloodgroup', SectionType: "Content" },
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content" },
    //{ PropertyName: 'PrimaryContactNumber', DisplayName: 'Contact Number', SectionType: "Content" },

    ];

    //Icons 
    this.PatientListCard.showView = true;
    this.PatientListCard.showEdit = true;
    this.PatientListCard.showOpeningItem = true;


  }

  patientHist(element: any) {
    this.setsessionStorage();
    this.patientId = element.Item.PatientId;
    let urlRedirect1 = 'home/newPatient/patientHistory/' + this.patientId + '/workhistory';
    let urlRedirect2 = 'home/newPatient/patientHistory/' + this.patientId + '/socialhistory';
    let urlRedirect3 = 'home/newPatient/patientHistory/' + this.patientId + '/PatientFamilyHistory';
    let urlRedirect4 = 'home/newPatient/patientHistory/' + this.patientId + '/patientVitals';
    let urlRedirect5 = 'home/newPatient/patientHistory/' + this.patientId + '/patientProblemlist';
    let urlRedirect6 = 'home/newPatient/patientHistory/' + this.patientId + '/patientAllergy';
    let urlRedirect7 = 'home/newPatient/patientHistory/' + this.patientId + '/patientMedication';
    let urlRedirect8 = 'home/newPatient/patientHistory/' + this.patientId + '/patientROS';
    let urlRedirect9 = 'home/newPatient/patientHistory/' + this.patientId + '/patientNutrition';
    let urlRedirect10 = 'home/newPatient/patientHistory/' + this.patientId + '/PatientVisit';

    let urlRedirect11 = 'home/newPatient/patientHistory/' + this.patientId + '/Diagnosis';
    let urlRedirect12 = 'home/newPatient/patientHistory/' + this.patientId + '/Procedure';
    let urlRedirect13 = 'home/newPatient/patientHistory/' + this.patientId + '/audiology';
    let urlRedirect14 = 'home/newPatient/patientHistory/' + this.patientId + '/radiology';
    let urlRedirect15 = 'home/newPatient/patientHistory/' + this.patientId + '/patientCognitive';
    let urlRedirect16 = 'home/newPatient/patientHistory/' + this.patientId + '/hospitalHistory';
    let urlRedirect17 = 'home/newPatient/patientHistory/' + this.patientId + '/PatientCarePlan';
    let urlRedirect18 = 'home/newPatient/patientHistory/' + this.patientId + '/Immunization';
    let urlRedirect19 = 'home/newPatient/patientHistory/' + this.patientId + '/PatientAdmissionHome';
    let urlRedirect20 = 'home/newPatient/patientHistory/' + this.patientId + '/patientInsurance';
    let urlRedirect21 = 'home/newPatient/patientHistory/' + this.patientId + '/e-prescription';
    let urlRedirect22 = 'home/newPatient/patientHistory/' + this.patientId + '/discharge';
    let urlRedirect23 = 'home/newPatient/patientHistory/' + this.patientId + '/patientInsurance';

    this.router.navigate([urlRedirect1]);
    this.router.navigate([urlRedirect2]);
    this.router.navigate([urlRedirect3]);
    this.router.navigate([urlRedirect4]);
    this.router.navigate([urlRedirect5]);
    this.router.navigate([urlRedirect6]);
    this.router.navigate([urlRedirect7]);
    this.router.navigate([urlRedirect8]);
    this.router.navigate([urlRedirect9]);
    this.router.navigate([urlRedirect10]);
    this.router.navigate([urlRedirect11]);
    this.router.navigate([urlRedirect12]);
    this.router.navigate([urlRedirect13]);
    this.router.navigate([urlRedirect14]);
    this.router.navigate([urlRedirect15]);
    this.router.navigate([urlRedirect16]);
    this.router.navigate([urlRedirect17]);
    this.router.navigate([urlRedirect18]);
    this.router.navigate([urlRedirect19]);
    this.router.navigate([urlRedirect20]);
    this.router.navigate([urlRedirect21]);
    this.router.navigate([urlRedirect22]);
    this.router.navigate([urlRedirect23]);
  };

  ngOnInit() {
    this.searchForm = this.fb.group({ searchPatient: [''] })
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getPatientList();
    //this.getpatientbyId();
  }

  //#region "setsession_PatientsearchKey"
  setsessionStorage() {
    let searchKey = this.searchForm.get('searchPatient').value;
    sessionStorage.setItem("searchPatient", searchKey);
  }
  //#endregion

  getPatientList() {
    if (sessionStorage.getItem("searchPatient")) {
      this.newPatientSvc.getAllPatientData1().then(res => {
        this.patientList = res;        
        this.searchData = this.patientList;
        let searchKey = sessionStorage.getItem("searchPatient");
        this.searchForm.get('searchPatient').setValue(searchKey);
        this.searchPatientdata() ? sessionStorage.removeItem("searchPatient") : false;
      });
      //sessionStorage.removeItem("searchPatient");
    }
    else {
      this.newPatientSvc.getAllPatientData1().then(res => {
        this.patientList = res;        
        this.showCard = this.patientList.length > 0 ? true : false;
        this.searchData = this.patientList;
      });
    }
  }

  getpatientbyId() {
    this.newPatientSvc.getPatientDemographic(this.patientId).then(res => {
      this.patientId = res;
    });

  }

  openAddUpdateform() {
    const dialogRef = this.dialog.open(AddNewPatientComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "update") {
        this.getPatientList();
      }
    });
  }

  openPatientEditRecord(element: any) {

    this.newPatientSvc.getPatientDetailsById(element.Item.PatientId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(NewPatientEditRecordComponent, {
        data: patientDetail,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == "update") {
          this.getPatientList();
        }
      });
    });
  }

  openPatientViewRecord(element: any) {
    this.newPatientSvc.getPatientDetailsById(element.Item.PatientId).then(data => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(NewPatientViewRecordComponent, {
        data: patientDetail,
        height: 'auto',
        width: '125%',
        autoFocus: false,
      });
    });
  }

  searchPatientdata() {
    this.searchKey = this.searchForm.get('searchPatient').value.toLowerCase();
    if (this.searchKey.length == 0 || !this.searchKey) {
      this.showCard = this.searchData.length > 0 ? true : false;
      return this.searchData = this.patientList;
    }
    else {
      let data = [];
      data[0] = this.searchKey;
      data.forEach((name) => {
        if (name) {
          this.searchData = this.patientList.filter((item) => {
            let dt = "PatientFullName"; //propertyname
            return (item[dt].toString().toLowerCase().indexOf(name.toString().toLowerCase()) !== -1)
          });
        }
      });
      this.showCard = this.searchData.length > 0 ? true : false;
      return this.searchData;
    }
  }

  // searchPatientdata() {
  //   this.searchKey = this.searchForm.get('searchPatient').value.toLowerCase();
  //   if (!this.searchKey) {
  //     return this.searchData = this.patientList;
  //   }
  //   this.key = Object.keys(this.patientList[0]);
  //   this.getSpecificHeaderSearch.push(this.key[33], this.key[38], this.key[37], this.key[10],
  //     this.key[17], this.key[16]);
  //   this.searchData = this.patientList.filter((user) => {
  //     return this.getSpecificHeaderSearch.find((property) => {
  //       this.value = JSON.stringify(user[property]).toLowerCase();
  //       return this.value.includes(this.searchKey);
  //     })
  //   })
  //   return (this.searchData)?true :false;
  // }

}

