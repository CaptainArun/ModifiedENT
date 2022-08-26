import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../ux/columnConfig';
import { NewPatientService } from '../newPatient.service';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../core/custom-http.service';
import { ActivatedRoute } from '@angular/router';
import { AudiologyViewComponent } from './audiology-view/audiology-view.component';

@Component({
    selector: 'app-audiology',
    templateUrl: './audiology.component.html',
    styleUrls: ['./audiology.component.css']
})

export class AudiologyComponent implements OnInit {
    tableConfig: TableConfig = new TableConfig();
    patientId: any;
    audiologyData: any;

    constructor(public newPatientService: NewPatientService, public dialog: MatDialog, public custHttp: CustomHttpService, public activateRoute: ActivatedRoute) {

        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.columnConfig = [
            { PropertyName: 'VisitNo', DisplayName: 'Visit Number', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'VisitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'ProviderName', DisplayName: 'Provider Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'ASSR', DisplayName: 'ASSR', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'BERA', DisplayName: 'BERA', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'Electrocochleography', DisplayName: 'Electrocochleography', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'HearingAid', DisplayName: 'Hearing Aid', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'OAE', DisplayName: 'OAE', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'SpecialTest', DisplayName: 'Special Test', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'SpeechTherapy', DisplayName: 'Speech Therapy', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
            { PropertyName: 'TinnitusMasking', DisplayName: 'Tinnitus Masking', DisplayMode: 'Text', LinkUrl: '', isVisible: true }
        ];
    }

    ngOnInit() {
        this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.activateRoute.params.subscribe(params => {
            this.patientId = params['PatientId']
            this.newPatientService.patientId = this.patientId;
        });
        this.getAudiologyRequest();
    }

    onBindItem(event: any) {
        if (event.Item) {
            if (event.Item.ASSR == true) {
                event.Item.ASSR = "Yes";
            }
            else if (event.Item.ASSR == false) {
                event.Item.ASSR = "No";
            }
            else {
                event.Item.ASSR = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.BERA == true) {
                event.Item.BERA = "Yes";
            }
            else if (event.Item.BERA == false) {
                event.Item.BERA = "No";
            }
            else {
                event.Item.BERA = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.Electrocochleography == true) {
                event.Item.Electrocochleography = "Yes";
            }
            else if (event.Item.Electrocochleography == false) {
                event.Item.Electrocochleography = "No";
            }
            else {
                event.Item.Electrocochleography = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.HearingAid == true) {
                event.Item.HearingAid = "Yes";
            }
            else if (event.Item.HearingAid == false) {
                event.Item.HearingAid = "No";
            }
            else {
                event.Item.HearingAid = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.OAE == true) {
                event.Item.OAE = "Yes";
            }
            else if (event.Item.OAE == false) {
                event.Item.OAE = "No";
            }
            else {
                event.Item.OAE = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.SpecialTest == true) {
                event.Item.SpecialTest = "Yes";
            }
            else if (event.Item.SpecialTest == false) {
                event.Item.SpecialTest = "No";
            }
            else {
                event.Item.SpecialTest = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.SpeechTherapy == true) {
                event.Item.SpeechTherapy = "Yes";
            }
            else if (event.Item.SpeechTherapy == false) {
                event.Item.SpeechTherapy = "No";
            }
            else {
                event.Item.SpeechTherapy = "Unknown";
            }
        }
        if (event.Item) {
            if (event.Item.TinnitusMasking == true) {
                event.Item.TinnitusMasking = "Yes";
            }
            else if (event.Item.TinnitusMasking == false) {
                event.Item.TinnitusMasking = "No";
            }
            else {
                event.Item.TinnitusMasking = "Unknown";
            }
        }
    }

    getAudiologyRequest() {
        this.newPatientService.getAudiologyRequestbyPatientId(this.patientId).then(res => {
            this.audiologyData = res;
        });
    }

    openAudiologyViewRecord(element: any) {
        const dialogRef = this.dialog.open(AudiologyViewComponent, {
            data: element.Item,
            height: 'auto',
            width: 'auto',
            autoFocus: false,
        });
    }

}