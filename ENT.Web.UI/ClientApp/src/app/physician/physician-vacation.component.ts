import { Component } from '@angular/core';
import { TableConfig } from '../ux/columnConfig';
import { PhysicianService } from './physician.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhysicianVacationModel } from './models/physicianVacationModel';
import { CustomHttpService } from '../core/custom-http.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ViewPhysicianvacationComponent } from './physician-vacation-view/view-physician-vacation.component';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../core/util.service';
@Component({
  selector: 'physician-vacation',
  templateUrl: 'physician-vacation.component.html'
})

export class PhysicianVacationComponent {
   //#region "property declaration"
  tableConfig: TableConfig = new TableConfig();
  physicainVacationForm: FormGroup;
  vacationModel: PhysicianVacationModel = new PhysicianVacationModel();
  providerId: number;
  vacationGriddata: any;
  vacationDetail: any;
  IsDateCorect: any;
  //#endregion

     //#region "constructor"
  constructor(private router: Router, private util: UtilService,public dialog: MatDialog,private physicianSvc: PhysicianService, private fb: FormBuilder, private customHttpSvc: CustomHttpService,
    private activeroute: ActivatedRoute) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = false;

    this.tableConfig.columnConfig = [
      { PropertyName: 'StartDate', DisplayName: 'Start Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'EndDate', DisplayName: 'End Date', DisplayMode: 'DateTime', FormatString: 'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'Reason', DisplayName: 'Reason', DisplayMode: 'Text', LinkUrl: '' },
      { PropertyName: 'Createddate', DisplayName: 'Created Date', DisplayMode: 'DateTime', FormatString:'dd-MM-yyyy', LinkUrl: '' },
      { PropertyName: 'CreatedBy', DisplayName: 'Created By', DisplayMode: 'Text', LinkUrl: '' }
    ];
  }
  //#endregion

     //#region "ngOnInit"
   ngOnInit() {
     this.physicainVacationForm = this.fb.group({
       StartDate: ['', Validators.required],
       EndDate: ['',Validators.required],
       Reason: ['']
     });

     this.activeroute.params.subscribe(param => {
       this.providerId = param['ProviderId'];
     })
     this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
     this.getPhysicianVacationList();
     this.CheckValidDate();
  }
  //#endregion

  //#region "Property Check Valid"
  public CheckValidDate(): void {

    this.physicainVacationForm.get('StartDate').valueChanges.subscribe((StartDate: any) => {
      if (new Date(this.physicainVacationForm.get('StartDate').value) > new Date(this.physicainVacationForm.get('EndDate').value)) {
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.physicainVacationForm.get('EndDate').valueChanges.subscribe((EndDate: any) => {
      if (new Date(this.physicainVacationForm.get('StartDate').value) > new Date(this.physicainVacationForm.get('EndDate').value)) {
       
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
       
      }
    });
  }
    //#endregion

     //#region "Grid data"
  getPhysicianVacationList() {
    this.physicianSvc.getPhysicianVacationDetails(this.providerId).then(data => {
      this.vacationGriddata = data;
    });
  }
    //#endregion

     //#region "view record"
  ViewRecord(element: any) {
         var vacationDetail = element.Item;
         const dialogRef = this.dialog.open(ViewPhysicianvacationComponent, {
           data: vacationDetail,
           height: 'auto',
           width: '50%',
           autoFocus: false,
         });
  }
    //#endregion

     //#region "Edit record"
  EditRecord(element: any) {
    this.vacationDetail = element.Item;
    this.physicainVacationForm.get('StartDate').setValue(this.vacationDetail.StartDate);
    this.physicainVacationForm.get('EndDate').setValue(this.vacationDetail.EndDate);
    this.physicainVacationForm.get('Reason').setValue(this.vacationDetail.Reason);
  }
   //#endregion

     //#region "Save"
  addVacationDetails() {
    if (this.physicainVacationForm.valid) {
      if (this.vacationDetail != null && this.vacationDetail != undefined) {
        this.editVacationDetailsSave();
        this.vacationDetail = null;
      } else {
        this.vacationModel = new PhysicianVacationModel();
        this.vacationModel.ProviderID = this.providerId;
        this.vacationModel.StartDate = this.physicainVacationForm.get('StartDate').value;
        this.vacationModel.EndDate = this.physicainVacationForm.get('EndDate').value;
        this.vacationModel.Reason = this.physicainVacationForm.get('Reason').value;
        this.physicianSvc.addUpdatePhysicianVacation(this.vacationModel).then(res => {
            this.util.showMessage('', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
         // this.physicainVacationForm.reset();
          this.getPhysicianVacationList();
        });
      }
    }
  }
     //#endregion

     //#region "Edit Save"
      editVacationDetailsSave() {
      this.vacationModel.ProviderID = this.vacationDetail.ProviderID;
      this.vacationModel.ProvidervacationID = this.vacationDetail.ProvidervacationID;
      this.vacationModel.StartDate = this.physicainVacationForm.get('StartDate').value;
      this.vacationModel.EndDate = this.physicainVacationForm.get('EndDate').value;
      this.vacationModel.Reason = this.physicainVacationForm.get('Reason').value; 
        this.physicianSvc.addUpdatePhysicianVacation(this.vacationModel).then(res => {
        this.util.showMessage('', res.status, BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox);
         
      //this.physicainVacationForm.reset();
        this.getPhysicianVacationList();
      })
  }
       //#endregion

     //#region "Clear"
  clear() {
    this.physicainVacationForm.reset();
  //  this.vacationDetail.ProvidervacationID = 0;
  }
   //#endregion

 //    //#region "back"
 // back() {
 //   this.router.navigate(['/home/physician/physicianlist']);
 // }
 ////#endregion

 }
