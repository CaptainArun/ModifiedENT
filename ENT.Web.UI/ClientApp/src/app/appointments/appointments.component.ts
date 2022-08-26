import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentModel } from './models/appointmentModel';
import { AppointmentsService } from './appointments.service';
import { NewPatientRegModel } from '../patient/models/newPatientRegModel';
import { Router } from '@angular/router';
import { CustomHttpService } from '../core/custom-http.service';
import { NewPatientService } from '../patient/newPatient.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AvailabilityModel } from './models/availabilityModel';
import { UtilService } from '../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  minDate = new Date();
  maxDate=new Date();

  @ViewChild('autophysician', { static: false, read: MatAutocompleteTrigger }) triggerphysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProvidersearch', { static: false, read: MatAutocompleteTrigger }) triggerprovidersearch: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProcedurecode', { static: false, read: MatAutocompleteTrigger }) triggerprocedure: MatAutocompleteTrigger;
  @ViewChild('autoCptSearch', { static: false, read: MatAutocompleteTrigger }) triggerCptSearch: MatAutocompleteTrigger;

  patientAppointmentForm: FormGroup;
  patientAppointmentSearchForm: FormGroup;
  appointmentModel: AppointmentModel = new AppointmentModel();
  patientRegModel: NewPatientRegModel = new NewPatientRegModel();
  availabilityModel: AvailabilityModel = new AvailabilityModel();
  appointmentStatus: any;
  appointmentType: any;
  facilityName: any;
  providerName: any;
  provID: any[] = [];
  CPTCode: any;
  //patientList: any;
  // patientName: string[];
  //filteredCPT: Observable<string[]>;
  filteredProvier: Observable<string[]>;
  patient: any;
  patientById: any;
  newPatient: any;
  duration: any = '';
  providerId: number;
  // patientListId: number;
  patienId: any;
  patientSearch: any;
  facilityId: number;
  providerbyFacility: any;
  filteredProviders: any;
  isQuickReg: boolean = true;
  show: boolean = false;
  primaryprocedurecode: any;
  gender1: any;
  salution: any;
  availabilityStatus: any;
  dateFilter: any;
  availableTime: any;
  availableDate: any;
  cptCodeSubmit: any;
  bindAge: number;
  bindDOB: Date;
  AppointmentNo: any = "";
  searchFacilityName: any;

  constructor(private fb: FormBuilder, private appointmentSvc: AppointmentsService, private router: Router,
    private customHttpSvc: CustomHttpService, private newPatientSvc: NewPatientService, private datepipe: DatePipe, private util: UtilService) { }

  ngOnInit() {
    this.patientAppointmentForm = this.fb.group({
      SearchPatientList: [''],
      //patient quick reg
      Salutation: ['', Validators.required],
      PatientFirstName: ['', Validators.required],
      PatientLastName: ['', Validators.required],
      Gender: ['', Validators.required],
      PatientDOB: ['', Validators.required],
      PrimaryContactNumber: ['', [Validators.required]],
      Emergencycontactnumber: ['', [Validators.required]],
      NKFirstname: ['', Validators.required],
      NKPrimarycontactnumber: ['', [Validators.required]],

      //appointments
      FacilityName: ['', Validators.required],
      ToConsult: ['', Validators.required],
      ProviderName: ['', Validators.required],
      AppointmentDate: ['', Validators.required],
      AppointmentTime: ['', Validators.required],
      Duration: ['', Validators.required],
      AppointmentType: ['', Validators.required],
      Appointmentstatus: ['', Validators.required],
      Reason: [''],
      CPTCode: [''],
      AddToWaitList: [''],
      Age: [''],

    });
    this.patientAppointmentSearchForm = this.fb.group({
      SearchPatientList: [''],
      //patient quick reg
      FacilityName: [''],
      ToConsult: ['', Validators.required],
      ProviderName: ['', Validators.required],
      AppointmentDate: ['', Validators.required],
      AppointmentTime: ['', Validators.required],
      Duration: ['', Validators.required],
      AppointmentType: ['', Validators.required],
      Reason: [''],
      CPTCode: [''],
      AddToWaitList: [''],
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getAppointmentNo();
    this.getPatientList();
    this.bindAppointmentStatus();
    this.bindAppointmentType();
    this.bindFacilities();
    this.bindProviders();
    this.bindCPTCode();
    this.bindCPTCodequicksearch();
    this.getGenderforPatient();
    this.getSalutionforPatient();

    //this.patientAppointmentForm.controls['Duration'].setValue(this.duration);
  }

  toValidateCpt() {
    this.triggerprocedure.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.patientAppointmentForm.get('CPTCode').setValue('');
        }
      });
  }
  toValidateCptSearch() {
    this.triggerCptSearch.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.patientAppointmentSearchForm.get('CPTCode').setValue('');
        }
      });
  }

  getAppointmentNo() {
    this.appointmentSvc.getAppointmentNo().then(res => {
      this.AppointmentNo = res[0];
    })
  }
  regToggle() {
    this.show = false;
    this.patientAppointmentForm.get('SearchPatientList').setValue("");
  }

  bindAppointmentStatus() {
    this.appointmentSvc.getAllAppointmentStatus().then(data => {
      this.appointmentStatus = data;
      this.patientAppointmentForm.get('Appointmentstatus').setValue(this.appointmentStatus[0].AppointmentStatusId);
    });
  }

  bindAppointmentType() {
    this.appointmentSvc.getAllAppointmentType().then(data => {
      this.appointmentType = data;
    });
  }

  getGenderforPatient() {
    this.newPatientSvc.getGenderforPatient().then(res => {
      this.gender1 = res
    })
  }

  getSalutionforPatient() {
    this.newPatientSvc.getSalutionforPatient().then(res => {
      this.salution = res;
    })
  }

  bindFacilities() {
    this.appointmentSvc.getFacilitiesforAppointment().then(data => {
      this.facilityName = data;
    });
  }


  bindProviders() {
    this.appointmentSvc.getProvidersforAppointments().then(data => {
      this.providerName = data;
      this.filteredProvier = this.patientAppointmentForm.get('ProviderName').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterProvider(value))
        );
    });
  }

  private _filterProvider(value: string): string[] {
    return this.providerName.filter((x) => new RegExp(value, 'gi').test(x.FirstName + ' ' + x.MiddleName + ' ' + x.LastName));
  }

  displayFnForProvider(data: any) {
    return data && data.FirstName ? data.FirstName + ' ' + data.MiddleName + ' ' + data.LastName : '';
  }


  getAvailabilityStatus() {
    this.availabilityModel.FacilityId = this.patientAppointmentForm.get('FacilityName').value;
    this.availabilityModel.ProviderId = this.patientAppointmentForm.get('ProviderName').value.ProviderID;
    this.availabilityModel.AppointDate = this.patientAppointmentForm.get('AppointmentDate').value;
    var appDate = this.datepipe.transform(this.patientAppointmentForm.get('AppointmentDate').value, 'yyyy-MM-dd, hh:mm:ss a');

    if (this.availabilityModel.AppointDate != undefined) {
      this.appointmentSvc.availabilityStatus(this.availabilityModel).then(data => {
        this.availabilityStatus = data.availability;

        if (this.availabilityStatus == 'No Schedules for this Provider') {
          this.availableTime = null
          this.patientAppointmentForm.controls['Duration'].setValue(null);
          // this.duration = null
          this.util.showMessage('', 'No Schedules for this Provider', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
        }

        else if (this.availabilityStatus == 'No Schedule available on this Day for this Provider') {
          this.availableTime = null
          this.patientAppointmentForm.controls['Duration'].setValue(null);
          //this.duration = null
          this.patientAppointmentForm.controls.AppointmentDate.reset();

          this.util.showMessage('', 'No Schedule available on this Day for this Provider', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
        }

        else if (this.availabilityStatus == 'Provider is on Vacation, Not Available') {
          this.availableTime = null
          this.patientAppointmentForm.controls['Duration'].setValue(null);
          //this.duration = null
          this.patientAppointmentForm.controls.AppointmentDate.reset();
          this.util.showMessage('', 'Provider is on Vacation, Not Available', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
        }

        else if (this.availabilityStatus == 'Yes, Available') {
          this.appointmentSvc.getTimingsforAppointment(appDate, this.availabilityModel.ProviderId, this.availabilityModel.FacilityId).then(data => {
            this.availableTime = data;
            this.patientAppointmentForm.controls.AppointmentTime.reset();
            this.patientAppointmentForm.controls.Duration.reset();
          });
        }
      });
    }
  }

  getAvailabilityStatusquicksearch() {
    this.availabilityModel.FacilityId = this.patientById.FacilityId;
    this.availabilityModel.ProviderId = this.patientAppointmentSearchForm.get('ProviderName').value.ProviderID;
    this.availabilityModel.AppointDate = this.patientAppointmentSearchForm.get('AppointmentDate').value;
    var appDate = this.datepipe.transform(this.patientAppointmentSearchForm.get('AppointmentDate').value, 'yyyy-MM-dd, hh:mm:ss a');

    if (this.availabilityModel.AppointDate != undefined) {
      this.appointmentSvc.availabilityStatus(this.availabilityModel).then(data => {
        this.availabilityStatus = data.availability;

        if (this.availabilityStatus == 'No Schedules for this Provider') {
          this.availableTime = null
          this.patientAppointmentSearchForm.controls['Duration'].setValue(null);
          // this.duration = null
          this.util.showMessage('', 'No Schedules for this Provider', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
        }

        else if (this.availabilityStatus == 'No Schedule available on this Day for this Provider') {
          this.availableTime = null
          this.patientAppointmentSearchForm.controls['Duration'].setValue(null);
          //this.duration = null
          this.patientAppointmentSearchForm.controls.AppointmentDate.reset();

          this.util.showMessage('', 'No Schedule available on this Day for this Provider', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
        }

        else if (this.availabilityStatus == 'Provider is on Vacation, Not Available') {
          this.availableTime = null
          this.patientAppointmentSearchForm.controls['Duration'].setValue(null);
          //this.duration = null
          this.patientAppointmentSearchForm.controls.AppointmentDate.reset();
          this.util.showMessage('', 'Provider is on Vacation, Not Available', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
        }

        else if (this.availabilityStatus == 'Yes, Available') {
          this.appointmentSvc.getTimingsforAppointment(appDate, this.availabilityModel.ProviderId, this.availabilityModel.FacilityId).then(data => {
            this.availableTime = data;
            this.patientAppointmentSearchForm.controls.AppointmentTime.reset();
            this.patientAppointmentSearchForm.controls.Duration.reset();
          });
        }
      });
    }
  }

  getProvidersbyFacilityId() {
    this.appointmentSvc.getProvidersbyfacilityId(this.facilityId).then(res => {
      this.providerbyFacility = res;
      this.filteredProviders = this.patientAppointmentForm.get('ProviderName').valueChanges.pipe(startWith(''), map(value => this.filterProvider(value)));
    });
  }

  getProvidersQuicksearch() {
    this.appointmentSvc.getProvidersbyfacilityId(this.facilityId).then(res => {
      this.providerbyFacility = res;
      this.filteredProviders = this.patientAppointmentSearchForm.get('ProviderName').valueChanges.pipe(startWith(''), map(value => this.filterProvider(value)));
    });
  }

  private filterProvider(value: string): string[] {
    return this.providerbyFacility.filter((x) => new RegExp(value, 'gi').test(x.FirstName) || new RegExp(value, 'gi').test(x.LastName));
  }

  Hospital(index: any) {

    this.appointmentSvc.getFacilitiesforAppointment().then(data => {
      this.facilityId = data[index].FacilityId;
      this.getProvidersbyFacilityId();
    })
    this.patientAppointmentForm.controls.ToConsult.reset();
    this.patientAppointmentForm.controls.ProviderName.setValue("");
    this.patientAppointmentForm.controls.AppointmentDate.reset();
    this.patientAppointmentForm.controls.AppointmentTime.reset();
    this.patientAppointmentForm.controls.Duration.reset();

  }
  // Hospitalquicksearch(index: any) {

  //   this.appointmentSvc.getFacilitiesforAppointment().then(data => {
  //     this.facilityId = data[index].FacilityId;
  //     this.getProvidersQuicksearch();
  //   })
  //   this.patientAppointmentSearchForm.controls.ToConsult.reset();
  //   this.patientAppointmentSearchForm.controls.ProviderName.setValue("");
  //   this.patientAppointmentSearchForm.controls.AppointmentDate.reset();
  //   this.patientAppointmentSearchForm.controls.AppointmentTime.reset();
  //   this.patientAppointmentSearchForm.controls.Duration.reset();

  // }

  Hospitalquicksearch(facID: any) {

    this.appointmentSvc.getFacilitiesforAppointment().then(data => {
      this.facilityId = facID;
      this.getProvidersQuicksearch();
    })
    this.patientAppointmentSearchForm.controls.ToConsult.reset();
    this.patientAppointmentSearchForm.controls.ProviderName.setValue("");
    this.patientAppointmentSearchForm.controls.AppointmentDate.reset();
    this.patientAppointmentSearchForm.controls.AppointmentTime.reset();
    this.patientAppointmentSearchForm.controls.Duration.reset();

  }

  toConsult() {
    this.appointmentSvc.getFacilitiesforAppointment().then(data => {
      this.facilityId;
      this.getProvidersbyFacilityId();

        this.triggerphysician.panelClosingActions.subscribe(physician => {
          if (!(physician && physician.source)) {
            this.patientAppointmentForm.get('ProviderName').setValue('');
          }
        });
      
    })
    this.patientAppointmentForm.controls.ProviderName.setValue("");
    this.patientAppointmentForm.controls.AppointmentDate.reset();
    this.patientAppointmentForm.controls.AppointmentTime.reset();
    this.patientAppointmentForm.controls.Duration.reset();
  }

  toConsultquicksearch() {
    this.appointmentSvc.getFacilitiesforAppointment().then(data => {
      this.facilityId;
      this.getProvidersQuicksearch();

      this.triggerprovidersearch.panelClosingActions.subscribe(physician => {
        if (!(physician && physician.source)) {
          this.patientAppointmentSearchForm.get('ProviderName').setValue('');
        }
      });
    })
    this.patientAppointmentSearchForm.controls.ProviderName.setValue("");
    this.patientAppointmentSearchForm.controls.AppointmentDate.reset();
    this.patientAppointmentSearchForm.controls.AppointmentTime.reset();
    this.patientAppointmentSearchForm.controls.Duration.reset();
  }
  getDuration() {
    for (var i = 0; i < this.availableTime.length; i++) {
      //this.duration = this.availableTime[i].duration;
      this.patientAppointmentForm.controls['Duration'].setValue(this.availableTime[i].duration);
    }
  }

  getDurationquicksearch() {
    for (var i = 0; i < this.availableTime.length; i++) {
      //this.duration = this.availableTime[i].duration;
      this.patientAppointmentSearchForm.controls['Duration'].setValue(this.availableTime[i].duration);
    }
  }

  nextMonth(element: any) { }

  bindCPTCode() {

    if (this.patientAppointmentForm.get('CPTCode').value != null) {
      this.patientAppointmentForm.get('CPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.appointmentSvc.getTreatmentCodes(key).then(data => {
                this.CPTCode = data;
              });
            }
          } else {
            this.CPTCode = null;
            this.primaryprocedurecode = null;
          }
        });
    }
  }

  private _filterCPT(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CPTCode.filter((x) => new RegExp(value, 'gi').test(x.Description));
  }
  bindCPTCodequicksearch() {

    if (this.patientAppointmentSearchForm.get('CPTCode').value != null) {
      this.patientAppointmentSearchForm.get('CPTCode').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.appointmentSvc.getTreatmentCodes(key).then(data => {
                this.CPTCode = data;
              });
            }
          } else {
            this.CPTCode = null;
            this.primaryprocedurecode = null;
          }
        });
    }
  }

  private _filterCPT1(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.CPTCode.filter((x) => new RegExp(value, 'gi').test(x.Description));
  }
  getPatientList() {
    this.patientAppointmentForm.get('SearchPatientList').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.appointmentSvc.getPatientsBySearch(key).then(data => {
              this.patientSearch = data;
            });
          }
          else {
            this.patientSearch = null;
            this.show = false;
          }
        }
      });
  }

  getPatientId(id: number) {
    this.patienId = id;
    this.newPatientSvc.getPatientDetailsById(id).then(data => {
      if (data != undefined) {
        this.patientById = data;
        this.show = true;
        this.searchFacilityName = data.FacilityName;
        this.patientAppointmentSearchForm.get('FacilityName').setValue(data.FacilityId);
        this.Hospitalquicksearch(data.FacilityId);
      } else (this.patientAppointmentSearchForm.get('SearchPatientList').value.length == 0)
      {
        this.patientAppointmentSearchForm.reset();
      }
    });
  }



  getAvailableDateForProvider(element: any, providerId: number) {
    this.providerId = providerId;
    if (element.isUserInput == true) {
      this.appointmentSvc.getDatesForProvider(providerId).then(data => {
        this.availableDate = [];
        for (let i = 0; i < data.length; i++) {
          this.availableDate.push(this.datepipe.transform(data[i], 'MM/dd/yyyy'));
        }
      });
    }
  }

  addAppointmentDetails() {

    if (this.patientAppointmentSearchForm.valid) {
      if (this.show) {
        this.appointmentModel.AppointmentID = 0;
        this.appointmentModel.PatientID = this.patientById.PatientId;
        this.appointmentModel.FacilityID = this.patientById.FacilityId;
        this.appointmentModel.ToConsult = this.patientAppointmentSearchForm.get('ToConsult').value;
        this.appointmentModel.ProviderID = this.providerId;

        var appointDate: Date;
        var appointTimeHH: number;
        var appointTimeMin: number;
        appointDate = new Date(this.patientAppointmentSearchForm.get('AppointmentDate').value);

        if (this.patientAppointmentSearchForm.get('AppointmentDate').value != "") {
          if (this.patientAppointmentSearchForm.get('AppointmentTime').value.toLowerCase().split(' ')[1] == "pm") {
            if (parseInt(this.patientAppointmentSearchForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) == 12) {
              appointTimeHH = 12;
            }
            else {
              appointTimeHH = parseInt(this.patientAppointmentSearchForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) + 12;
            }
          }

          else if (this.patientAppointmentSearchForm.get('AppointmentTime').value.toLowerCase().split(' ')[1] == "am") {
            if (parseInt(this.patientAppointmentSearchForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) == 12) {
              appointTimeHH = 0;
            }
            else {
              appointTimeHH = parseInt(this.patientAppointmentSearchForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]);
            }
          }

          appointTimeMin = parseInt(this.patientAppointmentSearchForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[1]);
          appointDate.setHours(appointTimeHH, appointTimeMin, 0, 0);
        }

        this.appointmentModel.AppointmentDate = appointDate;
        this.appointmentModel.Duration = this.patientAppointmentSearchForm.get('Duration').value;
        this.appointmentModel.AppointmentTypeID = this.patientAppointmentSearchForm.get('AppointmentType').value;
        this.appointmentModel.AppointmentStatusID = this.appointmentStatus[0].AppointmentStatusId;
        this.appointmentModel.Reason = this.patientAppointmentSearchForm.get('Reason').value;

        //var cptCode = this.patientAppointmentSearchForm.get('CPTCode').value;
        this.CptCodeQuicksearch();
        this.appointmentModel.CPTCode = this.cptCodeSubmit;
        //  this.appointmentModel.AddToWaitList = this.patientAppointmentSearchForm.get('AddToWaitList').value;
        this.appointmentModel.AddToWaitList = false;
        this.appointmentModel.IsRecurrence = false;
        this.appointmentModel.RecurrenceId = 0;
        this.appointmentModel.AppointmentNo = this.AppointmentNo;
        this.appointmentSvc.addAppointment(this.appointmentModel).then(res => {
          this.util.showMessage('', 'Appointment details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
          this.router.navigate(['/home/appointments/appointmentslist']);
        });
      }
    }
  }

  QuickaddAppointmentDetails() {
    if (this.patientAppointmentForm.valid) {
      this.patientRegModel.PatientDemographicId = 0;
      this.patientRegModel.PatientId = 0;
      this.patientRegModel.PatientType = "";
      this.patientRegModel.FacilityId = this.patientAppointmentForm.get('FacilityName').value;
      this.patientRegModel.RegisterationAt = "";
      this.patientRegModel.PatientCategory = "";
      this.patientRegModel.Salutation = this.patientAppointmentForm.get('Salutation').value;
      this.patientRegModel.PatientFirstName = this.patientAppointmentForm.get('PatientFirstName').value;
      this.patientRegModel.PatientLastName = this.patientAppointmentForm.get('PatientLastName').value;
      this.patientRegModel.PatientMiddleName = "";
      this.patientRegModel.PatientDOB = this.patientAppointmentForm.get('PatientDOB').value;
      this.patientRegModel.PatientAge = this.patientAppointmentForm.get('Age').value;
      this.patientRegModel.Gender = this.patientAppointmentForm.get('Gender').value;
      this.patientRegModel.IDTID1 = 1;
      this.patientRegModel.PatientIdentificationtype1details = "";
      this.patientRegModel.IDTID2 = 1;
      this.patientRegModel.PatientIdentificationtype2details = "";
      this.patientRegModel.PrimaryContactType = "";
      this.patientRegModel.PrimaryContactNumber = this.patientAppointmentForm.get('PrimaryContactNumber').value;
      this.patientRegModel.SecondaryContactType = "";
      this.patientRegModel.SecondaryContactNumber = "";
      this.patientRegModel.email = "";
      this.patientRegModel.Emergencycontactnumber = this.patientAppointmentForm.get('Emergencycontactnumber').value;
      this.patientRegModel.Address1 = "";
      this.patientRegModel.Address2 = ""
      this.patientRegModel.Village = "";
      this.patientRegModel.Town = " ";
      this.patientRegModel.City = " ";
      this.patientRegModel.Pincode = 0;
      this.patientRegModel.State = " ";
      this.patientRegModel.Country = "";
      this.patientRegModel.Bloodgroup = "";

      this.patientRegModel.NKSalutation = "";
      this.patientRegModel.NKFirstname = this.patientAppointmentForm.get('NKFirstname').value;
      this.patientRegModel.NKLastname = "";
      this.patientRegModel.NKContactType = "";
      this.patientRegModel.NKPrimarycontactnumber = this.patientAppointmentForm.get('NKPrimarycontactnumber').value;
      this.patientRegModel.RSPId = 0;
      // this.patientRegModel.AppointmentNo = this.AppointmentNo;
      this.newPatientSvc.addUpdatePatientDetail(this.patientRegModel).then(data => {
        this.newPatient = data;
        this.appointmentModel.AppointmentID = 0;
        this.appointmentModel.PatientID = this.newPatient.PatientId;
        this.appointmentModel.FacilityID = this.patientAppointmentForm.get('FacilityName').value;
        this.appointmentModel.ToConsult = this.patientAppointmentForm.get('ToConsult').value;
        this.appointmentModel.ProviderID = this.providerId;

        var appointDate: Date;
        var appointTimeHH: number;
        var appointTimeMin: number;
        appointDate = new Date(this.patientAppointmentForm.get('AppointmentDate').value);
        if (this.patientAppointmentForm.get('AppointmentDate').value != "") {
          if (this.patientAppointmentForm.get('AppointmentTime').value.toLowerCase().split(' ')[1] == "pm") {
            if (parseInt(this.patientAppointmentForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) == 12) {
              appointTimeHH = 12;
            }
            else {
              appointTimeHH = parseInt(this.patientAppointmentForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) + 12;
            }
          }

          else if (this.patientAppointmentForm.get('AppointmentTime').value.toLowerCase().split(' ')[1] == "am") {
            if (parseInt(this.patientAppointmentForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]) == 12) {
              appointTimeHH = 0;
            }
            else {
              appointTimeHH = parseInt(this.patientAppointmentForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[0]);
            }
          }

          appointTimeMin = parseInt(this.patientAppointmentForm.get('AppointmentTime').value.split(' ')[0].toString().split(':')[1]);
          appointDate.setHours(appointTimeHH, appointTimeMin, 0, 0);
        }

        this.appointmentModel.AppointmentDate = appointDate;
        this.appointmentModel.Duration = this.patientAppointmentForm.get('Duration').value;
        this.appointmentModel.AppointmentTypeID = this.patientAppointmentForm.get('AppointmentType').value;
        this.appointmentModel.AppointmentStatusID = this.patientAppointmentForm.get('Appointmentstatus').value;
        this.appointmentModel.Reason = this.patientAppointmentForm.get('Reason').value;
        this.CptCode();
        this.appointmentModel.CPTCode = this.cptCodeSubmit;
        // this.appointmentModel.AddToWaitList = this.patientAppointmentForm.get('AddToWaitList').value;
        this.appointmentModel.AddToWaitList = false;
        this.appointmentModel.IsRecurrence = true;
        this.appointmentModel.RecurrenceId = 0;
        this.appointmentModel.AppointmentNo = this.AppointmentNo;
        this.appointmentSvc.addAppointment(this.appointmentModel).then(res => {
          this.util.showMessage('', 'Appointment details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => { }
          );
          this.router.navigate(['/home/appointments/appointmentslist']);
        });
      });

    }
  }
  CptCode() {
    var cptCode = this.patientAppointmentForm.get('CPTCode').value;
    if (this.patientAppointmentForm.get('CPTCode').value) {
      this.cptCodeSubmit = cptCode.toString().substring(cptCode.toString().lastIndexOf("-") + 1, cptCode.toString().length).trim();
    } else {
      this.cptCodeSubmit = 0;
    }
  }
  CptCodeQuicksearch() {
    var cptCode = this.patientAppointmentSearchForm.get('CPTCode').value;
    if (this.patientAppointmentSearchForm.get('CPTCode').value) {
      this.cptCodeSubmit = cptCode.toString().substring(cptCode.toString().lastIndexOf("-") + 1, cptCode.toString().length).trim();
    } else {
      this.cptCodeSubmit = 0;
    }
  }
  clearForm() {
    this.patientAppointmentForm.reset();
    this.bindAppointmentStatus();
  }
  clearForm1() {
    this.patientAppointmentSearchForm.reset();
  }
  //SetPrimaryProcedureCode
  setPrimaryProcedureCode(value1, value2) {
    this.primaryprocedurecode = value1 + " " + value2;
  }
  setPrimaryProcedureCode1(value1, value2) {
    this.primaryprocedurecode = value1 + " " + value2;
  }


  bindDob() {
    this.bindAge = new Date().getFullYear() - new Date(this.patientAppointmentForm.get('PatientDOB').value).getFullYear();

    this.patientAppointmentForm.get('Age').setValue(this.bindAge);
  }
  bindAgeDob() {
    this.bindDOB = new Date((new Date().getFullYear() - this.patientAppointmentForm.get('Age').value) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    this.patientAppointmentForm.get('PatientDOB').setValue(this.bindDOB);
  }

}


