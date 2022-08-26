import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { eLabService } from '../../eLab.service';
import { elabOrderItemModel } from '../../models/elabOrderItemModel';
import { orderRequestModel } from '../../models/eLabOrderRequestModel';

@Component({
  selector: 'app-eLabNewRequestComponent',
  templateUrl: './eLab-new-request-add-view.component.html',
  styleUrls: ['./eLab-new-request-add-view.component.css']
})

export class eLabNewRequestComponent implements OnInit {

  //#region Property Declaration

  eLabOrderForm: FormGroup;
  orderRequestModel: orderRequestModel = new orderRequestModel();
  elabOrderItemModel: elabOrderItemModel = new elabOrderItemModel();
  patientSearch: any;
  patientId: number = 0;
  visitDateandtime: any;
  PhysicianName: any;
  PhysicianNumber: any;
  VisitID: any;
  orderRequestCollection: any = [];
  urgencyValue: any;
  OrderNumber: any = "";
  TestName: any;
  IsAdd: boolean = true;
  visitDateandtimeView: any = "";
  PhysicianNameView: any = "";
  IsVisitDate: boolean;
  AdmissionDateandtimeView: any = "";
  itemNameList = [];
  @ViewChild('autoCompletePhysicianName', { static: false, read: MatAutocompleteTrigger }) triggerPhysicianName: MatAutocompleteTrigger;

  //#endregion Property Declaration

  //#region constructor

  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<eLabNewRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService, public eLabService: eLabService, private util: UtilService,) { }

  //#endregion constructor

  //#region ngOnInit

  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.eLabOrderForm = this.fb.group({
      SearchPatientName: ['', Validators.required],
      visitDateandtime: ["", Validators.required],
      PhysicianName: ["", Validators.required],
      UserName: [localStorage.getItem('LoggedinUser'), Validators.required],
      Password: ["", Validators.required],
      eLab: this.fb.array([this.eLabOrder()]),
    });


    if (this.data) {
      this.IsAdd = false;
      this.ViewSetValues();
    } else {
      this.GetPatientCard();
      this.GetProviderName();
      this.getUrgencyValue();
      this.getOrderNumber();
    }
  }
  ngAfterViewInit() {
  }
  //#endregion ngOnInit

  //#region eLabOrder dynamic controls

  eLabOrder(): FormGroup {
    return this.fb.group({
      TestName: [null, Validators.required],
      Urgency: ['', Validators.required],
      UrgencyView: [''],
      Date: ['', Validators.required],
      DateView: [''],
      Notes: ['', Validators.required],
      SetupMasterID: ['', Validators.required]
    })
  }

  get eLabOrderDynamic() {
    return <FormArray>this.eLabOrderForm.get('eLab');
  }

  //#endregion eLabOrder dynamic controls

  //#region View Set Values
  ViewSetValues() {

    this.patientId = this.data.patientId;
    this.OrderNumber = this.data.LabOrderNo;

    if (this.data.visitDateandTime != null) {

      this.visitDateandtimeView = (this.data.visitDateandTime);
      this.IsVisitDate = true;
    } else {

      this.AdmissionDateandtimeView = (this.data.AdmissionDateandTime);
      this.IsVisitDate = false;
    }

    this.PhysicianNameView = (this.data.physicianName);

    for (let i = 0; i < this.data.labOrderItems.length; i++) {
      this.eLabOrderDynamic.push(this.eLabOrder());
      const form = <FormArray>(this.eLabOrderForm.controls['eLab']);
      form.controls[i].get('TestName').setValue(this.data.labOrderItems[i].setupMasterDesc);
      form.controls[i].get('UrgencyView').setValue(this.data.labOrderItems[i].urgencyDescription);
      form.controls[i].get('DateView').setValue(new Date(this.data.labOrderItems[i].LabOnDate).toLocaleDateString());
      form.controls[i].get('Notes').setValue(this.data.labOrderItems[i].LabNotes);

      this.eLabOrderDynamic.removeAt(this.data.labOrderItems.length);
    }

  }
  //#endregion View Set Values

  //#region get order number

  getOrderNumber() {
    this.eLabService.getOrderNumber().then((res) => {
      this.OrderNumber = res[0];
    })
  }

  //#endregion get order number

  //#region get patient card

  GetPatientCard() {
    this.eLabOrderForm.get('SearchPatientName').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.eLabService.GetPatientCard(key).then((res) => {
            this.patientSearch = res;
          })
        } else {
          this.patientSearch = null;
          this.patientId = 0;
          this.eLabOrderForm.get('visitDateandtime').reset();
          this.VisitID = 0;
        }
      } else {
        this.patientSearch = null;
        this.patientId = 0;
        this.eLabOrderForm.get('visitDateandtime').reset();
        this.VisitID = 0;
      }
    })
  }

  //#endregion get patient card

  //#region get patient ID

  getPatientId(patientId) {
    if (patientId > 0) {
      this.patientId = patientId;
      this.getVisitDateAndtime();
    } else {
      this.patientId = 0;
    }
  }

  //#endregion get patient ID

  //#region get TestName AutoComplete

  getTestName(i) {

    const setvalue = <FormArray>this.eLabOrderForm.controls['eLab'];

    //this.TestName = [];
    //setvalue.controls[i].get('SetupMasterID').setValue(0);

    // setvalue.controls[i].get('TestName').valueChanges.subscribe((key: string) => {
    let key = setvalue.controls[i].get('TestName').value;
    if (key != null && key != undefined && key != "") {
      if (key.length > 2) {
        this.eLabService.getTestName(key).then((data) => {
          if (data.length > 0) {
            this.TestName = data;
          } else {
            this.TestName = [];
            setvalue.controls[i].get('SetupMasterID').setValue(0);
          }
        })
      }
      else {
        this.TestName = [];
        setvalue.controls[i].get('SetupMasterID').setValue(0);
      }
    }
    else {
      this.TestName = [];
      setvalue.controls[i].get('SetupMasterID').setValue(0);
    }
    //});
  }

  //#endregion get TestName AutoComplete

  //#region get Visit Date And Time By using Patient Id

  getVisitDateAndtime() {
    this.eLabService.getPatientVisitDateTime(this.patientId).then((res) => {
      this.visitDateandtime = res;
    })
  }

  //#endregion get Visit Date And Time By using Patient Id 

  //#region get ProviderName AutoComplete

  GetProviderName() {

    this.eLabOrderForm.get('PhysicianName').valueChanges.subscribe((key: any) => {
      if (key != null) {
        this.triggerPhysicianName.panelClosingActions.subscribe(e => {
          if (!(e && e.source)) {
            this.eLabOrderForm.get('PhysicianName').setValue('');
          }
        });
        if (key.length > 2) {
          this.eLabService.GetProviderName(key).then((res) => {
            this.PhysicianName = res;
          })
        } else {
          this.PhysicianName = null;
        }
      }
    })
  }

  //#endregion get ProviderName AutoComplete

  //#region get UrgencyValue DropDown

  getUrgencyValue() {
    this.eLabService.getUrgencyValue().then((res) => {
      this.urgencyValue = res;

    })
  }

  //#endregion get UrgencyValue DropDown

  //#region set PhysicianName as Number

  setPhysicianNameNumber(number) {
    if (number > 0) {
      this.PhysicianNumber = number;
    } else {
      this.PhysicianNumber = 0;
    }
  }

  //#endregion set PhysicianName as Number

  //#region set VisitId using visit date and time

  setVisitId(number) {
    if (number > 0) {
      this.VisitID = number;
    } else {
      this.VisitID = 0;
    }
  }

  //#endregion set VisitId using visit date and time

  //#region Save Function

  OnFormSubmission() {
    if (this.eLabOrderForm.valid && this.patientId && this.eLabOrderForm.controls['eLab'].valid) {

      const form = <FormArray>(this.eLabOrderForm.controls['eLab']);

      for (let i = 0; i < form.length; i++) {
        this.elabOrderItemModel = new elabOrderItemModel();
        this.elabOrderItemModel.LabOrderID = 0;
        this.elabOrderItemModel.LabOrderItemsID = 0;
        this.elabOrderItemModel.SetupMasterID = form.controls[i].get('SetupMasterID').value
        this.elabOrderItemModel.UrgencyCode = form.controls[i].get('Urgency').value;
        this.elabOrderItemModel.LabOnDate = form.controls[i].get('Date').value;
        this.elabOrderItemModel.LabNotes = form.controls[i].get('Notes').value;

        this.orderRequestCollection.push(this.elabOrderItemModel);
      }

      this.orderRequestModel = new orderRequestModel();
      this.orderRequestModel.LabOrderID = 0;
      this.orderRequestModel.LabOrderNo = this.OrderNumber;
      this.orderRequestModel.VisitID = this.VisitID;
      this.orderRequestModel.AdmissionID = 0;
      this.orderRequestModel.LabPhysician = this.PhysicianNumber;
      this.orderRequestModel.RequestedFrom = "Lab Order";
      this.orderRequestModel.UserName = this.eLabOrderForm.get('UserName').value;
      this.orderRequestModel.Password = this.eLabOrderForm.get('Password').value;
      this.orderRequestModel.labOrderItems = this.orderRequestCollection;

      if (this.orderRequestCollection.length > 0) {
        this.eLabService.SaveOrderRequest(this.orderRequestModel).then((res) => {
          if (res.ValidationStatus == "Valid User") {
            this.util.showMessage('', 'New Order Details saved successfully',
              BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
                (res) => {
                  if (res) {
                    this.orderRequestCollection = [];
                    this.dialogRef.close("Updated");
                  }
                }
              );
          } else {
            this.util.showMessage('Error!!', res.ValidationStatus, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
          }
        })
      }
    }
  }

  //#endregion Save Function

  //#region Add  table row

  onAddRowLabOrder() {
    this.eLabOrderDynamic.push(this.eLabOrder());
    this.TestName = null;
  }

  //#endregion Add  table row

  //#region Remove table row

  onRemoveRowLabOrder(rowIndex: number) {
    this.eLabOrderDynamic.removeAt(rowIndex);
  }

  //#endregion Remove table row

  //#region clear the form

  resetForm() {
    this.eLabOrderForm.reset();
    this.eLabOrderDynamic.clear();
    this.onAddRowLabOrder();
    this.patientId = 0;
    this.visitDateandtime = null;
  }

  //#endregion clear the form

  //#region Close the form

  dialogClose() {
    this.dialogRef.close();
  }

  //#endregion Close the form
  //#region set value of setup master Id

  SetupMasterID(index, number) {

    const setvalue = <FormArray>this.eLabOrderForm.controls['eLab'];
    setvalue.controls[index].get('SetupMasterID').setValue(number);
  }

  //#endregion set value of setup master Id

  toCheckTestNameValidation(index) {

    const items = <FormArray>this.eLabOrderForm.controls['eLab'];
    if (!(items.controls[index].get('SetupMasterID').value > 0)) {
      items.controls[index].get('TestName').setValue('');
    }
  }

}
