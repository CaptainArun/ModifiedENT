import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhysicianSpecialityModel } from './models/physicianSpecialityModel';
import { PhysicianService } from './physician.service';
import { TableConfig } from '../ux/columnConfig';
import { CustomHttpService } from '../core/custom-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsService } from '../appointments/appointments.service';
import { ViewPhysicianSpecialityComponent } from './physician-speciality-view/view-physician-speciality.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'physician-speciality',
  templateUrl: 'physician-speciality.component.html'
})

export class PhysicianSpecialityComponent {

  //#region "property declaration"
  physicianSpecialityForm: FormGroup;
  physicianSpecialityModel: PhysicianSpecialityModel = new PhysicianSpecialityModel();
  tableConfig: TableConfig = new TableConfig();
  specialitytooltip: any;
  providerId: number;
  speciality: any;
  specialityGridData: any;
  specialityDetail: any;
  specialitycollectionedit: any;
  IsDateCorect: any;
  //#endregion

  //#region "constructor"
  constructor(private router: Router,public dialog: MatDialog, private fb: FormBuilder, private physicianservice: PhysicianService, private customHttpSvc: CustomHttpService,
    private activeroute: ActivatedRoute, private appointmentSvc:AppointmentsService) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;

    this.tableConfig.columnConfig = [
      { PropertyName: 'SpecialityDescription', DisplayName: 'Speciality', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'EffectiveDate', DisplayName: 'Effective Date', DisplayMode: 'DateTime', FormatString:'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'TerminationDate', DisplayName: 'Termination Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'Createddate', DisplayName: 'Created Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'CreatedBy', DisplayName: 'Created By', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }
    //#endregion

  //#region "ngOnInit"
   ngOnInit() {
     this.physicianSpecialityForm = this.fb.group({
       Speciality: ['', Validators.required],
       EffectiveDate: ['', Validators.required],
       TerminationDate: ['', Validators.required]
     });   
     this.activeroute.params.subscribe(param => {
       this.providerId = param['ProviderId']
     });
     this.getAllSpecialities();
     this.Specialitygrid();
     this.CheckValidDate();
  }
  //#endregion

  //#region "Check Valid Date"

  public CheckValidDate(): void {

    this.physicianSpecialityForm.get('EffectiveDate').valueChanges.subscribe((EffectiveDate: any) => {
      if (new Date(this.physicianSpecialityForm.get('EffectiveDate').value) >new Date(this.physicianSpecialityForm.get('TerminationDate').value)) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.physicianSpecialityForm.get('TerminationDate').valueChanges.subscribe((StartDate: any) => {
      if (new Date(this.physicianSpecialityForm.get('EffectiveDate').value) >new Date(this.physicianSpecialityForm.get('TerminationDate').value)) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
    //#endregion

  //#region "Speciality DropDown"
  getAllSpecialities() {
    this.appointmentSvc.getProvidSpecialities().then(data => {
      this.speciality = data;       
    });
  }
 //#endregion

  //#region "Speciality Grid data"
  Specialitygrid() {
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.physicianservice.getPhysicianSpecialities(this.providerId).then(data => {
      this.specialityGridData = data;
    });
  }
   //#endregion

  //#region "Clear"
  clear() {
    this.physicianSpecialityForm.reset();
    //this.physicianSpecialityForm.invalid;
    //this.physicianSpecialityForm.get('EffectiveDate').setValue(null);
    //this.physicianSpecialityForm.get('TerminationDate').clearValidators();
    //this.physicianSpecialityForm.get('Speciality').clearValidators();
    this.physicianSpecialityForm.get('Speciality').enable();
  
  }
 //#endregion

  ////#region "back"
  //back() {
  //  this.router.navigate(['/home/physician/physicianlist']);
  //}
  ////#endregion

  //#region "Speciality view"
  SpecialityViewRecord(element: any) {
    this.physicianservice.getPhysicianSpecialitybyID(element.Item.ProviderSpecialtyID).then(data => {
         var specialityDetail = data;
         const dialogRef = this.dialog.open(ViewPhysicianSpecialityComponent, {
           data: specialityDetail,
           height: 'auto',
           width: '50%',
           autoFocus: false,
         });
    });
  }
  //#endregion

  //#region "Speciality Edit"
    SpecialityeditRecord(element: any) {
      this.physicianservice.getPhysicianSpecialitybyID(element.Item.ProviderSpecialtyID).then(data => {
           this. specialityDetail = data;       
        this.physicianSpecialityForm.get('Speciality').setValue(data.SpecialityID);
   this.physicianSpecialityForm.get('EffectiveDate').setValue(data.EffectiveDate);
  this.physicianSpecialityForm.get('TerminationDate').setValue(data.TerminationDate);
        this.physicianSpecialityForm.get('Speciality').disable();
        this.specialitytooltip = data.SpecialityDescription;
      });
  }
    //#endregion

  //#region "Submit"
  addUpdatePhysicianSpeciality() {
    if (this.physicianSpecialityForm.valid) {
      if (this.specialityDetail != null && this.specialityDetail != undefined) {

        this.editsubmit();
        this.specialityDetail = null;
      } else {
        var spec = this.physicianSpecialityForm.get('Speciality').value;
        for (let sepcId of this.speciality) {
          if (sepcId.SpecialityID == spec) {
            this.physicianSpecialityModel = new PhysicianSpecialityModel();
            this.physicianSpecialityModel.ProviderID = this.providerId;
            this.physicianSpecialityModel.SpecialityID = sepcId.SpecialityID;
            this.physicianSpecialityModel.SpecialityCode = sepcId.SpecialityCode;
            this.physicianSpecialityModel.SpecialityDescription = sepcId.SpecialityDescription;
            this.physicianSpecialityModel.EffectiveDate = this.physicianSpecialityForm.get('EffectiveDate').value;
            this.physicianSpecialityModel.TerminationDate = this.physicianSpecialityForm.get('TerminationDate').value;
            //this.physicianSpecialityForm.get('EffectiveDate').clearValidators();
            //this.physicianSpecialityForm.get('TerminationDate').clearValidators();
            //this.physicianSpecialityForm.get('Speciality').clearValidators();
            this.physicianservice.addUpdatePhysicianSpeciality(this.physicianSpecialityModel).then(res => {
              this.Specialitygrid();
              //this.physicianSpecialityForm.reset();
              //this.physicianSpecialityForm.get('EffectiveDate').clearValidators();
              //this.physicianSpecialityForm.get('TerminationDate').clearValidators();
              //this.physicianSpecialityForm.get('Speciality').clearValidators();
            });
          }
        }
      }
    }
  }
 //#endregion

  //#region "Edit Submit"

editsubmit(){
  var spec = this.physicianSpecialityForm.get('Speciality').value;
  for (let sepcId of this.speciality) {
    if (sepcId.SpecialityID==spec){
     this.specialitycollectionedit=sepcId
    }
  }
      this.physicianSpecialityModel.ProviderID = this.specialityDetail.ProviderID;
      this.physicianSpecialityModel.SpecialityID = this.specialitycollectionedit.SpecialityID;
      this.physicianSpecialityModel.SpecialityCode = this.specialitycollectionedit.SpecialityCode;
      this.physicianSpecialityModel.SpecialityDescription = this.specialitycollectionedit.SpecialityDescription;
      this.physicianSpecialityModel.EffectiveDate = this.physicianSpecialityForm.get('EffectiveDate').value;
      this.physicianSpecialityModel.TerminationDate = this.physicianSpecialityForm.get('TerminationDate').value;
      this.physicianservice.addUpdatePhysicianSpeciality(this.physicianSpecialityModel).then(res => {
      this.Specialitygrid();
      //this.physicianSpecialityForm.reset();
        this.physicianSpecialityForm.get('Speciality').enable();
        //this.physicianSpecialityForm.get('EffectiveDate').clearValidators();
        //this.physicianSpecialityForm.get('TerminationDate').clearValidators();
        //this.physicianSpecialityForm.get('Speciality').clearValidators();
        });
  }
 //#endregion

  //#region "Speciality tolltip"
  setspeciality(value1) {
    this.specialitytooltip = value1;
  }
   //#endregion

}

