import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../core/custom-http.service';
import { ActivatedRoute } from '@angular/router';
import { DischargeViewComponent } from './discharge-view/discharge-view.component';

@Component({
    selector: 'app-discharge',
    templateUrl: './discharge.component.html',
    styleUrls: ['./discharge.component.css']
})

export class DischargeComponent implements OnInit {
    tableConfig: TableConfig = new TableConfig();
    patientId: any;
    dischargeData: any;

    constructor(public newPatientService: NewPatientService, public dialog: MatDialog, public custHttp: CustomHttpService, public activateRoute: ActivatedRoute) {
        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.columnConfig = [
            { PropertyName: 'AdmissionNumber', DisplayName: 'Admission Number', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'DischargeStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'patientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'AdmittingPhysician', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'RecommendedProcedure', DisplayName: 'Procedure (short)', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'Urgency', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'AdmissionDate', DisplayName: 'Admission Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' }
        ];
    }

    ngOnInit() {
        this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.activateRoute.params.subscribe(params => {
            this.patientId = params['PatientId']
            this.newPatientService.patientId = this.patientId;
        });
        this.getDischargeRecord();
    }

    getDischargeRecord() {
        this.newPatientService.getDischargebyPatientId(this.patientId).then(res => {
            this.dischargeData = res;
        });
    }

    openDischargeViewRecord(element: any) {
        this.newPatientService.getDischargeRecord(element.Item.DischargeSummaryId).then(res => {
            const dialogRef = this.dialog.open(DischargeViewComponent, {
                data: res,
                height: 'auto',
                width: 'auto',
                autoFocus: false,
            });
        });
    }

}