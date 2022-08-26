import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatDialogRef } from '@angular/material';
import { Router } from "@angular/router";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { LabSubMasterModel } from "../../../Models/labSubMasterModel";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { eLabService } from "../../../eLab.service";
@Component({
  selector: 'app-add-lab-submaster',
  templateUrl: './add-lab-submaster.component.html',
  styleUrls: ['./add-lab-submaster.component.css']
})

export class AddElabSubMasterComponent implements OnInit {

  //#region Property Declaration
  LabSubMasterForm: FormGroup;
  LabSubMasterModel: LabSubMasterModel = new LabSubMasterModel();
  setDepartmentNumber: number = 0;
  setTestNamenumber: number = 0;
  DepartmentInfo: any;
  TestNameInfo: any;
  StatusValue: any;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger }) triggerDepartment: MatAutocompleteTrigger;
  @ViewChild('autoCompleteTestName', { static: false, read: MatAutocompleteTrigger }) triggerTestName: MatAutocompleteTrigger;
  //#endregion Property Declaration

  //#region Constructor
  constructor(private fb: FormBuilder, public dialog: MatDialogRef<AddElabSubMasterComponent>, private LabMasterService: eLabService, public customhttp: CustomHttpService, private router: Router, private util: UtilService) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.LabSubMasterForm = this.fb.group({
      DepartmentID: ['', Validators.required],
      TestName: ['', Validators.required],
      TestCodesub: ['', Validators.required],
      SubName: ['', Validators.required],
      Status: [''],
      OrderNo: ['', Validators.required],
      Units: [''],
      NormalRange: [''],

    });

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.GetDepartmentCodeList();
    this.GetTestNameList();
    this.GetStatusValue();
  }
  ngAfterViewInit() {
    this.triggerDepartment.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.LabSubMasterForm.get('DepartmentID').setValue('');
      }
    });
    this.triggerTestName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.LabSubMasterForm.get('TestName').setValue('');
      }
    });
  }
  //#endregion ngOnInit

  //#region Get Value From master
  //GetDepartmentCodeList
  GetDepartmentCodeList() {
    this.LabSubMasterForm.get('DepartmentID').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.LabMasterService.GetDepartmentCodeList(key).then(data => {
            this.DepartmentInfo = data;
          })
        } else {
          this.DepartmentInfo = null;
        }
      } else {
        this.DepartmentInfo = null;
      }
    })
  }
  //GetTestNameList
  GetTestNameList() {
    this.LabSubMasterForm.get('TestName').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.LabMasterService.GetTestNameList(this.setDepartmentNumber, key).then(data => {
            this.TestNameInfo = data;
          })
        } else {
          this.TestNameInfo = null;
        }
      }
    })
  }
  //GetStatusValue
  GetStatusValue() {
    this.LabMasterService.GetStatusValue().then((res) => {
      this.StatusValue = res;
    })
  }

  //#endregion Get Value From master  

  //#region Set Value as number
  setDepartment(number) {
    if (number >= 1) {
      this.setDepartmentNumber = number;
    } else {
      this.setDepartmentNumber = 0;
    }
  }
  setTestNameNumber(number) {
    if (number >= 1) {
      this.setTestNamenumber = number;
    } else {
      this.setTestNamenumber = 0;
    }
  }
  //#endregion Set Value as number

  //#region Save Function
  submitData() {
    if (this.LabSubMasterForm.valid) {

      this.LabSubMasterModel.LabSubMasterID = 0;
      this.LabSubMasterModel.DepartmentID = this.setDepartmentNumber;
      this.LabSubMasterModel.LabMasterId = this.setTestNamenumber;
      this.LabSubMasterModel.OrderNo = parseInt(this.LabSubMasterForm.get('OrderNo').value);
      this.LabSubMasterModel.SubMasterLabCode = this.LabSubMasterForm.get('TestCodesub').value;
      this.LabSubMasterModel.SubMasterLabType = this.LabSubMasterForm.get('SubName').value;
      this.LabSubMasterModel.Status = this.LabSubMasterForm.get('Status').value;
      this.LabSubMasterModel.Units = this.LabSubMasterForm.get('Units').value;
      this.LabSubMasterModel.NormalRange = this.LabSubMasterForm.get('NormalRange').value;

      this.LabMasterService.sendSubLabMaster(this.LabSubMasterModel).then(data => {
        if (data) {
          this.util.showMessage('', 'e-lab Sub Master details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              if (res) {
                this.dialog.close("update");
              }
            });
        }
      });
    }
  }
  //#endregion Save Function  

  //#region Close and clear
  cleartheForm() {
    this.LabSubMasterForm.reset();
  }
  close() {
    this.dialog.close();
  }
  //#endregion Close and clear
}
