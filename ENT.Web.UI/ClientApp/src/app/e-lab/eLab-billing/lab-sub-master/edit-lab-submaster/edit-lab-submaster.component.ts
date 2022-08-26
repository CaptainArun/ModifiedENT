import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { LabSubMasterModel } from '../../../Models/labSubMasterModel';
import { eLabService } from '../../../eLab.service';
import { UtilService } from '../../../../core/util.service';
import { Router } from '@angular/router';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
    selector: 'app-edit-lab-submaster',
    templateUrl: './edit-lab-submaster.component.html',
    styleUrls: ['./edit-lab-submaster.component.css']
  })

export class EditLabSubMasterComponent implements OnInit {

//#region Property Declaration
    LabSubMasterForm: FormGroup;
    LabSubMasterModel: LabSubMasterModel = new LabSubMasterModel();
    setDepartmentNumber: number=0;
    setTestNamenumber: number;
    StatusValue: any;
    DepartmentToolTipValue: any="";
    TestNameToolTipValue: any="";
    TestCodesubToolTipValue: any="";
//#endregion Property Declaration

//#region Constructor
    constructor(private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,  public dialog: MatDialogRef<EditLabSubMasterComponent>, 
      private LabMasterService: eLabService, public customhttp: CustomHttpService, private router: Router,  private util: UtilService)
    {       }
//#endregion Constructor

//#region ngOnInit
      ngOnInit() {
        this.LabSubMasterForm = this.fb.group({
          DepartmentID: ['',Validators.required],
          TestName: ['',Validators.required],
          TestCodesub: ['',Validators.required],
          SubName: ['',Validators.required],
          Status: ['',Validators.required],
          OrderNo: ['',Validators.required],
          Units: [''],
          NormalRange: [''],        

        });

          this.customhttp.getDbName(localStorage.getItem('DatabaseName'));    
          this.GetStatusValue();
          this.setEditLabMaster();
    }
//#endregion ngOnInit

//#region set form Values
    setEditLabMaster(){

    this.setDepartmentNumber=this.data.DepartmentID;
    this.LabSubMasterForm.get('DepartmentID').setValue(this.data.DepartmentDesc);
    this.DepartmentToolTipValue=this.data.DepartmentDesc;
    this.setTestNamenumber= this.data.LabMasterId;
    this.LabSubMasterForm.get('TestName').setValue(this.data.LabMasterDesc);
    this.TestNameToolTipValue=this.data.LabMasterDesc;
    this.LabSubMasterForm.get('TestCodesub').setValue(this.data.SubMasterLabCode);
    this.TestCodesubToolTipValue=this.data.SubMasterLabCode;
    this.LabSubMasterForm.get('SubName').setValue(this.data.SubMasterLabType);
    this.LabSubMasterForm.get('Status').setValue(this.data.Status);
    this.LabSubMasterForm.get('OrderNo').setValue(this.data.OrderNo);
    this.LabSubMasterForm.get('Units').setValue(this.data.Units);
    this.LabSubMasterForm.get('NormalRange').setValue(this.data.NormalRange);

    }
//#endregion set form Values

//#region Get Value From master
//GetStatusValue
    GetStatusValue(){
      this.LabMasterService.GetStatusValue().then((res)=>
      {
        this.StatusValue=res;         
      })
    }
//#endregion Get Value From master   

//#region Save Function
    submitData(){
      if(this.LabSubMasterForm.valid){

        this.LabSubMasterModel.LabSubMasterID=this.data.LabSubMasterID;
        this.LabSubMasterModel.DepartmentID = this.setDepartmentNumber;
        this.LabSubMasterModel.LabMasterId =  this.setTestNamenumber;
        this.LabSubMasterModel.OrderNo = parseInt(this.LabSubMasterForm.get('OrderNo').value);
        this.LabSubMasterModel.SubMasterLabCode = this.LabSubMasterForm.get('TestCodesub').value;
        this.LabSubMasterModel.SubMasterLabType = this.LabSubMasterForm.get('SubName').value;
        this.LabSubMasterModel.Status = this.LabSubMasterForm.get('Status').value;
        this.LabSubMasterModel.Units = this.LabSubMasterForm.get('Units').value;
        this.LabSubMasterModel.NormalRange = this.LabSubMasterForm.get('NormalRange').value;

        this.LabMasterService.sendSubLabMaster(this.LabSubMasterModel).then(data => {
          if(data){
            this.util.showMessage('', 'e-lab Sub Master details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
              (res) => { 
                if(res){
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
      this.setEditLabMaster();
    }
    close() {
      this.dialog.close();
    }
//#endregion Close and clear
}
