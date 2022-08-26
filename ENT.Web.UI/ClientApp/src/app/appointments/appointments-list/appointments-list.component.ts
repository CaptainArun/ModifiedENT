import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource, MatAutocompleteTrigger } from '@angular/material';
import { AppointmentsPopupHistoryComponent } from '../appointments-popupHistory/appointments-popupHistory.component';
import { AppointmentViewRecordComponent } from '../appointment-viewRecord/appointment-viewRecord.component';
import { AppointmentEditRecordComponent } from '../appointment-edit-record/appointment-editRecord.component';
import { TableConfig } from 'src/app/ux/columnConfig';
import { AppointmentsService } from '../appointments.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppointmentSearchModel } from '../models/appointmentSearchModel';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { NewPatientService } from 'src/app/patient/newPatient.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { UtilService } from '../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'appointment-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})

export class AppointmentsListComponent {

  appointmentSearchForm: FormGroup;
  public tableConfig: TableConfig = new TableConfig();
  appointmentCollection: any;
  appointmentSearchModel: AppointmentSearchModel = new AppointmentSearchModel();
  appointmentStatusCount = [];
  appointmentSpeciality: any;
  patientList: any;
  providerName: any;
  AppointmenttotalCount: any;
  totalCount: any;
  scheduleCount: any;
  waitCount: any;
  appointname: any;
  IsDateCorect: boolean = false;
  filteredPatient: Observable<string[]>;
  filteredProvider: Observable<string[]>;
  public show: boolean = false;
  // static: boolean;
  show1: any =true;
  doctor: any;
  patient: any;
  physicianid: any;
  patientid: any;
  facilityData: any;
  AppointmentNumber: any;
  public AppointmentListCard: FlexCardConfig = new FlexCardConfig();


  @ViewChild('autoCompleteDoctor', { static: false, read: MatAutocompleteTrigger }) Doctor: MatAutocompleteTrigger;
  @ViewChild('autoCompleteAppointment', { static: false, read: MatAutocompleteTrigger }) Appointment: MatAutocompleteTrigger;
  @ViewChild('autoCompletepatient', { static: false, read: MatAutocompleteTrigger }) patientauto: MatAutocompleteTrigger;

  constructor(public dialog: MatDialog, private appointmentSvc: AppointmentsService,
    private fb: FormBuilder, private customhttpSvc: CustomHttpService, private newPatientSvc: NewPatientService, private config: UtilService) {
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showView = true;
    // this.tableConfig.showEdit = true;
    // this.tableConfig.showCancel =true;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'AppointmentNo', DisplayName: 'Appointment No', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'ProviderName', DisplayName: 'Appointment with', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AppointmentDate', DisplayName: 'Appointment Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
    //   { PropertyName: 'AppointmentTime', DisplayName: 'Appointment Time', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Appointmentstatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Reason', DisplayName: 'Purpose', DisplayMode: 'Text', LinkUrl: '' }
    // ];

    this.AppointmentListCard.FlexDataConfig = [

      //Header

      { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image"},
      { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header"},
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header"},

      //Content

      { PropertyName: 'AppointmentNo', DisplayName: 'Appointment No', SectionType: "Content"},
      { PropertyName: 'Appointmenttype', DisplayName: 'Appointment Type', SectionType: "Content"},
      { PropertyName: 'Appointmentstatus', DisplayName: 'Appointment status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content"},
      { PropertyName: 'ProviderName', DisplayName: 'Provider', SectionType: "Content"},
      { PropertyName: 'FacilityName', DisplayName: 'Facility', SectionType: "Content"},

    ];

    //Icons

    this.AppointmentListCard.showView = true;
    this.AppointmentListCard.showEdit = true;
    this.AppointmentListCard.showCancel = true;

  }

  ngOnInit() {
    this.appointmentSearchForm = this.fb.group({

      FromDate: [new Date()],
      ToDate: [new Date()],
      ProviderName: [''],
      AppointmentNumber: [''],
      Facility: [0],
      PatientName: [''],
      //Speciality: ['']
    });

    this.customhttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.totalAppointment();
    this.getAppointmentCount();
    this.appointmentSearch();
    this.getSpecialities();
    this.bindProviders();
    this.getPatientList();
    this.CheckValidDate();
    this.getAppointmentNumberbySearch();
    this.getFacilitiesByuser();

  }
   appointmentSearch() {
    this.appointmentSearchModel.FromDate = this.appointmentSearchForm.get('FromDate').value;
    this.appointmentSearchModel.ToDate = this.appointmentSearchForm.get('ToDate').value;
    this.appointmentSearchModel.ProviderId = this.physicianid;
    this.appointmentSearchModel.PatientId = this.patientid;
    this.appointmentSearchModel.FacilityId = this.appointmentSearchForm.get('Facility').value;
    this.appointmentSearchModel.AppointmentNo = this.appointmentSearchForm.get('AppointmentNumber').value;
    
    this.appointmentSvc.searchAppointment(this.appointmentSearchModel).then(res => {
      this.appointname = res;
      if (this.appointname.length == 0) {
        this.show1 = true;
      }
      else {
        this.appointmentCollection = this.appointname;
          this.show1 = false;
      }
    })
  }
  // getAppointmentCollection() {
  //   this.appointmentSvc.getAppointmentList().then(data => {
  //     this.appointmentCollection = data;
  //     /*   if (this.appointmentCollection.length == 0) {
  //          this.show1 == true;
  //        }*/
  //   });
  // }

  ngAfterViewInit() {
    this.Appointment.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.appointmentSearchForm.get('AppointmentNumber').setValue('');
        }
      });
    this.Doctor.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.appointmentSearchForm.get('ProviderName').setValue('');
        }
      });
    this.patientauto.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.appointmentSearchForm.get('PatientName').setValue('');
        }
      });
  }
  // applyFilter(filterValue: string) {
  //  this.dataSource.filter = filterValue.trim().toLowerCase();
  //}
  //#region Check Date in Search
  public CheckValidDate(): void {

    this.appointmentSearchForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {
      if (this.appointmentSearchForm.get('FromDate').value > this.appointmentSearchForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.appointmentSearchForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {
      if (this.appointmentSearchForm.get('FromDate').value > this.appointmentSearchForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
  //#endregion Check Date in Search

  onBindItem(event: any) {

    if (event.Item) {
      if (event.Item.Appointmentstatus != "Cancelled") {
        event.Item.showEdit = true;
       event.Item.showCancel = true;
      }

      if (event.Item.Appointmentstatus == "Cancelled") {
        event.Item.showEdit = false;
        event.Item.showCancel = false;

      }
    }
  }

  getAppointmentCount() {
    this.appointmentSvc.getTodayAppointmentCount().then(data => {
      if (data != undefined && data != null) {
        this.appointmentStatusCount = data;
      }
    });
  }

  totalAppointment() {
    this.appointmentSvc.totalAppointmentCount().then(data => {
      this.AppointmenttotalCount = data
      this.totalCount = this.AppointmenttotalCount.totalCount;
      this.scheduleCount = this.AppointmenttotalCount.ScheduledCount;
      this.waitCount = this.AppointmenttotalCount.waitCount;
    });
  }

  bindProviders() {

    if (this.appointmentSearchForm.get('ProviderName').value != null) {
      this.appointmentSearchForm.get('ProviderName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.appointmentSvc.getProvidersforAppointment(key).then(data => {
                this.doctor = data;
              })
            }

            else {
              this.doctor = null;
              this.physicianid = 0;
            }
          }
        });
    }
  }

  getAppointmentNumberbySearch() {

    if (this.appointmentSearchForm.get('AppointmentNumber').value != null) {
      this.appointmentSearchForm.get('AppointmentNumber').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.appointmentSvc.getAppointmentNumberBySearch(key).then(data => {
                this.AppointmentNumber = data;
              })
            }
            else {
              this.AppointmentNumber = null;
            }
          }
        });
    }
  }
  //this.providerName = data;
  //this.filteredProvider = this.appointmentSearchForm.get('ProviderName').valueChanges.pipe(
  //  startWith(''), map(value => this._filterProvider(value))
  //);


  //private _filterProvider(value: string): string[] {
  //  return this.providerName.filter((x) => new RegExp(value, 'gi').test(x.FirstName + ' ' + x.MiddleName + ' ' + x.LastName));
  //}

  //displayFnForProvider(data: any) {
  //  return data && data.FirstName ? data.FirstName + ' ' + data.MiddleName + ' ' + data.LastName : '';
  //}

  getPatientList() {
    if (this.appointmentSearchForm.get('PatientName').value != null) {
      this.appointmentSearchForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.appointmentSvc.getAllPatient(key).then(data => {
                this.patient = data;
              })
            }

            else {
              this.patient = null;
              this.patientid = 0;
            }
          }
        });
    }
    this.newPatientSvc.getAllPatientData1().then(res => {
      //this.patientList = res;

      //this.filteredPatient = this.appointmentSearchForm.get('PatientName').valueChanges
      //  .pipe(
      //    startWith(''),
      //    map(value => this._filterPatient(value))
      //  );
    });
  }

  //private _filterPatient(value: string): string[] {
  //  return this.patientList.filter((x) => new RegExp(value, 'gi').test(x.PatientFullName));
  //}

  //displayFnForPatient(data: any) {
  //  return data && data.PatientFullName ? data.PatientFullName : '';
  //}

  getSpecialities() {
    this.appointmentSvc.getProviderSpecialities().then(data => {
      this.appointmentSpeciality = data;
    });
  }

 


  search() {
    this.show = !this.show;
  }

  CancelForm() {
    this.appointmentSearchForm.reset();
    this.appointmentSearchForm.get('FromDate').setValue(new Date());
    this.appointmentSearchForm.get('ToDate').setValue(new Date());
    this.appointmentSearchForm.get('Facility').setValue(0);
    this.appointmentSearchModel.FromDate = this.appointmentSearchForm.get('FromDate').value;
    this.appointmentSearchModel.ToDate = this.appointmentSearchForm.get('ToDate').value;
    this.appointmentSearchModel.PatientId = 0;
    this.appointmentSearchModel.ProviderId = 0;
    this.appointmentSearchModel.AppointmentNo = "";
    this.appointmentSearchModel.FacilityId = this.appointmentSearchForm.get('Facility').value;
    this.appointmentSvc.searchAppointment(this.appointmentSearchModel).then(res => {
      this.appointname = res;
      if (this.appointname.length == 0) {
        this.show1 = true;
        this.physicianid = 0;
        this.patientid = 0;
      }
      else {
        this.appointmentCollection = this.appointname;
        this.show1 = false;
      }

    })
  }

  openAppointmentEdit(element: any) {

    this.appointmentSvc.getPatientAppointmentById(element.Item.AppointmentID).then(data => {
      var appointmentData = data;
      const dialogRef = this.dialog.open(AppointmentEditRecordComponent, {
        data: appointmentData,
        height: 'auto',
        width: '2000px',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == "Updated") {
          this.appointmentSearch();
        }
      });
    });
  }

  openAppointmentsView(element: any) {
    this.appointmentSvc.getPatientAppointmentById(element.Item.AppointmentID).then(data => {
      var appointmentData = data;
      const dialogRef = this.dialog.open(AppointmentViewRecordComponent, {
        data: appointmentData,
        height: 'auto',
        width: '2000px',
        autoFocus: false,
      });
      /*const dialogRef1 = this.dialog.open(AppointmentcommonComponent, {
        data: appointmentData,
      });*/
    });
  }

  history() {
    const dialogRef = this.dialog.open(AppointmentsPopupHistoryComponent, {
      height: 'auto',
      width: '95%',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  removeSelectedAppointment(element: any) {
    this.config.showMessage("Delete", "Are you sure want to cancel this Request? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      (res: any) => {
        if (res == true) {
          this.appointmentSvc.deleteAppointmentById(element.Item.AppointmentID).then(res => {
            this.appointmentSearch();
          });

        }
      })
  }

  setphysician(number) {
    this.physicianid = number;
  }
  setpatient(number) {
    this.patientid = number;
  }

  getFacilitiesByuser() {
    this.appointmentSvc.getFacilitiesByuser().then((res) => {
      this.facilityData = res;
    })
  }

  // fetchDataApi()
  // {
  //   this.appointmentSvc.fetchApiData().then(data => {
  //     console.log(data)
  //   })
  // }
}
