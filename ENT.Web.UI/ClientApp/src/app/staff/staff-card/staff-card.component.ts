import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Inject, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

import { StaffService } from '../staff.service';
import { CustomHttpService } from '../../core/custom-http.service';

import { UtilService } from '../../core/util.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-staffcardComponent',
  templateUrl: './staff-card.component.html',
  styleUrls: ['./staff-card.component.css']
})

export class StaffCardComponent implements OnInit {

  //#region "Property Decleartion"
  staffCard: any;
  employeeId: number;
  profilePics: any;
  @Input() submit: any;
  //#endregion

  //#region "constructor"
  constructor(private activeroute: ActivatedRoute, private fb: FormBuilder, private sanitizer: DomSanitizer, public dialog: MatDialog, private util: UtilService, private customHttpSvc: CustomHttpService, private _formBuilder: FormBuilder,private staffservice: StaffService) {
  }
  //#endregion

  //#region "ng onInit"
  ngOnInit() {
    this.activeroute.params.subscribe(param => {
      this.employeeId = param['EmployeeId']
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getStaffCard();
  }
  //#endregion
  //#region "ngOnChange"
  ngOnChanges() {
    this.staffCard = this.submit;
    if (this.submit != undefined || this.submit != null) {
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + this.submit.StaffImage);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
    }
  }
  //#endregion

  //#region "Staff Card"
  getStaffCard() {
    this.staffservice.getStaffImageCard(this.employeeId).then(data => {
      this.staffCard = data;
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data.StaffImage);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
    });
  }
  //#endregion
}
