import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NewPatientService } from '../newPatient.service';
import { CustomHttpService } from '../../core/custom-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-patient-demographic',
  templateUrl: './patient-demographic.component.html',
  styleUrls: ['./patient-demographic.component.css']
})
export class PatientDemographicComponent implements OnInit, OnChanges  {
 @Input() PatID: any;
 demographicVal: any = {};
  profilePics: any;
  constructor(public demographicser: NewPatientService,private sanitizer: DomSanitizer
    , public customHttp: CustomHttpService, public router: Router, public activateRoute: ActivatedRoute) { }
 ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));   
  }
  ngOnChanges() {    
    this.getPatientDemographic();
  }
  getPatientDemographic() {
    this.demographicser.getPatientDemographic(this.PatID).then(res => {
      this.demographicVal = res   ;
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + res.PatientImage);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];   
    })
  }
}
