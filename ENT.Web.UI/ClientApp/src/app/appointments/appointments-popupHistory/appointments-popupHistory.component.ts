import { Component, OnInit } from '@angular/core';
import { TableConfig } from 'src/app/ux/columnConfig';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'appointments-popupHistory',
  templateUrl: 'appointments-popupHistory.component.html',
  styleUrls: [ './appointments-popupHistory.component.css' ]
})

export class AppointmentsPopupHistoryComponent implements OnInit{

  public tableConfig: TableConfig = new TableConfig();
  patientId: number;
  patientAppointmentHisList: any;

  constructor(private appointmentSvc:AppointmentsService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;

    this.tableConfig.columnConfig = [
      { PropertyName: 'Appointment Date', DisplayName: 'Appointment Date', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Appointment Time', DisplayName: 'Appointment Time', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'To Consult', DisplayName: 'To Consult', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Purpose', DisplayName: 'Purpose', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Appointment Status', DisplayName: 'Appointment Status', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }

  ngOnInit() {
    this.patientAppointmentHistoryCollection();
  }

  patientAppointmentHistoryCollection() {
    this.appointmentSvc.getPatientAppointmentHisById(this.patientId).then(data => {
      this.patientAppointmentHisList = data;
    });
  }

}
