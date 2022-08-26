import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { UtilService } from 'src/app/core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
import { eLabService } from '../../eLab.service';
import { elabOrderItemModel } from '../../models/elabOrderItemModel';
import { orderRequestModel } from '../../models/eLabOrderRequestModel';

@Component({
  selector: 'app-eLabOrderEditComponent',
  templateUrl: './eLab-order-edit.component.html',
  styleUrls: ['./eLab-order-edit.component.css']
})

export class eLabOrderEditComponent implements OnInit {

  //#region Property Declaration
  eLabOrderForm: FormGroup;
  orderRequestModel: orderRequestModel = new orderRequestModel();
  elabOrderItemModel: elabOrderItemModel = new elabOrderItemModel();
  patientId: number = 0;
  PhysicianNumber: any;
  VisitID: any;
  orderRequestCollection: any = [];
  urgencyValue: any;
  OrderNumber: any = "";
  TestNameData: any;
  visitDateandtimeView: any = "";
  PhysicianNameView: any = "";
  AdmissionDateandtimeView: any = "";
  IsVisitDate: boolean;
  //#endregion Property Declaration

  //#region constructor
  constructor(public fb: FormBuilder, private dialogRef: MatDialogRef<eLabOrderEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customHttpSvc: CustomHttpService, public eLabService: eLabService, private util: UtilService) { }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.eLabOrderForm = this.fb.group({
      UserName: [localStorage.getItem('LoggedinUser'), Validators.required],
      Password: ["", Validators.required],
      eLab: this.fb.array([this.eLabOrder()]),
    });

    //this.onAddRowLabOrder();  
    this.ViewSetValues();
    this.getUrgencyValue();
    this.OrderNumber = this.data.LabOrderNo;
    // this.getOrderNumber();

  }
  //#endregion ngOnInit

  //#region eLabOrder dynamic controls
  eLabOrder(): FormGroup {
    return this.fb.group({
      TestName: ['', Validators.required],
      Urgency: ['', Validators.required],
      Date: ['', Validators.required],
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
    if (this.data.visitDateandTime != null) {
      this.visitDateandtimeView = (this.data.visitDateandTime);
      this.IsVisitDate = true;
    } else {
      this.AdmissionDateandtimeView = (this.data.AdmissionDateandTime);
      this.IsVisitDate = false;
    }

    this.PhysicianNameView = (this.data.physicianName);
    //this.PhysicianNumber=this.data.

    for (let i = 0; i < this.data.labOrderItems.length; i++) {
      this.eLabOrderDynamic.push(this.eLabOrder());
      const form = <FormArray>(this.eLabOrderForm.controls['eLab']);
      form.controls[i].get('SetupMasterID').setValue(this.data.labOrderItems[i].SetupMasterID);
      form.controls[i].get('TestName').setValue(this.data.labOrderItems[i].setupMasterDesc);
      form.controls[i].get('Urgency').setValue(this.data.labOrderItems[i].UrgencyCode);
      form.controls[i].get('Date').setValue(this.data.labOrderItems[i].LabOnDate);
      form.controls[i].get('Notes').setValue(this.data.labOrderItems[i].LabNotes);

      this.eLabOrderDynamic.removeAt(this.data.labOrderItems.length);
    }

  }
  //#endregion View Set Values


  //#region get TestName AutoComplete
  getTestName(i) {
    const setvalue = <FormArray>this.eLabOrderForm.controls['eLab'];
    this.TestNameData = [];
    //setvalue.controls[i].get('SetupMasterID').setValue(0);
    //setvalue.controls[i].get('TestName').valueChanges.subscribe((key: string) => {
    let key = setvalue.controls[i].get('TestName').value
    if (key != null && key != "" && key != undefined) {
      if (key.length > 2) {
        this.eLabService.getTestName(key).then(data => {
          if (data.length > 0) {
            this.TestNameData = data;
          } else {
            this.TestNameData = [];
            setvalue.controls[i].get('SetupMasterID').setValue(0);
          }
        })
      } else {
        this.TestNameData = [];
        setvalue.controls[i].get('SetupMasterID').setValue(0);
      }
    }
    else {
      this.TestNameData = [];
      setvalue.controls[i].get('SetupMasterID').setValue(0);
    }
    // });
  }
  //#endregion get TestName AutoComplete

  //#region get UrgencyValue DropDown
  getUrgencyValue() {
    this.eLabService.getUrgencyValue().then((res) => {
      this.urgencyValue = res;

    })
  }
  //#endregion get UrgencyValue DropDown

  //#region Save Function
  OnFormSubmission() {
    if (this.eLabOrderForm.valid && this.patientId && this.eLabOrderForm.controls['eLab'].valid) {

      const form = <FormArray>(this.eLabOrderForm.controls['eLab']);

      for (let i = 0; i < form.length; i++) {
        this.elabOrderItemModel = new elabOrderItemModel();
        if (this.data.labOrderItems[i]) {
          this.elabOrderItemModel.LabOrderID = this.data.labOrderItems[i].LabOrderID;
          this.elabOrderItemModel.LabOrderItemsID = this.data.labOrderItems[i].LabOrderItemsID;
        } else {
          this.elabOrderItemModel.LabOrderID = 0;
          this.elabOrderItemModel.LabOrderItemsID = 0;
        }

        this.elabOrderItemModel.SetupMasterID = form.controls[i].get('SetupMasterID').value
        this.elabOrderItemModel.UrgencyCode = form.controls[i].get('Urgency').value;
        this.elabOrderItemModel.LabOnDate = form.controls[i].get('Date').value;
        this.elabOrderItemModel.LabNotes = form.controls[i].get('Notes').value;

        this.orderRequestCollection.push(this.elabOrderItemModel);
      }

      this.orderRequestModel = new orderRequestModel();
      this.orderRequestModel.LabOrderID = this.data.LabOrderID;
      this.orderRequestModel.LabOrderNo = this.OrderNumber;
      this.orderRequestModel.VisitID = this.data.VisitID;
      this.orderRequestModel.AdmissionID = this.data.AdmissionID;
      this.orderRequestModel.LabPhysician = this.data.LabPhysician;
      this.orderRequestModel.RequestedFrom = "Lab Order";
      this.orderRequestModel.UserName = this.eLabOrderForm.get('UserName').value;
      this.orderRequestModel.Password = this.eLabOrderForm.get('Password').value;
      this.orderRequestModel.labOrderItems = this.orderRequestCollection;

      if (this.orderRequestCollection.length > 0) {
        this.eLabService.SaveOrderRequest(this.orderRequestModel).then((res) => {
          if (res.ValidationStatus == "Valid User") {
            //  this.eLabService.confirmRequestForOrder(this.data.LabRequestID).then((res) => {
            this.util.showMessage('Success', 'Order Saved Successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
              if (res) {
                this.orderRequestCollection = [];
                this.dialogRef.close("Updated");
              }
            }
            );
            //  })
          } else {
            this.util.showMessage('Error!!', res.ValidationStatus, BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox).then((res) => { });
          }
        });
      }
    }
  }
  //#endregion Save Function

  //#region Add  table row
  onAddRowLabOrder() {
    this.eLabOrderDynamic.push(this.eLabOrder());
    this.TestNameData = null;
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
    this.ViewSetValues();
  }
  //#endregion clear the form

  //#region Close the form
  dialogClose() {
    this.dialogRef.close();
  }
  //#endregion Close the form
  setSetupMasterID(index: number, id: number) {
    const items = <FormArray>this.eLabOrderForm.controls['eLab'];
    items.controls[index].get('SetupMasterID').setValue(id);
  }

  toValidateTestName(index: number) {

    const items = <FormArray>this.eLabOrderForm.controls['eLab'];
    if (!(items.controls[index].get('SetupMasterID').value > 0)) {
      items.controls[index].get('TestName').setValue('');
    }
  }
}
