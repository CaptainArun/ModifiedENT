import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PhysicianScheduleModel } from './models/physicianScheduleModel';
import { PhysicianService } from './physician.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsService } from '../appointments/appointments.service';
import { CustomHttpService } from '../core/custom-http.service';
import { PhysicianScheduleItemModel } from './models/physicianScheduleItemModel';
import { UtilService } from '../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { NgxTimepickerTimeControlComponent } from 'ngx-material-timepicker/src/app/material-timepicker/components/timepicker-field/timepicker-time-control/ngx-timepicker-time-control.component';
//import { NgxMaterialTimepickerContainerComponent } from 'ngx-material-timepicker/src/app/material-timepicker/components/ngx-material-timepicker-container/ngx-material-timepicker-container.component';

@Component({
  selector: 'app-PhysicianScheduleComponent',
  templateUrl: './physician-schedule.component.html',
})

export class PhysicianScheduleComponent implements OnInit {

  //#region Property Declaration
  physicianScheduleForm: FormGroup;
  physicianScheduleModel: PhysicianScheduleModel = new PhysicianScheduleModel();
  scheduleItemModel: PhysicianScheduleItemModel = new PhysicianScheduleItemModel();
  providerId: number;
  facilityName: any;
  isTableVisible = true;
  consultationPerSlot = [];
  timeSlotDuration = [];
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  RegularWorkHrsFrom: any;
  getTimeHH: number;
  getTimeMin: number;
  RegularWorkHrsTo: any;
  BreakHrsFromOne: any;
  BreakHrsToOne: any;
  BreakHrsFromTwo: any;
  temporaryDate: Date = new Date();
  BreakHrsToTwo: any;
  IsFromDate: boolean = false;
  facilityid: any;
  time: any;
  //timedata: Date = new Date();
  submitdisable: boolean = false;
  PhysicainFromdatevalue = [];
  physicianFromDateCollection = [];
  physicianRegularWorkFromCollection = [];
 // Regularwork: any;
  //#endregion 
  //#region Constructor
  constructor(private router: Router, private fb: FormBuilder, private physicianSvc: PhysicianService, private activeRoute: ActivatedRoute,
    private appointmentSvc: AppointmentsService, private customHttpSvc: CustomHttpService, private util: UtilService, private ref: ChangeDetectorRef) {
   
  }
  //#endregion 
  //#region ngOnInit
  ngOnInit() {
    this.physicianScheduleForm = this.fb.group({
      Facility: ['',Validators.required],
      EffectiveDate: ['', Validators.required],
      TerminationDate: ['', Validators.required],
      WorkHours: [false],
      TimeSlotDuration: ['',Validators.required],
      BookingPerSlot: ['',Validators.required],
      ScheduleItem: this.fb.array([
        this.scheduleDynamicControls()
      ])
    });
    this.activeRoute.params.subscribe(param => {
      this.providerId = param['ProviderId'];
    })
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getCount();
    this.bindFacilities();
    this.addDynamicDays();
    //this.getSchedule();
    //this.getToDate();
    this.CheckValidDate();
    this.checktime();
    //this.WorkHoursToValidation();
    //this.Check();
  }
  //#endregion
  //#region Time changes 12.00 Am issue
  checktime() {
    this.time = new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
  }
  //#endregion
  //#region Validate Date
  public CheckValidDate(): void {
    this.physicianScheduleForm.get('EffectiveDate').valueChanges.subscribe((EffectiveDate: any) => {
      if (new Date(this.physicianScheduleForm.get('EffectiveDate').value) > new Date(this.physicianScheduleForm.get('TerminationDate').value)) {
        this.submitdisable = true;
      } else {
        this.submitdisable = false;
      }
    });

    this.physicianScheduleForm.get('TerminationDate').valueChanges.subscribe((StartDate: any) => {
      if (new Date(this.physicianScheduleForm.get('EffectiveDate').value) > new Date(this.physicianScheduleForm.get('TerminationDate').value)) {
        this.submitdisable = true;
      } else {
        this.submitdisable = false;
      }
    });
  }
  //#endregion
  //#region schedule Dynamic Controls
  scheduleDynamicControls() {
    return this.fb.group({
      IsDaysAvailable: [''],
      AppointmentDay: [''],
      RegularWorkHrsFrom: [''],
      RegularWorkHrsTo: [''],
      BreakHrsFrom1: [''],
      BreakHrsTo1: [''],
      BreakHrsFrom2: [''],
      BreakHrsTo2: [''],
      NoOfSlots: [''],
      BookingPerDay: [''],
    });
  }

  get scheduleItemsControl() {
    return <FormArray>this.physicianScheduleForm.get('ScheduleItem');
  }

  getDynamicControl() {
    return <FormArray>this.physicianScheduleForm.get('ScheduleItem');
  }

  //#endregion schedule Dynamic Controls
  //#region Work Hours To Validation
  WorkHoursToValidation(i) {
    const toTimeValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.RegularWorkHrsFrom = toTimeValidation.controls[i].get('RegularWorkHrsFrom').value;
    this.RegularWorkHrsTo = toTimeValidation.controls[i].get('RegularWorkHrsTo').value;
    //if (toTimeValidation.controls[i].get('RegularWorkHrsFrom').value && toTimeValidation.controls[i].get('RegularWorkHrsTo').value) {
    //  this.IsFromDate = false;
    //} else {
    //  this.IsFromDate = true;
    //}

    if (this.RegularWorkHrsFrom) {
      if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsFrom = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    if (this.RegularWorkHrsTo) {
      if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsTo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    if ((this.RegularWorkHrsFrom) >= (this.RegularWorkHrsTo)) {
        this.util.showMessage("Yes", "To Time must be greater than From Time", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
          if (res) {
            toTimeValidation.controls[i].get('RegularWorkHrsTo').reset;
            toTimeValidation.controls[i].get('RegularWorkHrsTo').setValue(this.time);
            toTimeValidation.controls[i].get('RegularWorkHrsTo').setValue(null);
          }
        });
      
   
    }
  }
  //#endregion Work Hours To Validation
  //#region Break Time One From Validation

  BreakTimeOneFromValidation(i) {

    const BreakTimeOneFromValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.RegularWorkHrsFrom = BreakTimeOneFromValidation.controls[i].get('RegularWorkHrsFrom').value;
    this.RegularWorkHrsTo = BreakTimeOneFromValidation.controls[i].get('RegularWorkHrsTo').value;
    this.BreakHrsFromOne = BreakTimeOneFromValidation.controls[i].get('BreakHrsFrom1').value;
    if (BreakTimeOneFromValidation.controls[i].get('BreakHrsFrom1').value) {
      BreakTimeOneFromValidation.controls[i].get('BreakHrsTo1').enable();
    }
    //RegularWorkHrsFrom 
    if (this.RegularWorkHrsFrom) {
      if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsFrom = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    // RegularWorkHrsTo 
    if (this.RegularWorkHrsTo) {
      if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsTo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsFrom1
    if (this.BreakHrsFromOne) {
      if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsFromOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    if (this.RegularWorkHrsFrom < this.BreakHrsFromOne && this.BreakHrsFromOne < this.RegularWorkHrsTo) {

    } else{
      this.util.showMessage("Yes", "Break From Time must be greater than Work Hours Time", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        if (res) {
          BreakTimeOneFromValidation.controls[i].get('BreakHrsFrom1').reset();
          BreakTimeOneFromValidation.controls[i].get('BreakHrsFrom1').setValue(this.time);
          BreakTimeOneFromValidation.controls[i].get('BreakHrsFrom1').setValue(null);
       }
       });
 
    }
  }
  //#endregion Break Time One From Validation
  //#region Break Time One To Validation

  BreakTimeOneToValidation(i) {

    const BreakTimeOneToValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.RegularWorkHrsFrom = BreakTimeOneToValidation.controls[i].get('RegularWorkHrsFrom').value;
    this.RegularWorkHrsTo = BreakTimeOneToValidation.controls[i].get('RegularWorkHrsTo').value;
    this.BreakHrsFromOne = BreakTimeOneToValidation.controls[i].get('BreakHrsFrom1').value;
    this.BreakHrsToOne = BreakTimeOneToValidation.controls[i].get('BreakHrsTo1').value;

    //RegularWorkHrsFrom 
    if (this.RegularWorkHrsFrom) {
      if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsFrom = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    // RegularWorkHrsTo 
    if (this.RegularWorkHrsTo) {
      if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsTo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsFrom1
    if (this.BreakHrsFromOne) {
      if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsFromOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsTo1
    if (this.BreakHrsToOne) {
      if (this.BreakHrsToOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsToOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsToOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    if (this.RegularWorkHrsFrom < this.BreakHrsToOne &&
      this.RegularWorkHrsTo > this.BreakHrsToOne &&
      this.BreakHrsFromOne < this.BreakHrsToOne) { } else {
      this.util.showMessage("Yes", "Break To Time must be greater than Break From Time", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        if (res) {
          BreakTimeOneToValidation.controls[i].get('BreakHrsTo1').reset();
          BreakTimeOneToValidation.controls[i].get('BreakHrsTo1').setValue(this.time);
          BreakTimeOneToValidation.controls[i].get('BreakHrsTo1').setValue(null);
        }
      });
    }
  }
  //#endregion Break Time One To Validation
  //#region Break Time Two From Validation

  BreakTimeTwoFromValidation(i) {

    const BreakTimeTwoFromValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.RegularWorkHrsFrom = BreakTimeTwoFromValidation.controls[i].get('RegularWorkHrsFrom').value;
    this.RegularWorkHrsTo = BreakTimeTwoFromValidation.controls[i].get('RegularWorkHrsTo').value;
    this.BreakHrsFromOne = BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom1').value;
    this.BreakHrsToOne = BreakTimeTwoFromValidation.controls[i].get('BreakHrsTo1').value;
    this.BreakHrsFromTwo = BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom2').value;
    if (BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom2').value) {
      BreakTimeTwoFromValidation.controls[i].get('BreakHrsTo2').enable();
    }
    //RegularWorkHrsFrom 
    if (this.RegularWorkHrsFrom) {
      if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsFrom = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    // RegularWorkHrsTo 
    if (this.RegularWorkHrsTo) {
      if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsTo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsFrom1
    if (this.BreakHrsFromOne) {
      if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsFromOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsTo1
    if (this.BreakHrsToOne) {
      if (this.BreakHrsToOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsToOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsToOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsFrom2
    if (this.BreakHrsFromTwo) {
      if (this.BreakHrsFromTwo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsFromTwo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsFromTwo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    if (this.RegularWorkHrsFrom < this.BreakHrsFromTwo
      && this.RegularWorkHrsTo > this.BreakHrsFromTwo
      && this.BreakHrsFromOne < this.BreakHrsFromTwo
      && this.BreakHrsToOne < this.BreakHrsFromTwo
    ) {

    } else {
      this.util.showMessage("Yes", "Break From Time must be greater than Break  Time", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        if (res) {
          BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom2').reset();
          BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom2').setValue(this.time);
          BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom2').setValue(null);
        }
      });

    }

  }
  //#endregion Break Time One From Validation
  //#region Break Time Two To Validation

  BreakTimeTwoToValidation(i) {

    const BreakTimeTwoToValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.RegularWorkHrsFrom = BreakTimeTwoToValidation.controls[i].get('RegularWorkHrsFrom').value;
    this.RegularWorkHrsTo = BreakTimeTwoToValidation.controls[i].get('RegularWorkHrsTo').value;
    this.BreakHrsFromOne = BreakTimeTwoToValidation.controls[i].get('BreakHrsFrom1').value;
    this.BreakHrsToOne = BreakTimeTwoToValidation.controls[i].get('BreakHrsTo1').value;
    this.BreakHrsFromTwo = BreakTimeTwoToValidation.controls[i].get('BreakHrsFrom2').value;
    this.BreakHrsToTwo = BreakTimeTwoToValidation.controls[i].get('BreakHrsTo2').value;


    //RegularWorkHrsFrom 
    if (this.RegularWorkHrsFrom) {
      if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.RegularWorkHrsFrom.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsFrom.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsFrom = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    // RegularWorkHrsTo 
    if (this.RegularWorkHrsTo) {
      if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.RegularWorkHrsTo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.RegularWorkHrsTo.toString().split(" ")[0].toString().split(":")[1]);

      this.RegularWorkHrsTo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsFrom1
    if (this.BreakHrsFromOne) {
      if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsFromOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsFromOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsFromOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsTo1
    if (this.BreakHrsToOne) {
      if (this.BreakHrsToOne.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsToOne.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsToOne.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsToOne = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsFrom2
    if (this.BreakHrsFromTwo) {
      if (this.BreakHrsFromTwo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsFromTwo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsFromTwo.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsFromTwo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    //BreakHrsTo2
    if (this.BreakHrsToTwo) {
      if (this.BreakHrsToTwo.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.BreakHrsToTwo.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.BreakHrsToTwo.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (this.BreakHrsToTwo.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.BreakHrsToTwo.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.BreakHrsToTwo.toString().split(" ")[0].toString().split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(this.BreakHrsToTwo.toString().split(" ")[0].toString().split(":")[1]);

      this.BreakHrsToTwo = this.temporaryDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    if (this.RegularWorkHrsFrom < this.BreakHrsToTwo
      && this.BreakHrsFromOne < this.BreakHrsToTwo
      && this.BreakHrsToOne < this.BreakHrsToTwo
      && this.BreakHrsFromTwo < this.BreakHrsToTwo
      && this.RegularWorkHrsTo > this.BreakHrsToTwo
    ) { } else {
      this.util.showMessage("Yes", "Break To Time must be greater than Break From Time", BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
        if (res) {
          BreakTimeTwoToValidation.controls[i].get('BreakHrsTo2').reset();
          BreakTimeTwoToValidation.controls[i].get('BreakHrsTo2').setValue(this.time);
          BreakTimeTwoToValidation.controls[i].get('BreakHrsTo2').setValue(null);
        }
      });
    }
  }
  //#endregion Break Time One From Validation
  //#region Clear
  ClearForm() {
     const schItem = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.physicianScheduleForm.reset();
    this.addDynamicDays();
    for (let i = 0; i < schItem.length; i++) {
     
      schItem.controls[i].get('RegularWorkHrsFrom').setValue(this.time);
      schItem.controls[i].get('RegularWorkHrsFrom').setValue(null);
      schItem.controls[i].get('RegularWorkHrsTo').setValue(this.time);
      schItem.controls[i].get('RegularWorkHrsTo').setValue(null);
      schItem.controls[i].get('BreakHrsFrom1').setValue(this.time);
      schItem.controls[i].get('BreakHrsFrom1').setValue(null);
      schItem.controls[i].get('BreakHrsTo1').setValue(this.time);
      schItem.controls[i].get('BreakHrsTo1').setValue(null);
      schItem.controls[i].get('BreakHrsFrom2').setValue(this.time);
      schItem.controls[i].get('BreakHrsFrom2').setValue(null);
      schItem.controls[i].get('BreakHrsTo2').setValue(this.time);
      schItem.controls[i].get('BreakHrsTo2').setValue(null);
    }
    this.checktime();
    this.getSchedule();
    this.isTableVisible = true;
  }
    //#endregion
  //#region Work Hours
  tableChange(event: any) {
    if (event.checked) {
      const BreakTimeOneFromValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem']
      for (var i = 0; i < BreakTimeOneFromValidation.length; i++) {
        BreakTimeOneFromValidation.controls[i].get('BreakHrsTo1').disable();
        if (BreakTimeOneFromValidation.controls[i].get('BreakHrsFrom1').value) {
          BreakTimeOneFromValidation.controls[i].get('BreakHrsTo1').enable();
        }
      }
      const BreakTimeTwoFromValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem']

      for (var i = 0; i < BreakTimeTwoFromValidation.length; i++) {
        BreakTimeTwoFromValidation.controls[i].get('BreakHrsTo2').disable();
        if (BreakTimeTwoFromValidation.controls[i].get('BreakHrsFrom2').value) {
          BreakTimeTwoFromValidation.controls[i].get('BreakHrsTo2').enable();
        }

      }

      this.isTableVisible = false;

    }
    else {
      this.isTableVisible = true;
    }
  }
    //#endregion
  //#region Count
  getCount() {

    for (var i = 5; i <= 60; i += 5) {
      if (i <= 30) {
        this.consultationPerSlot.push(i);
      }
      this.timeSlotDuration.push(i);
    }
  }
    //#endregion
  //#region DropDown Facility
  bindFacilities() {
    this.physicianSvc.getFacilitiesforPhysician(this.providerId).then(data => {
      this.facilityName = data;
      this.facilityid = this.facilityName[0].FacilityId
      this.getSchedule();
    });
  }
   //#endregion
  //#region Dynamic Days
  addDynamicDays() {
    for (let i = 0; i < this.days.length; i++) {
      this.scheduleItemsControl.push(this.scheduleDynamicControls());
      const setvalue = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
      setvalue.controls[i].get('AppointmentDay').setValue(this.days[i]);
      this.scheduleItemsControl.removeAt(7);
    }
  }

  //#endregion
  //#region Set values
  getSchedule() {
    this.physicianSvc.getScheduleSetup(this.providerId, this.facilityid).then(data => {
      if (data != null && data != undefined && data.length > 0) {
        this.physicianScheduleForm.get('Facility').setValue(data[0].FacilityID);
        this.physicianScheduleForm.get('EffectiveDate').setValue(data[0].EffectiveDate);
        this.physicianScheduleForm.get('TerminationDate').setValue(data[0].TerminationDate);
        this.physicianScheduleForm.get('TimeSlotDuration').setValue(data[0].TimeSlotDuration);
        this.physicianScheduleForm.get('BookingPerSlot').setValue(data[0].BookingPerSlot);
        // this.facilitydisable();
        const schItem = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
        for (let i = 0; i < data.length; i++) {
          if (data[i].AppointmentDay == "Sunday") {

            schItem.controls[0].get('IsDaysAvailable').setValue(true);
            schItem.controls[0].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[0].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[0].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[0].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[0].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[0].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[0].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[0].get('BookingPerDay').setValue(data[i].BookingPerDay);
          }
          if (data[i].AppointmentDay == "Monday") {
            schItem.controls[1].get('IsDaysAvailable').setValue(true);
            schItem.controls[1].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[1].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[1].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[1].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[1].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[1].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[1].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[1].get('BookingPerDay').setValue(data[i].BookingPerDay);

          }
          if (data[i].AppointmentDay == "Tuesday") {
            schItem.controls[2].get('IsDaysAvailable').setValue(true);
            schItem.controls[2].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[2].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[2].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[2].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[2].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[2].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[2].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[2].get('BookingPerDay').setValue(data[i].BookingPerDay);

          }
          if (data[i].AppointmentDay == "Wednesday") {
            schItem.controls[3].get('IsDaysAvailable').setValue(true);
            schItem.controls[3].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[3].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[3].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[3].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[3].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[3].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[3].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[3].get('BookingPerDay').setValue(data[i].BookingPerDay);
          }
          if (data[i].AppointmentDay == "Thursday") {
            schItem.controls[4].get('IsDaysAvailable').setValue(true);
            schItem.controls[4].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[4].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[4].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[4].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[4].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[4].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[4].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[4].get('BookingPerDay').setValue(data[i].BookingPerDay);

          }
          if (data[i].AppointmentDay == "Friday") {
            schItem.controls[5].get('IsDaysAvailable').setValue(true);
            schItem.controls[5].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[5].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[5].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[5].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[5].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[5].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[5].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[5].get('BookingPerDay').setValue(data[i].BookingPerDay);

          }
          if (data[i].AppointmentDay == "Saturday") {
            schItem.controls[6].get('IsDaysAvailable').setValue(true);
            schItem.controls[6].get('RegularWorkHrsFrom').setValue(data[i].RegularWorkHrsFrom);
            schItem.controls[6].get('RegularWorkHrsTo').setValue(data[i].RegularWorkHrsTo);
            if (data[i].BreakHrsFrom1 != "00:00:00") {
              schItem.controls[6].get('BreakHrsFrom1').setValue(data[i].BreakHrsFrom1);
            }
            if (data[i].BreakHrsTo1 != "00:00:00") {
              schItem.controls[6].get('BreakHrsTo1').setValue(data[i].BreakHrsTo1);
            }
            if (data[i].BreakHrsFrom2 != "00:00:00") {
              schItem.controls[6].get('BreakHrsFrom2').setValue(data[i].BreakHrsFrom2);
            }
            if (data[i].BreakHrsTo2 != "00:00:00") {
              schItem.controls[6].get('BreakHrsTo2').setValue(data[i].BreakHrsTo2);
            }
            schItem.controls[6].get('NoOfSlots').setValue(data[i].NoOfSlots);
            schItem.controls[6].get('BookingPerDay').setValue(data[i].BookingPerDay);
          }
        }
      }
    });
  }
    //#endregion
  //#region Submit

  addPhysicianScheduleDetails() {
    if(this.physicianScheduleForm.valid){
    this.physicianScheduleModel.ProviderID = this.providerId;
    this.physicianScheduleModel.FacilityID = this.physicianScheduleForm.get('Facility').value;
    this.physicianScheduleModel.EffectiveDate = this.physicianScheduleForm.get('EffectiveDate').value;
    this.physicianScheduleModel.TerminationDate = this.physicianScheduleForm.get('TerminationDate').value;
    this.physicianScheduleModel.AppointmentAllowed = this.physicianScheduleForm.get('WorkHours').value;
    this.physicianScheduleModel.TimeSlotDuration = this.physicianScheduleForm.get('TimeSlotDuration').value;
    this.physicianScheduleModel.BookingPerSlot = this.physicianScheduleForm.get('BookingPerSlot').value;
    const scheduleItem = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    this.physicianScheduleModel.Items = [];
    for (let i = 0; i < this.days.length; i++) {
      this.scheduleItemModel = new PhysicianScheduleItemModel();
      if (scheduleItem.controls[i].get('IsDaysAvailable').value == true) {
        this.scheduleItemModel.AppointmentDay = scheduleItem.controls[i].get('AppointmentDay').value;
        this.scheduleItemModel.RegularWorkHrsFrom = scheduleItem.controls[i].get('RegularWorkHrsFrom').value;
        this.scheduleItemModel.RegularWorkHrsTo = scheduleItem.controls[i].get('RegularWorkHrsTo').value;
        if (scheduleItem.controls[i].get('BreakHrsFrom1').value != "" && scheduleItem.controls[i].get('BreakHrsTo1').value != "") {
          this.scheduleItemModel.BreakHrsFrom1 = scheduleItem.controls[i].get('BreakHrsFrom1').value;
          this.scheduleItemModel.BreakHrsTo1 = scheduleItem.controls[i].get('BreakHrsTo1').value;
        }
        else {
          this.scheduleItemModel.BreakHrsFrom1 = "00:00:00";
          this.scheduleItemModel.BreakHrsTo1 = "00:00:00";
        }
        if (scheduleItem.controls[i].get('BreakHrsFrom2').value != "" && scheduleItem.controls[i].get('BreakHrsTo2').value != "") {
          this.scheduleItemModel.BreakHrsFrom2 = scheduleItem.controls[i].get('BreakHrsFrom2').value;
          this.scheduleItemModel.BreakHrsTo2 = scheduleItem.controls[i].get('BreakHrsTo2').value;
        }
        else {
          this.scheduleItemModel.BreakHrsFrom2 = "00:00:00";
          this.scheduleItemModel.BreakHrsTo2 = "00:00:00";
        }
        this.scheduleItemModel.NoOfSlots = 0;
        this.scheduleItemModel.BookingPerDay = 0;
        this.physicianScheduleModel.Items.push(this.scheduleItemModel);
      }
    }

    const scheduleItemArray = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    for (let i = 0; i < scheduleItemArray.length; i++) {
      if (scheduleItemArray.controls[i].get('IsDaysAvailable').value == true) {
        this.PhysicainFromdatevalue.push(scheduleItemArray.controls[i].value);
      }
    }
    if (this.PhysicainFromdatevalue.length > 0) {

      for (let i = 0; i < this.PhysicainFromdatevalue.length; i++) {
        if (this.PhysicainFromdatevalue[i].RegularWorkHrsFrom == null || this.PhysicainFromdatevalue[i].RegularWorkHrsTo == null || this.PhysicainFromdatevalue[i].RegularWorkHrsFrom == "" || this.PhysicainFromdatevalue[i].RegularWorkHrsTo == "") {
          this.physicianRegularWorkFromCollection.push(this.PhysicainFromdatevalue[i]);
        }
        else {
          this.physicianFromDateCollection.push(this.PhysicainFromdatevalue[i]);
        }
      }

      if (this.physicianRegularWorkFromCollection.length > 0) {
        this.util.showMessage("Failure", "Fill both RegularWorkFrom and RegularWorkTo for selected Days to Save the Schedule", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)
        this.physicianRegularWorkFromCollection = [];
        this.PhysicainFromdatevalue = [];
      }

      else if (this.physicianFromDateCollection.length > 0) {
        this.physicianSvc.addUpdatePhysicianSchedules(this.physicianScheduleModel).then((data) => {
          if (data.TimeavailabilityStatus == "Available") {
            this.getSchedule();
            //this.facilitydisable();
            this.util.showMessage("Success", "Physician details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
          } else {
            this.util.showMessage("Success", data.TimeavailabilityStatus, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });

          }
        });
        this.physicianFromDateCollection = [];
        this.PhysicainFromdatevalue = [];

      }
    } else {
      this.physicianSvc.addUpdatePhysicianSchedules(this.physicianScheduleModel).then((data) => {
        if (data.TimeavailabilityStatus == "Available") {
          this.getSchedule();
          //this.facilitydisable();
          this.util.showMessage("Success", "Physician details saved successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
        } else {
          this.util.showMessage("Success", data.TimeavailabilityStatus, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
        }
      });
      this.PhysicainFromdatevalue = [];
    }
  }
}
      //#endregion
  //#region "back"
  back() {
    this.router.navigate(['/home/physician/physicianlist']);
  }
  //#endregion
  //#region Facility Details Click
  facilityDetails(number) {
   // this.checktime();
    this.facilityid = number;
    const schItem = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
    schItem.reset();
    for (let i = 0; i < schItem.length; i++) {

      schItem.controls[i].get('RegularWorkHrsFrom').setValue(this.time);
      schItem.controls[i].get('RegularWorkHrsFrom').setValue(null);
      schItem.controls[i].get('RegularWorkHrsTo').setValue(this.time);
      schItem.controls[i].get('RegularWorkHrsTo').setValue(null);
      schItem.controls[i].get('BreakHrsFrom1').setValue(this.time);
      schItem.controls[i].get('BreakHrsFrom1').setValue(null);
      schItem.controls[i].get('BreakHrsTo1').setValue(this.time);
      schItem.controls[i].get('BreakHrsTo1').setValue(null);
      schItem.controls[i].get('BreakHrsFrom2').setValue(this.time);
      schItem.controls[i].get('BreakHrsFrom2').setValue(null);
      schItem.controls[i].get('BreakHrsTo2').setValue(this.time);
      schItem.controls[i].get('BreakHrsTo2').setValue(null);
    }
    this.addDynamicDays();
    this.getSchedule();
  }
  //#endregion
  //#region DaysCheck Current Time
  daysCheck(i) {
      this.checktime();
  }
}
//#endregion




//  daysAvailable(i) {
//    const schItem = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];

//    if ((schItem.controls[i].get('IsDaysAvailable').value == false) || schItem.controls[i].get('IsDaysAvailable').value == null) {

//      if ((schItem.controls[i].get('RegularWorkHrsFrom').value && schItem.controls[i].get('RegularWorkHrsTo').value)) {
//        this.submitdisable = true;  
//      } else if ((schItem.controls[i].get('RegularWorkHrsFrom').value == "" || null || schItem.controls[i].get('RegularWorkHrsTo').value == "" || null)) {
//        this.submitdisable = false;
//      }
//    }
//    if (schItem.controls[i].get('RegularWorkHrsFrom').valueChanges) {
//      schItem.controls[i].get('RegularWorkHrsFrom').valueChanges.subscribe((StartDate: any) => {
//        if ((schItem.controls[i].get('RegularWorkHrsFrom').value) && (schItem.controls[i].get('RegularWorkHrsTo').value)) {
//          this.submitdisable = true;
//        } else {
//          this.submitdisable = false;
//        }
//      });
//    }
//    if (schItem.controls[i].get('RegularWorkHrsTo').valueChanges) {
//      schItem.controls[i].get('RegularWorkHrsTo').valueChanges.subscribe((Enddate: any) => {
//        if ((schItem.controls[i].get('RegularWorkHrsTo').value) && (schItem.controls[i].get('RegularWorkHrsFrom').value)) {
//          this.submitdisable = true;
//        } else {
//          this.submitdisable = false;
//        }
//      });
//    }
//    }
//}
    //this.RegularWorkHrsFrom = schItem.controls[i].get('RegularWorkHrsFrom').value;
    //schItem.controls[i].get('RegularWorkHrsFrom').valueChanges.subscribe((StartDate: any) => {
    //});
  //#endregion Set values

  //#region Save Physician Data

  //getToDate(i) {
  //  const toTimeValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];

  //  this.RegularWorkHrsFrom = toTimeValidation.controls[i].get('RegularWorkHrsFrom').value;

  //    if (toTimeValidation.controls[i].get('RegularWorkHrsFrom').value && toTimeValidation.controls[i].get('RegularWorkHrsTo').value) {
  //      this.IsFromDate = false;
  //    } else {
  //      this.IsFromDate = true;
  //    }

  //}
  //facilitydisable() {
  //  if (this.physicianScheduleForm.get('Facility').value) {
  //    this.physicianScheduleForm.get('Facility').disable();
  //  }
  //}
  ////#region ngAfter
  //ngAfterContentChecked() {
  //  this.ref.detectChanges();
  //}
  ////#endregion

//hourSelected(value) {
//  this.timepicker.close();
//}

  //timechecking() {

  //}

  ////#region RegularWorkHrsFrom
  //getToDate(i) {
  //  const toTimeValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
  //  this.RegularWorkHrsFrom = toTimeValidation.controls[i].get('RegularWorkHrsFrom').value;
  //  if (toTimeValidation.controls[i].get('RegularWorkHrsFrom').value && toTimeValidation.controls[i].get('RegularWorkHrsTo').value) {
  //    this.IsFromDate = false;
  //  } else {
  //    this.IsFromDate = true;
  //  }
  //}
  ////#endregion
//Check() {
//  const toTimeValidation = <FormArray>this.physicianScheduleForm.controls['ScheduleItem'];
//  this.RegularWorkHrsFrom = toTimeValidation.controls[0].get('RegularWorkHrsFrom').value;
//  this.RegularWorkHrsTo = toTimeValidation.controls[0].get('RegularWorkHrsTo').value;
//  toTimeValidation.get('RegularWorkHrsTo').valueChanges.subscribe((StartDate: any) => {
//  });
//}
