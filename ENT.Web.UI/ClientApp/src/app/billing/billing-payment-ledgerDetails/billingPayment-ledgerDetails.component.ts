import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { TableConfig } from '../../ux/columnConfig';
import { billingService } from '../billing.service';
import { BillingPaymentRefundSearchModel } from '../models/BillingPaymentRefundSearchModel';

@Component({
  selector: 'app-billingledgerDetails',
  templateUrl: './billingPayment-ledgerDetails.component.html',
  styleUrls: ['./billingPayment-ledgerDetails.component.css']
})

export class BillingledgerDetailsComponent implements OnInit {
//#region Property Declaration

  searchForm: FormGroup;
  patient: any;
  patientId: any;
  show: boolean = false;
  patientLedger: any;
  searchlist: any;
  tableConfig: TableConfig = new TableConfig;
  searchModel: BillingPaymentRefundSearchModel=new  BillingPaymentRefundSearchModel();
  IsDateCorect: boolean = false;
  
  //#endregion Property Declaration

  //#region constructor
  constructor(private customHttpSvc: CustomHttpService,public fb:FormBuilder, private billingService: billingService,) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = false;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;
    this.tableConfig.columnConfig = [
      { PropertyName: 'ReceiptDate', DisplayName: 'Receipt Date', FormatString: "dd-MM-yyyy", DisplayMode: 'DateTime', LinkUrl: ''},
      { PropertyName: 'ReceiptDate', DisplayName: 'Receipt Time', FormatString: "hh:mm:ss aa", DisplayMode: 'DateTime', LinkUrl: ''},
      { PropertyName: 'ReceiptNo', DisplayName: 'Receipt Number', DisplayMode: 'Text', LinkUrl: ''},
      { PropertyName: 'billingParticular', DisplayName: 'Particulars', DisplayMode: 'Text', LinkUrl: ''},
      { PropertyName: 'AmountPaid', DisplayName: 'Amount Paid(debit)', DisplayMode: 'Text', LinkUrl: ''},
      { PropertyName: 'DiscountAmount', DisplayName: 'Discount', DisplayMode: 'Text', LinkUrl: ''},
      { PropertyName: 'Notes', DisplayName: 'Notes', DisplayMode: 'Text', LinkUrl: ''},
      { PropertyName: 'Refund', DisplayName: 'Refund', DisplayMode: 'Text', LinkUrl: ''},
      { PropertyName: 'RefundNotes', DisplayName: 'Refund Notes', DisplayMode: 'Text', LinkUrl: ''},

    ]
  } 
      //#endregion 

   //#region ngOnInit
  ngOnInit() {
    this.searchForm = this.fb.group({

        FromDate: [new Date()],
        ToDate: [new Date()], 
         PatientName: [""],

    });
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.getpatient();
    this.SearchDetails();
    this.CheckValidDate();
  }
  //#endregion 

   //#region Search
  SearchDetails()
  {
    if (this.searchForm.get('PatientName').value) {
      this.searchModel.FromDate = this.searchForm.get('FromDate').value;
      this.searchModel.ToDate = this.searchForm.get('ToDate').value;
      this.searchModel.PatientId = this.patientId;

      this.billingService.searchAdmission(this.searchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
        }
        else {
          this.patientLedger = this.searchlist;
          this.show = false;
        }
      });
    } else {
      this.show = true;
    }
  }
   //#endregion

  //#region clear Details
  clearsearch() {
  
      this.searchForm.reset();
      this.searchForm.get('FromDate').setValue(new Date());
      this.searchForm.get('ToDate').setValue(new Date());
      this.searchModel.FromDate = this.searchForm.get('FromDate').value;
      this.searchModel.ToDate = this.searchForm.get('ToDate').value;
      this.searchModel.PatientId = 0;
      this.billingService.searchAdmission(this.searchModel).then(res => {
        this.searchlist = res;
        if (this.searchlist.length == 0) {
          this.show = true;
          this.patientId = null;
        }
        else {
          this.patientLedger = this.searchlist;
          this.show = true;
          this.patientId = null;
        }
      })
  }
 //#endregion

  // #region "Patient"
  getpatient() {
    if (this.searchForm.get('PatientName').value != null) {
      this.searchForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.billingService.getAllPatientData(key).then(data => {
                this.patient = data;
              })
            }
            else {
              this.patient = null;
              this.patientId = null;
              this.show = true;
            }
          }
        })
    }
  }
  //#endregion

  //#region Set Patient id
  setpatient(patientidvalue) 
  {
      this.patientId = patientidvalue;
  }
   //#endregion

  //#region  Check ValidDate
   CheckValidDate() {
    
    this.searchForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {      
      if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {       
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.searchForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {    
      if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {  
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
    //#endregion
  }
