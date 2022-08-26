import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import { TableConfig } from "../../ux/columnConfig";
import { AudiologyViewHistoryPopupComponent } from "../audiology-viewhistory-popup/audiology-viewhistory-popup.component";
import { AudiologyService } from "../audiology.service";

@Component({
    selector: 'audiology-common',
    templateUrl: './audiology-common.component.html',
    styleUrls: ['./audiology-common.component.css']
})

export class AudiologyCommonComponent implements OnInit {
    patientId: number;
    patientDetails: any; 
    patientVisitHistory: any;
    tableConfig: TableConfig = new TableConfig();
    showVisitHistory: boolean = false;

    constructor(public audiologySvc: AudiologyService, private config: UtilService, public dialog: MatDialog, public activateRoute: ActivatedRoute) {
        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = false;
        this.tableConfig.showAdd = false;
        this.tableConfig.showDelete = false;
        this.tableConfig.showOpen = false;

        this.tableConfig.columnConfig = [
            { PropertyName: 'VisitNo', DisplayName: 'Visit Number', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'FacilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'VisitDate', DisplayName: 'Visit Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
            { PropertyName: 'Visittime', DisplayName: 'Visit Time', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'ToConsult', DisplayName: 'To Consult', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'urgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' }
        ];
    }

    ngOnInit() {
        this.activateRoute.params.subscribe((params) => {
            this.patientId = params["PatientId"];
        });
        this.getAudiologyPatientID();
    }

    getAudiologyPatientID() {
        this.audiologySvc.visitHistoryDetails(this.patientId).then(data => {
            this.patientVisitHistory = data;
            if (this.patientVisitHistory.length != 0) {
                this.patientVisitHistory = data;
                this.showVisitHistory = true;
            }
            else {
                this.showVisitHistory = false;
            }
        });
    }

    openVisitViewReport(element: any) {
        this.audiologySvc.getPatientVisitById(element.Item.VisitId).then(res => {
            var visitDetails = res;
            const dialogRef = this.dialog.open(AudiologyViewHistoryPopupComponent, {
                data: visitDetails,
                width: '1200px',
            });
        });
    }

}