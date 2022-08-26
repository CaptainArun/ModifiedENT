import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteTrigger, MatDialogRef } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { labSetupModel } from "../../Models/eLabSetupModel";
import { eLabService } from "../../eLab.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: 'app-add-elab-setup',
  templateUrl: './add-elab-setup.component.html',
  styleUrls: ['./add-elab-setup.component.css']
})

export class AddElabSetupComponent implements OnInit {

  //#region Property Declaration
  ElabBillingSetupForm: FormGroup;
  DepartmentInfo: any;
  TestNameInfo: any;
  ElabSetupModel: labSetupModel = new labSetupModel();
  StatusValue: any;
  setDepartmentNumber: any;
  setTestNameNumber: number;
  TestNameSubInfo: any;
  setTestNameSubNumber: number;

  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger }) triggerDepartment: MatAutocompleteTrigger;
  @ViewChild('autoCompleteTestName', { static: false, read: MatAutocompleteTrigger }) triggerTestName: MatAutocompleteTrigger;
  @ViewChild('autoCompleteTestSubName', { static: false, read: MatAutocompleteTrigger }) triggerTestSubName: MatAutocompleteTrigger;

  //#endregion Property Declaration

  //#region Constructor
  constructor(public dialogRef: MatDialogRef<AddElabSetupComponent>,
    private fb: FormBuilder, private util: UtilService, public CustHttp: CustomHttpService, public ELabSetupAddService: eLabService) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.ElabBillingSetupForm = this.fb.group({

      DepartmentID: ['', Validators.required],
      Status: ['', Validators.required],
      OrderNo: ['', Validators.required],
      Charges: ['', Validators.required],
      TestName: ['', Validators.required],
      //TestCode: ['',Validators.required],
      TestSubName: ['', Validators.required],
    });

    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.GetStatusValue();
    this.GetDepartmentLabCodeList();
    this.GetTestName();
    this.GetTestNameSub();

  }
  ngAfterViewInit() {
    this.triggerDepartment.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.ElabBillingSetupForm.get('DepartmentID').setValue('');
      }
    });
    this.triggerTestName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.ElabBillingSetupForm.get('TestName').setValue('');
      }
    });
    this.triggerTestSubName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.ElabBillingSetupForm.get('TestSubName').setValue('');
      }
    });
  }
  //#endregion ngOnInit

  //#region Get Department Lab Code
  GetDepartmentLabCodeList() {

    this.ElabBillingSetupForm.get('DepartmentID').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {

          this.ELabSetupAddService.GetDepartmentLabCodeList(key).then(data => {
            this.DepartmentInfo = data;
          })
        } else {
          this.DepartmentInfo = null;
        }
      }
    })
  }
  //#endregion Get Department Lab Code

  //#region Get Status Value
  GetStatusValue() {
    this.ELabSetupAddService.GetStatusValue().then((res) => {
      this.StatusValue = res;
    })
  }
  //#endregion Get Status Value

  //#region Get Test Name
  GetTestName() {
    this.ElabBillingSetupForm.get('TestName').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {

          this.ELabSetupAddService.GetTestName(key).then(data => {
            this.TestNameInfo = data;
          })
        } else {
          this.TestNameInfo = null;
        }
      }
    })
  }
  //#endregion Get Test Name

  //#region Get Test Name Sub
  GetTestNameSub() {
    this.ElabBillingSetupForm.get('TestSubName').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {

          this.ELabSetupAddService.GetTestNameSub(key).then(data => {
            this.TestNameSubInfo = data;
          })
        } else {
          this.TestNameSubInfo = null;
        }
      }
    })
  }
  //#endregion Get Test Name

  //#region set department value as number
  setDepartment(number) {
    if (number >= 1) {
      this.setDepartmentNumber = number;
    } else {
      this.setDepartmentNumber = 0;
    }
  }
  //#endregion set department value as number

  //#region set TestName value as number
  setTestName(number) {
    if (number >= 1) {
      this.setTestNameNumber = number;
    } else {
      this.setTestNameNumber = 0;
    }
  }
  //#endregion set TestName value as number

  //#region set TestNameSub value as number
  setTestNameSub(number) {
    if (number >= 1) {
      this.setTestNameSubNumber = number;
    } else {
      this.setTestNameSubNumber = 0;
    }
  }
  //#endregion set TestName value as number

  //#region Save Function
  submitData() {
    if (this.ElabBillingSetupForm.valid && this.setDepartmentNumber && this.setTestNameNumber && this.setTestNameSubNumber) {

      this.ElabSetupModel.SetupMasterID = 0;
      this.ElabSetupModel.DepartmentID = this.setDepartmentNumber;
      this.ElabSetupModel.LabMasterID = this.setTestNameNumber;
      this.ElabSetupModel.LabSubMasterID = this.setTestNameSubNumber;
      this.ElabSetupModel.OrderNo = parseInt(this.ElabBillingSetupForm.get('OrderNo').value);
      this.ElabSetupModel.Status = (this.ElabBillingSetupForm.get('Status').value);
      this.ElabSetupModel.Charges = parseInt(this.ElabBillingSetupForm.get('Charges').value);
      this.ELabSetupAddService.AddUpdateBillingSetupMasterData(this.ElabSetupModel).then(res => {
        if (res) {
          this.util.showMessage('', 'e-lab Setup details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              if (res) {
                this.dialogRef.close("Updated");
              }
            });
        }
      });
    }
  }
  //#endregion Save Function

  //#region Close and clear
  close() {
    this.dialogRef.close();
  }
  clear() {
    this.ElabBillingSetupForm.reset();
  }
  //#endregion Close and clear
}
