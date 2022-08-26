import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { labSetupModel } from "../../Models/eLabSetupModel";
import { eLabService } from "../../eLab.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
    selector: 'app-edit-elab-setup',
    templateUrl: './edit-elab-setup.component.html',
    styleUrls: ['./edit-elab-setup.component.css']
  })

  export class EditElabSetupComponent implements OnInit {

     //#region Property Declaration
    ElabBillingSetupForm:FormGroup; 
    ElabSetupModel: labSetupModel = new labSetupModel();
    setDepartmentNumber: any;
    SetupMasterID: number=0;
    StatusValue: any;
    DepartmentToolTipValue: any="";
    TestNameToolTipValue: any="";
    TestSubNameToolTipValue: any="";
    //#endregion Property Declaration

     //#region Constructor & ngOnInit
    constructor(public dialogRef: MatDialogRef<EditElabSetupComponent>,private fb: FormBuilder,private util: UtilService,
       public CustHttp: CustomHttpService, public ELabSetupEditService: eLabService,@Inject(MAT_DIALOG_DATA) public data: any) { }  

    ngOnInit() {        
      this.ElabBillingSetupForm = this.fb.group({  

        DepartmentID: ['',Validators.required],
        TestName: ['',Validators.required],
        //TestCodesub: ['',Validators.required],
        TestSubName: ['',Validators.required],
        Status: ['',Validators.required],
        OrderNo: ['',Validators.required],
        Charges: ['',Validators.required],
        
        });
     
      this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
      this.GetStatusValue();
      this.setEditLabMaster();
  }  
  //#endregion Constructor & ngOnInit
 
  //#region Get Status Value
  GetStatusValue(){
   this.ELabSetupEditService.GetStatusValue().then((res)=>
    {
    this.StatusValue=res;         
    })
  }
  //#endregion Get Status Value

  //#region set values of form
  setEditLabMaster(){

    this.SetupMasterID=this.data.SetupMasterID;
    this.setDepartmentNumber=this.data.DepartmentID;
    this.ElabBillingSetupForm.get('DepartmentID').setValue(this.data.DepartmentDesc);
    this.DepartmentToolTipValue=this.data.DepartmentDesc;
    this.ElabBillingSetupForm.get('TestName').setValue(this.data.LabMasterDesc);
    this.TestNameToolTipValue=this.data.LabMasterDesc;
    this.ElabBillingSetupForm.get('Status').setValue(this.data.Status);
    this.TestSubNameToolTipValue=this.data.LabSubMasterDesc;
    this.ElabBillingSetupForm.get('TestSubName').setValue(this.data.LabSubMasterDesc);
    this.ElabBillingSetupForm.get('OrderNo').setValue(this.data.OrderNo);
    this.ElabBillingSetupForm.get('Charges').setValue(this.data.Charges);

  }
    //#endregion set values of form

    //#region Save Function
submitData() {
  if(this.ElabBillingSetupForm.valid){

    this.ElabSetupModel.SetupMasterID=this.SetupMasterID;
    this.ElabSetupModel.DepartmentID = this.setDepartmentNumber;
    this.ElabSetupModel.OrderNo = (this.ElabBillingSetupForm.get('OrderNo').value);
    this.ElabSetupModel.Status = (this.ElabBillingSetupForm.get('Status').value);    
    this.ElabSetupModel.LabMasterID=this.data.LabMasterID;
    this.ElabSetupModel.LabSubMasterID=this.data.LabSubMasterID;
    this.ElabSetupModel.Charges= this.ElabBillingSetupForm.get('Charges').value;

    this.ELabSetupEditService.AddUpdateBillingSetupMasterData(this.ElabSetupModel).then(res => {
      if(res){
        this.util.showMessage('', 'e-lab Setup details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            if(res){
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
   clear(){
     this.ElabBillingSetupForm.reset();
     this.setEditLabMaster();
   }
   //#endregion Close and clear

}
