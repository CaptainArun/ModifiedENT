import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../core/custom-http.service";
import { TableConfig } from "../../ux/columnConfig";
import { AudiologyImagesPopupComponent } from "../audiology-images-popup/audiology-images-popup.component";
import { AudiologyService } from "../audiology.service";
import { AudiologySearchModel } from "../model/audiologySearchModel";
import { FlexCardConfig } from "src/app/ux/bmstable/flexDesign/Card_Config";

@Component({
    selector: 'audiology-consultlist',
    templateUrl: './audiology-consultlist.component.html',
    styleUrls: ['./audiology-consultlist.component.css']
})
export class AudiologyConsultlistComponent implements OnInit {
    audiologySearchForm: FormGroup;
    tableConfig: TableConfig = new TableConfig();
    audiologySearchModel: AudiologySearchModel = new AudiologySearchModel();
    show: boolean = true;
    IsDateCorect: boolean = false;
    caseSheetData: any;
    audiologyTableData: any;
    audiologyTestCount: any;
    totalTests: any;
    completedTests: any;
    pendingTests: any;
    searchList: any;
    providerName: any;
    patientName: any;
    patientId: number;
    providerId: number;
    providerTooltip: any;
    patientTooltip: any;
    VisitNumber: any;
    facilityData: any;
    AudiologyListCard: FlexCardConfig = new FlexCardConfig();


    @ViewChild('autoCompleteVisitInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
    @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
    @ViewChild('autoCompleteDoctorInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

    constructor(public dialog: MatDialog, private fb: FormBuilder, private audiologySvc: AudiologyService, private customHttpSvc: CustomHttpService) {
        // this.tableConfig.showPagination = true;
        // this.tableConfig.showOpeningItem = true;

        // this.tableConfig.columnConfig = [
        //     { PropertyName: 'VisitNo', DisplayName: 'Visit Number', DisplayMode: 'Text', LinkUrl: '' },
        //     { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
        //     { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
        //     { PropertyName: 'VisitDateandTime', DisplayName: 'Visit Date & Time', DisplayMode: 'Text', LinkUrl: '' },
        //     { PropertyName: 'ProviderName', DisplayName: 'To Consult', DisplayMode: 'Text', LinkUrl: '' }
        // ];

        
        this.AudiologyListCard.FlexDataConfig = [

            //Header
            { PropertyName: 'PatientImage', SectionType: "Header", DisplayType: "Image" },
            { PropertyName: 'PatientName', DisplayName: 'Patient Name', SectionType: "Header" },
            { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
            { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },
            
            //Content
            { PropertyName: 'VisitNo', DisplayName: 'Visit No', SectionType: "Content" },
            { PropertyName: 'VisitDateandTime', DisplayName: 'Date Time', SectionType: "Content" },
            { PropertyName: 'AudiologyTestCount', DisplayName: 'Aud-TestCount', SectionType: "Content" },
            { PropertyName: 'facilityName', DisplayName: 'Facility', SectionType: "Content" },
            { PropertyName: 'ProviderName', DisplayName: 'Physician', SectionType: "Content" },

          ];

          //Icons
          this.AudiologyListCard.showOpeningItem = true;
    }

    ngOnInit() {
        this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
        this.audiologySearchForm = this.fb.group({
            FromDate: [new Date()],
            ToDate: [new Date()],
            VisitNumber: [''],
            Facility: [0],
            ProviderName: [''],
            PatientName: ['']
        });
        this.totalTest();
        this.CheckValidDate();
        this.getVisitNumberbySearch();
        this.getFacilityNames();
        this.getProviderName();
        this.getPatientList();
        this.audiologySearch();
    }

    ngAfterViewInit() {
        this.trigger.panelClosingActions
            .subscribe(e => {
                if (!(e && e.source)) {
                    this.audiologySearchForm.get('VisitNumber').setValue('');
                }
            });

        this.trigger1.panelClosingActions
            .subscribe(e => {
                if (!(e && e.source)) {
                    this.audiologySearchForm.get('PatientName').setValue('');
                }
            });

        this.trigger2.panelClosingActions
            .subscribe(e => {
                if (!(e && e.source)) {
                    this.audiologySearchForm.get('ProviderName').setValue('');
                }
            });
    }

    getTableData() {
        this.audiologySvc.getTableDataForAudiology().then(data => {
            this.audiologyTableData = data;
        });
    }

    viewTests(i) {
        let setSessionValue = {
            audiologySearchModelValue: this.audiologySearchModel,
            ProviderName: this.audiologySearchForm.get("ProviderName").value,
            PatientName: this.audiologySearchForm.get("PatientName").value,
        }
        i.Item.sessionData = setSessionValue; // Inserting an obj to session
        const dialogRef = this.dialog.open(AudiologyImagesPopupComponent, {
            data: i.Item,
            height: 'auto',
            width: '700px',
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(result => {

        });
    }

    totalTest() {
        this.audiologySvc.totalTestCount().then(data => {
            this.audiologyTestCount = data;
            this.totalTests = this.audiologyTestCount.AudiologyTotalTestCount;
            this.completedTests = this.audiologyTestCount.AudiologyCompletedCount;
            this.pendingTests = this.audiologyTestCount.AudiologyWaitingCount;
        });
    }

    CheckValidDate() {
        this.audiologySearchForm.get('FromDate').valueChanges.subscribe((Date: any) => {
            if (this.audiologySearchForm.get('FromDate').value > this.audiologySearchForm.get('ToDate').value) {
                this.IsDateCorect = true;
            } else {
                this.IsDateCorect = false;
            }
        });

        this.audiologySearchForm.get('ToDate').valueChanges.subscribe((Date: any) => {
            if (this.audiologySearchForm.get('FromDate').value > this.audiologySearchForm.get('ToDate').value) {
                this.IsDateCorect = true;
            } else {
                this.IsDateCorect = false;
            }
        });
    }

    getVisitNumberbySearch() {
        if (this.audiologySearchForm.get('VisitNumber').value != null) {
            this.audiologySearchForm.get('VisitNumber').valueChanges.subscribe(
                (key: string) => {
                    if (key != null) {
                        if (key.length > 2) {
                            this.audiologySvc.getVisitNumberForSearch(key).then(data => {
                                this.VisitNumber = data;
                            });
                        }
                        else {
                            this.VisitNumber = null;
                        }
                    }
                    else {
                        this.VisitNumber = null;
                    }
                });
        }
    }

    getFacilityNames() {
        this.audiologySvc.getFacilityNames().then(res => {
            this.facilityData = res;
        });
    }

    getProviderName() {
        this.audiologySearchForm.get('ProviderName').valueChanges.subscribe(
            (key: string) => {
                if (key != null) {
                    if (key.length > 2) {
                        this.audiologySvc.getDoctorsForSearch(key).then(data => {
                            this.providerName = data;
                        });
                    }
                    else {
                        this.providerName = null;
                        this.providerTooltip = null;
                    }
                }
                else {
                    this.providerName = null;
                    this.providerTooltip = null;
                }
            });
    }

    setProviderName(ProviderId, value) {
        this.providerId = ProviderId;
        this.providerTooltip = value;
    }

    getPatientList() {
        this.audiologySearchForm.get('PatientName').valueChanges.subscribe(
            (key: string) => {
                if (key != null) {
                    if (key.length > 2) {
                        this.audiologySvc.getAllPatientData(key).then(data => {
                            this.patientName = data;
                        });
                    }
                    else {
                        this.patientName = null;
                        this.patientTooltip = null;
                    }
                }
                else {
                    this.patientName = null;
                    this.patientTooltip = null;
                }
            });
    }

    setPatientName(PatientId, value1, value2, value3) {
        this.patientId = PatientId;
        this.patientTooltip = value1 + ' ' + value2 + ' ' + value3;
    }

    audiologySearch() {
        if (sessionStorage.getItem('audiologySearchModel')) {
            let audiologySearchModelData = JSON.parse(sessionStorage.getItem('audiologySearchModel'));
            this.audiologySearchModel = audiologySearchModelData.audiologySearchModelValue;
            this.audiologySearchForm.get('FromDate').setValue(this.audiologySearchModel.FromDate);
            this.audiologySearchForm.get('ToDate').setValue(this.audiologySearchModel.ToDate);
            this.audiologySearchForm.get('VisitNumber').setValue(this.audiologySearchModel.VisitNo);
            this.audiologySearchForm.get('Facility').setValue(this.audiologySearchModel.FacilityId);
            this.audiologySearchForm.get('ProviderName').setValue(audiologySearchModelData.ProviderName);
            this.audiologySearchForm.get('PatientName').setValue(audiologySearchModelData.PatientName);
            this.providerId = audiologySearchModelData.audiologySearchModelValue.ProviderId;
            this.patientId = audiologySearchModelData.audiologySearchModelValue.PatientId;
            this.audiologySearchModel.ProviderId = this.providerId;
            this.audiologySearchModel.PatientId = this.patientId;
            this.audiologySvc.audiologySearch(this.audiologySearchModel).then(res => {
                this.searchList = res;
                if (this.searchList.length == 0) {
                    this.show = true;
                }
                else {
                    this.audiologyTableData = this.searchList;
                    this.show = false;
                }
            });
            sessionStorage.removeItem('audiologySearchModel');
        }
        else {
            this.audiologySearchModel.FromDate = this.audiologySearchForm.get('FromDate').value;
            this.audiologySearchModel.ToDate = this.audiologySearchForm.get('ToDate').value;
            this.audiologySearchModel.VisitNo = this.audiologySearchForm.get('VisitNumber').value;
            this.audiologySearchModel.FacilityId = this.audiologySearchForm.get('Facility').value;
            this.audiologySearchModel.ProviderId = this.audiologySearchForm.get('ProviderName').value ? this.providerId : 0;
            this.audiologySearchModel.PatientId = this.audiologySearchForm.get('PatientName').value ? this.patientId : 0;
            this.audiologySearchModel.SpecialityId = 0;
            this.audiologySvc.audiologySearch(this.audiologySearchModel).then(res => {
                this.searchList = res;
                if (this.searchList.length == 0) {
                    this.show = true;
                }
                else {
                    this.audiologyTableData = this.searchList;
                    this.show = false;
                }
            });
        }
    }

    reset() {
        this.audiologySearchForm.reset();
        this.audiologySearchForm.get('FromDate').setValue(new Date());
        this.audiologySearchForm.get('ToDate').setValue(new Date());
        this.audiologySearchForm.get('Facility').setValue(0);
        this.audiologySearchModel.VisitNo = "";
        this.audiologySearchModel.FromDate = this.audiologySearchForm.get('FromDate').value;
        this.audiologySearchModel.ToDate = this.audiologySearchForm.get('ToDate').value;
        this.audiologySearchModel.FacilityId = this.audiologySearchForm.get('Facility').value;
        this.audiologySearchModel.ProviderId = this.audiologySearchForm.get('ProviderName').value ? this.providerId : 0;
        this.audiologySearchModel.PatientId = this.audiologySearchForm.get('PatientName').value ? this.patientId : 0;
        this.audiologySvc.audiologySearch(this.audiologySearchModel).then(res => {
            this.searchList = res;
            if (this.searchList.length == 0) {
                this.show = true;
            }
            else {
                this.audiologyTableData = this.searchList;
                this.show = false;
            }
        });
    }

}