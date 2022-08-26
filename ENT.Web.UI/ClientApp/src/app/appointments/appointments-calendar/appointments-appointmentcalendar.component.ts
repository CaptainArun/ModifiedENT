import { Component, OnInit, ViewChild } from '@angular/core';
import { DxSchedulerComponent } from 'devextreme-angular';
import { AppointmentsService } from '../appointments.service';
import { SchedulerModel } from '../models/schedulerModel';
import { MatDialog } from '@angular/material';
import { AppointmentsPopupHistoryComponent } from '../appointments-popupHistory/appointments-popupHistory.component';
import { UtilService } from 'src/app/core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
import { AppointmentViewRecordComponent } from '../appointment-viewRecord/appointment-viewRecord.component';

@Component({
  selector: 'appointments-appointmentcalendar',
  templateUrl: 'appointments-appointmentcalendar.component.html',
  styleUrls: ['./appointments-appointmentcalendar.component.css']
})

export class AppointmentCalendarComponent implements OnInit {

  //#region property Declaration
  @ViewChild(DxSchedulerComponent, { static: true }) sch: DxSchedulerComponent;
  schdulerCurrentView: string;
  currentDate: Date = new Date();
  schdulerCurrentDate: string;
  appointmentsData: SchedulerModel[] = [];
  //#endregion property Declaration

  //#region constructor
  constructor(private AppointService: AppointmentsService,
    private dialog: MatDialog, private util: UtilService) {
    this.schdulerCurrentView = 'day';
    this.schdulerCurrentDate = new Date().toDateString();
  }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit(): void {
    this.getDataSource();
  }
  //#endregion ngOnInit

  //#region calendar data from service
  getDataSource() {
    this.sch.dataSource = [];
    this.AppointService.getCalenederData(this.schdulerCurrentView, this.schdulerCurrentDate).then(res => {
      if (res.length > 0) {
        this.appointmentsData = [];
        let tempArray: SchedulerModel[] = [];
        for (let i = 0; i < res.length; i++) {
          let data: SchedulerModel = new SchedulerModel();
          data.AppointmentID = res[i].AppointmentID;
          data.StartDate = (res[i].AppointmentStartTime);
          data.EndDate = (res[i].AppointmentEndTime);
          data.text = (res[i].FacilityName + " - " + res[i].PatientName);

          tempArray.push(data);
        }
        this.appointmentsData = tempArray;

        this.sch.instance.repaint();
      } else {
        this.appointmentsData = [];
        this.sch.instance.repaint();
      }
    }
    );
  }
  //#endregion calendar data from service

  //#region onOption Change
  onOptionChanged(e: any) {
    let chkChange: Boolean = false;
    if (e.name === 'currentView') {
      this.schdulerCurrentView = e.value;
      chkChange = true;
    } else if (e.name === 'currentDate') {
      this.schdulerCurrentDate = new Date(e.value).toDateString();
      chkChange = true;
    }
    if (chkChange) {
      this.getDataSource();
    }
  }
  //#endregion onOption Change

  //#region onClick on data
  onAppointmentClick(e: any) {
    e.cancel = true;
    e.event.stopPropagation();

    this.sch.instance.repaint();

    this.AppointService.getPatientAppointmentById(e.appointmentData.AppointmentID).then(data => {
      var appointmentData = data;
      const dialogRef1 = this.dialog.open(AppointmentViewRecordComponent, {
        data: appointmentData,
        height: 'auto',
        width: "80%",
        autoFocus: true,
      });
    });
  }
  //#endregion onClick on data
}


  // let date = new Date(e.appointmentData.StartDate).toDateString();
  // this.AppointService.getCalenederData("day", date).then(data => {
      //   if (data.length > 0) {
      //     const dialogRef1 = this.dialog.open(AppointmentsPopupHistoryComponent, {
        //       data: data,
        //       height: 'auto',
        //       width: "80%",
      //       autoFocus: true,
      //     });
      //     dialogRef1.afterClosed().subscribe(result => {
        //       if (result == "Updated") {
          //         this.getDataSource();
          //       }
          //     });
          //   } else {
            //     this.util.showMessage('', 'No Appointment found !!',
            //       BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
      //         (res) => {
        //           if (res) { }
      //         }
      //       );
      //   }
      // });

      // let date = new Date(e.cellData.startDate).toDateString()
      // this.AppointService.getCalenederData("day", date).then(data => {
      //   if (data.length > 0) {
      //     const dialogRef1 = this.dialog.open(AppointmentsPopupHistoryComponent, {
      //       data: data,
      //       height: 'auto',
      //       width: "80%",
      //       autoFocus: true,
      //     });
      //     dialogRef1.afterClosed().subscribe(result => {
        //       if (result == "Updated") {
          //         this.getDataSource();
          //       }
          //     });
      //   } else {
        //     this.util.showMessage('', 'No Appointment found !!',
        //       BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          //         (res) => {
            //           if (res) { }
            //         }
            //       );
            //   }
            // });
