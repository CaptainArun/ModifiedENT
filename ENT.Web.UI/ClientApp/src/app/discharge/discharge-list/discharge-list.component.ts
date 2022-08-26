import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { DischargeService } from '../discharge.service';
import { DischargeSearchModel } from '../models/dischargeSearchModel';
import { FlexCardConfig } from 'src/app/ux/bmstable/flexDesign/Card_Config';

@Component({
  selector: 'discharge-list',
  templateUrl: './discharge-list.component.html',
  styleUrls: ['./discharge-list.component.css']
})
export class DischargeListComponent implements OnInit, AfterViewInit {
  dischargeForm: FormGroup;
  searchModel: DischargeSearchModel = new DischargeSearchModel();
  tableConfig: TableConfig = new TableConfig();
  completedCount: any;
  pendingCount: any;
  dischargeTableData: any;
  providerListId: any;
  providerTooltip: any;
  patientListId: any;
  patientTooltip: string;
  patientName: any;
  providerName: any;
  searchList: any;
  AdmissionNumber: any;
  facilityData: any;
  show: boolean = true;
  IsDateCorect: boolean = false;
  DischargeListCard: FlexCardConfig = new FlexCardConfig();

  @ViewChild('autoCompleteAdmissionInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompletePatientInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteDoctorInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

  constructor(private router: Router, public fb: FormBuilder, public dialog: MatDialog, private dischargeSvc: DischargeService, public customHttp: CustomHttpService) {
    // this.tableConfig.showPagination = true;
    // this.tableConfig.showEdit = true;

    // this.tableConfig.columnConfig = [
    //   { PropertyName: 'AdmissionNumber', DisplayName: 'Admission Number', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'facilityName', DisplayName: 'Facility Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'DischargeStatus', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'patientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AdmittingPhysician', DisplayName: 'Admitting Physician', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'RecommendedProcedure', DisplayName: 'Procedure (short)', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'Urgency', DisplayName: 'Urgency', DisplayMode: 'Text', LinkUrl: '' },
    //   { PropertyName: 'AdmissionDate', DisplayName: 'Admission Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' },
    //   { PropertyName: 'Createddate', DisplayName: 'Created Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' }
    // ];

    
    this.DischargeListCard.FlexDataConfig = [
      //Header
      { PropertyName: 'PatientImage', DisplayType: "Image", SectionType: "Header" },
      { PropertyName: 'patientName', DisplayName: 'Patient Name', SectionType: "Header",},
      { PropertyName: 'PatientContactNumber', DisplayName: 'Contact No', SectionType: "Header"},
      { PropertyName: 'MRNumber', DisplayName: 'MR Number', SectionType: "Header" },
    
      //Content
      { PropertyName: 'AdmissionNumber', DisplayName: 'Admission No', SectionType: "Content" },
      { PropertyName: 'Urgency', DisplayName: 'urgency Type', SectionType: "Content" },
      { PropertyName: 'DischargeStatus', DisplayName: 'Discharge-Status',ApplyStatusFontcolor:"ApplyFont", SectionType: "Content" },
      { PropertyName: 'facilityName', DisplayName: 'Facility', SectionType: "Content" },
      { PropertyName: 'AdmittingPhysician', DisplayName: 'Physician', SectionType: "Content" },

    ];
    //Icons
    this.DischargeListCard.showEdit = true;
  }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.dischargeForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      AdmissionNumber: [''],
      Facility: [0],
      ProviderName: [''],
      PatientName: ['']
    });
    this.dischargeCount();
    this.CheckValidDate();
    this.getAdmissionNumberbySearch();
    this.getFacilityNames();
    this.getProviderName();
    this.getPatientList();
    this.dischargeSearch();
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.dischargeForm.get('AdmissionNumber').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
            this.dischargeForm.get('PatientName').setValue('');
          }
      });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.dischargeForm.get('ProviderName').setValue('');
        }
      });
  }

  getDiagnosisRecord() {
    this.dischargeSvc.getDischargeRecords().then(res => {
      this.dischargeTableData = res;
    });
  }

  dischargeCount() {
    this.dischargeSvc.getDischargeCount().then(res => {
      this.completedCount = res.TodayCompletedDischargeCount;
      this.pendingCount = res.TodayPendingDischargeCount;
    });
  }

  CheckValidDate() {
    this.dischargeForm.get('FromDate').valueChanges.subscribe((Date: any) => {
      if (this.dischargeForm.get('FromDate').value > this.dischargeForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.dischargeForm.get('ToDate').valueChanges.subscribe((Date: any) => {
      if (this.dischargeForm.get('FromDate').value > this.dischargeForm.get('ToDate').value) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }

  getAdmissionNumberbySearch() {
    if (this.dischargeForm.get('AdmissionNumber').value != null) {
      this.dischargeForm.get('AdmissionNumber').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.dischargeSvc.getAdmissionNumberForSearch(key).then(data => {
                this.AdmissionNumber = data;
              });
            }
            else {
              this.AdmissionNumber = null;
            }
          }
          else {
            this.AdmissionNumber = null;
          }
        });
    }
  }

  getFacilityNames() {
    this.dischargeSvc.getFacilityNames().then(res => {
      this.facilityData = res;
    });
  }

  getProviderName() {
    this.dischargeForm.get('ProviderName').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.dischargeSvc.getProviderforDischarge(key).then(data => {
              this.providerName = data;
            });
          }
          else {
            this.providerName = null;
            this.providerTooltip = null;
          }
        }
        else {
          this.providerTooltip = null;
        }
      });
  }

  setProviderName(ProviderId, value) {
    this.providerListId = ProviderId;
    this.providerTooltip = value;
  }

  getPatientList() {
    this.dischargeForm.get('PatientName').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.dischargeSvc.getPatientforDischarge(key).then(data => {
              this.patientName = data;
            });
          }
          else {
            this.patientName = null;
            this.patientTooltip = null;
          }
        }
        else {
          this.patientTooltip = null;
        }
      });
  }

  setPatientName(PatientId, value1, value2, value3) {
    this.patientListId = PatientId;
    this.patientTooltip = value1 + ' ' + value2 + ' ' + value3;
  }

  viewEditDischargeData(element) {
    this.setSessionStorage();
    this.router.navigate(['home/discharge/dischargeprocedure', element.Item.admissionId, element.Item.patientId]);
  }

  setSessionStorage() {
    let setSessionValue = {
      dischargeSearchModelValue: this.searchModel,
      ProviderName: this.dischargeForm.get('ProviderName').value,
      PatientName: this.dischargeForm.get('PatientName').value,
    }
    sessionStorage.setItem('dischargeSearchModel', JSON.stringify(setSessionValue));
  }

  dischargeSearch() {
    if (sessionStorage.getItem('dischargeSearchModel')) {
      let dischargeSearchModelData = JSON.parse(sessionStorage.getItem('dischargeSearchModel'));
      this.searchModel = dischargeSearchModelData.dischargeSearchModelValue;
      this.dischargeForm.get('FromDate').setValue(this.searchModel.FromDate);
      this.dischargeForm.get('ToDate').setValue(this.searchModel.ToDate);
      this.dischargeForm.get('AdmissionNumber').setValue(this.searchModel.AdmissionNo);
      this.dischargeForm.get('Facility').setValue(this.searchModel.FacilityId);
      this.dischargeForm.get('ProviderName').setValue(dischargeSearchModelData.ProviderName);
      this.dischargeForm.get('PatientName').setValue(dischargeSearchModelData.PatientName);
      this.providerListId = dischargeSearchModelData.dischargeSearchModelValue.ProviderId;
      this.patientListId = dischargeSearchModelData.dischargeSearchModelValue.PatientId;
      this.searchModel.ProviderId = this.providerListId;
      this.searchModel.PatientId = this.patientListId;
      this.dischargeSvc.dischargeSearch(this.searchModel).then(res => {
        this.searchList = res;
        if (this.searchList.length == 0) {
          this.show = true;
        }
        else {
          this.dischargeTableData = this.searchList;
          this.show = false;
        }
      });
      sessionStorage.removeItem('dischargeSearchModel');
    }
    else {
      this.searchModel.FromDate = this.dischargeForm.get('FromDate').value;
      this.searchModel.ToDate = this.dischargeForm.get('ToDate').value;
      this.searchModel.AdmissionNo = this.dischargeForm.get('AdmissionNumber').value;
      this.searchModel.FacilityId = this.dischargeForm.get('Facility').value;
      this.searchModel.ProviderId = this.dischargeForm.get('ProviderName').value ? this.providerListId : 0;
      this.searchModel.PatientId = this.dischargeForm.get('PatientName').value ? this.patientListId : 0;
      this.dischargeSvc.dischargeSearch(this.searchModel).then(res => {
        this.searchList = res;
        if (this.searchList.length == 0) {
          this.show = true;
        }
        else {
          this.dischargeTableData = this.searchList;
          this.show = false;
        }
      });
    }
  }

  resetForm() {
    this.dischargeForm.reset();
    this.dischargeForm.get('FromDate').setValue(new Date());
    this.dischargeForm.get('ToDate').setValue(new Date());
    this.dischargeForm.get('Facility').setValue(0);
    this.searchModel.AdmissionNo = "";
    this.searchModel.FromDate = this.dischargeForm.get('FromDate').value;
    this.searchModel.ToDate = this.dischargeForm.get('ToDate').value;
    this.searchModel.FacilityId = this.dischargeForm.get('Facility').value;
    this.searchModel.ProviderId = this.dischargeForm.get('ProviderName').value ? this.providerListId : 0;
    this.searchModel.PatientId = this.dischargeForm.get('PatientName').value ? this.patientListId : 0;
    this.dischargeSvc.dischargeSearch(this.searchModel).then(res => {
      this.searchList = res;
      if (this.searchList.length == 0) {
        this.show = true;
      }
      else {
        this.dischargeTableData = this.searchList;
        this.show = false;
      }
    });
  }

}




