import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "src/app/core/custom-http.service";
import { TableConfig } from "src/app/ux/columnConfig";
import { VisitService } from "../visit.service";

@Component
    ({
        selector: 'visit-PopupHistory',
        templateUrl: 'visit-PopupHistory.component.html'
    })

export class visitPopupHistoryComponent implements OnInit {
    //#region "Property Decelaration"
    public visitHistoryList: TableConfig = new TableConfig();
    particularHisCountData: any;
    particularPatientId: any;
    particularPatientHistorydata: any;
   // showResult:any ;

    //#endregion


    ngOnInit() {
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
        this.data ? (this.particularPatientId = this.data) : null;
        this.getVisitParticularHistoryCountData();
        this.getVisitParticularHistoryData();
    }


    constructor(private customHttpSvc: CustomHttpService, private visitSvc: VisitService, private dialogRef: MatDialogRef<visitPopupHistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.visitHistoryList.showPagination = true;
        this.visitHistoryList.showView = false;
        this.visitHistoryList.showIcon = false;
        this.visitHistoryList.showEdit = false;
        this.visitHistoryList.showAdd = false;
        this.visitHistoryList.showDelete = false;
        this.visitHistoryList.showOpen = false;

        this.visitHistoryList.columnConfig = [
            { PropertyName: 'VisitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'PatientContactNumber', DisplayName: 'Patient Contact Number', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'MRNumber', DisplayName: 'MR#', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'ProviderName', DisplayName: 'To visit', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'urgencyType', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'visitType', DisplayName: 'Visit Type', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'Appointment', DisplayName: 'Appointment', DisplayMode: 'Text', LinkUrl: '' },
            { PropertyName: 'visitStatus', DisplayName: 'Visit Status', DisplayMode: 'Text', LinkUrl: '' },

        ];
    }

    //#region "getVisitParticularHistoryCountData"
    getVisitParticularHistoryCountData() {
        this.visitSvc.getVisitParticularHistoryCountData(this.particularPatientId).then(res => {
            this.particularHisCountData = res;
        });
    }
    //#endregion

    //#region "getVisitParticularHistoryData"
    getVisitParticularHistoryData() {
        this.visitSvc.getVisitParticularHistoryById(this.particularPatientId).then(res => {
            this.particularPatientHistorydata = res;
            // if(this.particularPatientHistorydata.length > 0){
            //     this.showResult=true;
            // } 
            // else{
            //     this.showResult=false;
            // }
        });
    }
    //#endregion



    //#region "dialogClose"
    dialogClose() {
        this.dialogRef.close();
    }
    //#endregion
}