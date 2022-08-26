import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../core/custom-http.service';
import { ActivatedRoute } from '@angular/router';
import { EPrescriptionViewComponent } from './e-prescription-view/e-prescription-view.component';

@Component({
    selector: 'app-e-prescription',
    templateUrl: './e-prescription.component.html',
    styleUrls: ['./e-prescription.component.css']
})

export class EPrescriptionComponent implements OnInit {
    tableConfig: TableConfig = new TableConfig();
    patientId: any;
    ePrescriptionData: any;

    constructor(public newPatientService: NewPatientService, public dialog: MatDialog, public custHttp: CustomHttpService, public activateRoute: ActivatedRoute) {
        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.columnConfig = [
            { PropertyName: 'MedicationNumber', DisplayName: 'Rx No', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'physicianName', DisplayName: 'Physician', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'VisitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'CreatedDate', DisplayName: 'Issue Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
            { PropertyName: 'MedicationStatus', DisplayName: 'Rx Status', DisplayMode: 'Text', LinkUrl: '' }
        ];
    }

    ngOnInit() {
        this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.activateRoute.params.subscribe(params => {
            this.patientId = params['PatientId']
            this.newPatientService.patientId = this.patientId;
        });
        this.getEPrescriptionRecord();
    }

    onBindItem(event: any) {
        if (event.Item) {
            if (event.Item.VisitDateandTime == null || event.Item.VisitDateandTime == "") {
                event.Item.VisitDateandTime = event.Item.AdmissionDateandTime;
            }
            else {
                event.Item.VisitDateandTime = event.Item.VisitDateandTime;
            }
        }
    }

    getEPrescriptionRecord() {
        this.newPatientService.getMedicationbyPatientId(this.patientId).then(res => {
            this.ePrescriptionData = res;
        });
    }

    openEPrescriptionViewRecord(element: any) {
        this.newPatientService.getMedicationRecord(element.Item.MedicationId).then(res => {
            const dialogRef = this.dialog.open(EPrescriptionViewComponent, {
                data: res,
                width: 'auto',
                height: 'auto',
                autoFocus: false,
            });
        });
    }

}