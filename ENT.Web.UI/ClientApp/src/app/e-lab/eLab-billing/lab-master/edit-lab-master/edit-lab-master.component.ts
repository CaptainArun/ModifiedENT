import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { LabMasterModel } from '../../../Models/LabMasterModel';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { eLabService } from '../../../eLab.service';
import { UtilService } from '../../../../core/util.service';

@Component({
    selector: 'app-edit-lab-master',
    templateUrl: './edit-lab-master.component.html',
    styleUrls: ['./edit-lab-master.component.css']
  })
  export class EditLabMasterComponent implements OnInit {
  
    //#region Property Declaration
    LabMasterEditForm: FormGroup;
    LabMasterModel: LabMasterModel = new LabMasterModel();
    AllowSubMasterdisable: boolean;
    setDepartmentNumber: any;
    StatusValue: any;
    DepartmentToolTipValue: any="";
    TestCodeToolTipValue: any="";
    //#endregion Property Declaration

    //#region Constructor
    constructor(private fb: FormBuilder,private LabMasterService: eLabService, public customhttp: CustomHttpService,
       public dialogRef:MatDialogRef<EditLabMasterComponent> , @Inject(MAT_DIALOG_DATA) public data: any, 
       private util: UtilService,) {}   
       //#endregion Constructor  

    //#region ng on init
    ngOnInit() {
        this.LabMasterEditForm = this.fb.group({
            DepartmentID: ['',Validators.required],
            OrderNo: ['',Validators.required],
            LabTypeDesc: ['',Validators.required],
            TestCode: ['',Validators.required],
            TestName: ['',Validators.required],
            Status: [''],
            AllowSubMaster: [''],
            NormalRange: [''],
            Unitname: [''],

          });
          this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
       
         this.setEditLabMaster();
         this.set();
         this.GetStatusValue();
    }
    //#endregion ng on init

    //#region Get Status Value
    GetStatusValue(){
      this.LabMasterService.GetStatusValue().then((res)=>
      {
        this.StatusValue=res;         
      })
    }
    //#endregion Get Status Value

    //#region set check box Condition
    set(){
      if(this.LabMasterEditForm.get('AllowSubMaster').value){
        this.AllowSubMasterdisable=true;
        this.LabMasterEditForm.get('Unitname').setValue('');
        this.LabMasterEditForm.get('NormalRange').setValue('');   
      }
      else{
        this.AllowSubMasterdisable=false;
      }
    }
    //#endregion set check box Condition

    //#region set Form values
    setEditLabMaster(){

    this.setDepartmentNumber=this.data.DepartmentID;
    this.LabMasterEditForm.get('DepartmentID').setValue(this.data.DepartmentDesc);
    this.DepartmentToolTipValue=this.data.DepartmentDesc;
    this.LabMasterEditForm.get('LabTypeDesc').setValue(this.data.LabTypeDesc);
    this.LabMasterEditForm.get('TestCode').setValue(this.data.MasterLabTypeCode);
    this.TestCodeToolTipValue=this.data.MasterLabTypeCode;
    this.LabMasterEditForm.get('TestName').setValue(this.data.MasterLabType);
    this.LabMasterEditForm.get('Status').setValue(this.data.Status);
    this.LabMasterEditForm.get('AllowSubMaster').setValue(this.data.AllowSubMaster);
    this.LabMasterEditForm.get('Unitname').setValue(this.data.Units);
    this.LabMasterEditForm.get('OrderNo').setValue(this.data.OrderNo);
    this.LabMasterEditForm.get('NormalRange').setValue(this.data.NormalRange);

    }
    //#endregion set Form values

    //#region Save function
  submitData(){
    if(this.LabMasterEditForm.valid){
      this.LabMasterModel.LabMasterID=this.data.LabMasterID;
      this.LabMasterModel.DepartmentID =  this.setDepartmentNumber;
      this.LabMasterModel.LabTypeDesc = this.LabMasterEditForm.get('LabTypeDesc').value;
      this.LabMasterModel.OrderNo = parseInt(this.LabMasterEditForm.get('OrderNo').value);
      this.LabMasterModel.MasterLabTypeCode = this.LabMasterEditForm.get('TestCode').value;
      this.LabMasterModel.MasterLabType = this.LabMasterEditForm.get('TestName').value;
      this.LabMasterModel.Status = this.LabMasterEditForm.get('Status').value;

      if(this.LabMasterEditForm.get('AllowSubMaster').value){
        this.LabMasterModel.AllowSubMaster =true;
      }else{
        this.LabMasterModel.AllowSubMaster =false;
      }      

      this.LabMasterModel.Units = this.LabMasterEditForm.get('Unitname').value;
      this.LabMasterModel.NormalRange = this.LabMasterEditForm.get('NormalRange').value;

        this.LabMasterService.SaveAddElabMaster(this.LabMasterModel).then(data => {
          if(data!=null)
            this.util.showMessage('', 'e-lab details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
              (res) => {
                if(res){
                  this.dialogRef.close("updated");
                }
            });          
          });
        }    
    }
    //#endregion save function

    //#region clear and close
       clear(){
          this.LabMasterEditForm.reset();
          this.setEditLabMaster();
       }

      close(): void {
        this.dialogRef.close();
      }
      //#endregion clear and close
}
