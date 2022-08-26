import { Component, Output ,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PhysicianAddComponent } from './physician-add.component';
import { PhysicianScheduleComponent } from './physician-schedule.component';
import { PhysicianService } from './physician.service';
import { TableConfig } from '../ux/columnConfig';
import { CustomHttpService } from '../core/custom-http.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilService } from '../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
@Component({
  selector: 'physician-list',
  templateUrl: 'physician-list.component.html'
})

  //#region "Property Decleration"

export class PhysicianListComponent {
  //#region "property declaration"
  physicianForm: FormGroup;
  physicianCount:any;
  doctordata: any;
  providerId: number;
  specialityId: number;
  specialityData: any;
  doctor: any;
  physiciansearchgrid: any;
  show: any = false;
 // pincode: any;
  tableConfig: TableConfig = new TableConfig();
  PhysicianSearchModelValue= { 
  ProviderId:0,
  SpecialityId:0
   };
  //#endregion

  //#region "constructor"
  constructor(private router: Router, private util: UtilService, public fb: FormBuilder, public dialog: MatDialog, private physicianSvc: PhysicianService, private customHttpSvc: CustomHttpService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;

    this.tableConfig.columnConfig = [
      { PropertyName: 'ProviderName', DisplayName: 'Physician Name', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PhoneNumber', DisplayName: 'Mobile Number', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'PersonalEmail', DisplayName: 'Email Address', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'State', DisplayName: 'State', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Pincode', DisplayName: 'Pincode', DisplayMode: 'Text', LinkUrl: '' },
    ];
  }
    //#endregion

  //#region "ngOnInit"
   ngOnInit() {
    this.physicianForm = this.fb.group({
      Doctor: ['',],
      Speciality:['',],

    })
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.searchPhysicianData();
    this.getPhysicianCount();
    this.getPhysicianColletionForTable();
    this.getSpeciality();
  }
   //#endregion

  //#region "Physician Add
   addPhysician(){
    const dialogRef = this.dialog.open(PhysicianAddComponent, {
    height: 'auto',
    });
     dialogRef.afterClosed().subscribe(result => {
       if (result == "updated") {
         this.searchPhysicianData();
         this.getPhysicianCount();
       }
     });     
  }
   //#endregion

   //#region "Physician Address
  openPhysician(element: any) {
    this.setsessionStorage();
    this.router.navigate(['home/physician/physicianaddress', element.Item.ProviderID]);
  }    
     //#endregion

   //#region "Physician Count
  getPhysicianCount() {
    this.physicianSvc.getPhysicianCount().then(data => {
      this.physicianCount=data;
    });
  }
  //#endregion

  //#region "Doctor  Dropdown
  getPhysicianColletionForTable() {
    this.physicianSvc.getAllPhysicianList().then(data => {
      this.doctordata = data;
    }); 
  }
    //#endregion

  //#region "Speciality  Dropdown
  getSpeciality() {
    this.physicianSvc.getAllSpecialities().then(data => {
      this.specialityData = data;
    });
  } 
  //#endregion

  

  //#region "Search"
  searchPhysicianData() {

    if (sessionStorage.getItem("PhysicianSearchModel")) {
      let PhysicianSearchModel = JSON.parse(sessionStorage.getItem("PhysicianSearchModel"));
      this.PhysicianSearchModelValue=PhysicianSearchModel.PhysicianSearchModelValue;
      this.physicianForm.get('Doctor').setValue(PhysicianSearchModel.Doctor);
      this.physicianForm.get('Speciality').setValue(PhysicianSearchModel.Speciality);
      let DoctorData=(PhysicianSearchModel.Doctor!=null) ? PhysicianSearchModel.Doctor : 0;
      let Speciality=(PhysicianSearchModel.Speciality!=null) ? PhysicianSearchModel.Speciality : 0;
      this.physicianSvc.SearchPhysicianList(DoctorData, Speciality).then(data => {
        this.physiciansearchgrid = data;
          if (data.length == 0) {
            this.show = true;
          }
          else {
            this.show = false;
          }
        });
        sessionStorage.removeItem("PhysicianSearchModel");
  }
  else {
    if (this.physicianForm.get('Doctor').value != undefined && this.physicianForm.get('Doctor').value != null && this.physicianForm.get('Doctor').value != "") {
      this.physicianForm.get('Doctor').value;
    } else {
      this.physicianForm.get('Doctor').setValue(0);
    }
    if (this.physicianForm.get('Speciality').value != undefined && this.physicianForm.get('Speciality').value != null && this.physicianForm.get('Speciality').value != "") {
      this.physicianForm.get('Speciality').value;
    } else {
      this.physicianForm.get('Speciality').setValue(0);
    }
    let providerIdValue=this.physicianForm.get('Doctor').value;
    let specialityIdValue= this.physicianForm.get('Speciality').value;

      this.physicianSvc.SearchPhysicianList(providerIdValue, specialityIdValue).then(data => {
        this.physiciansearchgrid = data;
        if (data.length == 0) {
          this.show = true;
        }
        else {
          this.show = false;

        }
      });
      this.PhysicianSearchModel(providerIdValue ,specialityIdValue);
    }
  }
    //#endregion

 //#region "Set PhysicianSearchModel"
 PhysicianSearchModel(providerIdValue,specialityIdValue){
  this.PhysicianSearchModelValue.ProviderId=providerIdValue;
  this.PhysicianSearchModelValue.SpecialityId=specialityIdValue;
}
 //#endregion

  //#region "Set sessionStorageFor_PhysicianSearchModel"
  setsessionStorage(){

    let setsessionvalue={
      PhysicianSearchModelValue: this.PhysicianSearchModelValue,
      Doctor:this.physicianForm.get('Doctor').value,
      Speciality: this.physicianForm.get('Speciality').value,
     }
    sessionStorage.setItem("PhysicianSearchModel" , JSON.stringify(setsessionvalue));
  }
   //#endregion


  //#region "Cancel"
  cancel() {
    this.physicianForm.get('Speciality').setValue(0);
    this.physicianForm.get('Doctor').setValue(0);
    this.physicianSvc.SearchPhysicianList(this.physicianForm.get('Doctor').value, (this.physicianForm.get('Speciality').value)).then(data => {
      this.physiciansearchgrid = data;
      if (data.length == 0) {
        this.show = true;
      }
      else {
        this.show = false;

      }
    });
    this.physicianForm.reset();    
  }
      //#endregion

  //#region "Set pincode"
  setpincode(event: any) {
    if (event.Item) {
      if (event.Item.Pincode == "" && event.Item.Pincode == 0) {
        event.Item.Pincode = "";
      }
    }
    else {
      event.Item.Pincode;
    }

    //#endregion
  }
}
