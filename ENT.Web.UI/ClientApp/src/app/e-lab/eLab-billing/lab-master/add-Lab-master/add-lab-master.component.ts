import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from "@angular/router";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { LabMasterModel } from "../../../Models/LabMasterModel";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { eLabService } from "../../../eLab.service";
@Component({
  selector: 'app-add-lab-master',
  templateUrl: './add-lab-master.component.html',
  styleUrls: ['./add-lab-master.component.css']

})
export class AddElabMasterComponent implements OnInit {
  //#region Property Declaration
  LabMasterForm: FormGroup;
  LabMasterModel: LabMasterModel = new LabMasterModel();
  AllowSubMasterdisable: any;
  DepartmentInfo: any;
  setDepartmentNumber: any;
  StatusValue: any;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger }) triggerDepartment: MatAutocompleteTrigger;
  //#endregion Property Declaration

  //#region Constructor
  constructor(private fb: FormBuilder, public dialog: MatDialogRef<AddElabMasterComponent>,
    private LabMasterService: eLabService, public customhttp: CustomHttpService, private router: Router,
    private util: UtilService, @Inject(MAT_DIALOG_DATA) public data: any) { }
  //#endregion Constructor

  //#region ngOnInit
  ngOnInit() {
    this.LabMasterForm = this.fb.group({
      DepartmentID: ['', Validators.required],
      OrderNo: ['', Validators.required],
      LabTypeDesc: ['', Validators.required],
      TestCode: ['', Validators.required],
      TestName: ['', Validators.required],
      Status: [''],
      AllowSubMaster: [''],
      NormalRange: [''],
      Unitname: [''],

    });

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.GetDepartmentLabCodeList();
    this.GetStatusValue();
  }
  ngAfterViewInit() {
    this.triggerDepartment.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.LabMasterForm.get('DepartmentID').setValue('');
      }
    });
  }
  //#endregion ngOnInit

  //#region  set method
  //disable method for units and range 
  set() {
    if (this.LabMasterForm.get('AllowSubMaster').value) {
      this.AllowSubMasterdisable = true;
      this.LabMasterForm.get('Unitname').setValue('');
      this.LabMasterForm.get('NormalRange').setValue('');
    }
    else {
      this.AllowSubMasterdisable = false;
    }
  }

  //set department value as number
  setDepartment(number) {
    if (number >= 1) {
      this.setDepartmentNumber = number;
    } else {
      this.setDepartmentNumber = 0;
    }
  }
  //#endregion set method

  //#region get values from master
  // status value
  GetStatusValue() {
    this.LabMasterService.GetStatusValue().then((res) => {
      this.StatusValue = res;
    })
  }

  //department code list
  GetDepartmentLabCodeList() {
    this.LabMasterForm.get('DepartmentID').valueChanges.subscribe((key: any) => {
      if (key != null) {
        if (key.length > 2) {
          this.LabMasterService.GetDepartmentLabCodeList(key).then(data => {
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
  //#endregion get values from master

  //#region Save Function
  submitData() {
    if (this.LabMasterForm.valid) {

      this.LabMasterModel.LabMasterID = 0;
      this.LabMasterModel.DepartmentID = this.setDepartmentNumber;
      this.LabMasterModel.LabTypeDesc = this.LabMasterForm.get('LabTypeDesc').value;
      this.LabMasterModel.OrderNo = parseInt(this.LabMasterForm.get('OrderNo').value);
      this.LabMasterModel.MasterLabTypeCode = this.LabMasterForm.get('TestCode').value;
      this.LabMasterModel.MasterLabType = this.LabMasterForm.get('TestName').value;
      this.LabMasterModel.Status = this.LabMasterForm.get('Status').value;

      if (this.LabMasterForm.get('AllowSubMaster').value) {

        this.LabMasterModel.AllowSubMaster = true;
      } else {
        this.LabMasterModel.AllowSubMaster = false;
      }
      this.LabMasterModel.Units = this.LabMasterForm.get('Unitname').value;
      this.LabMasterModel.NormalRange = this.LabMasterForm.get('NormalRange').value;

      this.LabMasterService.SaveAddElabMaster(this.LabMasterModel).then(data => {
        if (data) {
          this.util.showMessage('', 'e-lab Master details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              if (res) {
                this.dialog.close("updated");
              }
            });
        }
      });
    }
  }
  //#endregion Save Function

  //#region clear the form
  cleartheForm() {
    this.LabMasterForm.reset();
  }
  //#endregion clear the form

  //#region close the form
  close() {
    this.dialog.close();
  }
  //#endregion close the form
}
