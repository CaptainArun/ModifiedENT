import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhysicianService } from './physician.service';
import { CustomHttpService } from '../core/custom-http.service';
import { log } from 'util';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'physician-commonVisit',
  templateUrl: 'physician-commonVisit.component.html'
})

export class PhysicianCommonVisitComponent implements OnInit, OnChanges {
  //#region "property declaration"
  providerID: number;
  physicianData: any;
  profilePics: any;
  @Input() submit: any;
  //#endregion

  //#region "constructor"
  constructor(private activeroute: ActivatedRoute, private sanitizer: DomSanitizer, private customHttpSvc: CustomHttpService, private physicianSvc: PhysicianService,
    private router: Router) { }
  //#endregion

  //#region "ngOnChange"
  ngOnChanges() {
    this.physicianData = this.submit;
    if (this.submit != undefined || this.submit != null) {
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + this.submit.ProviderImage);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
    }
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.activeroute.params.subscribe(param => {
      this.providerID = param['ProviderId']
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getPhysicianById();
    this.buttonHighLight();
  }
  //#endregion

  //#region "Address navigate"
  openAddress() {
    this.router.navigate(['home/physician/physicianaddress', this.providerID]);
    this.buttonHighLight();
  }
  openSpeciality() {
    this.router.navigate(['home/physician/physicianspeciality', this.providerID]);
    this.buttonHighLight();
  }
  openSchedule() {
    this.router.navigate(['home/physician/physicianschedule', this.providerID]);
    this.buttonHighLight();
  }
  openVacation() {
    this.router.navigate(['home/physician/physicianvacation', this.providerID]);
    this.buttonHighLight();
  }
  openDiagnosis() {
    this.router.navigate(['home/physician/physiciandiagnosiscode', this.providerID]);
    this.buttonHighLight();
  }
  openProcedure() {
    this.router.navigate(['home/physician/physicianprocedurescode', this.providerID]);
    this.buttonHighLight();
  }
  //#endregion

  //#region "Physician Grid data"
  getPhysicianById() {
    this.physicianSvc.getPhysicianById(this.providerID).then(data => {
      this.physicianData = data;
      this.profilePics = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data.ProviderImage);
      this.profilePics = [this.profilePics.changingThisBreaksApplicationSecurity];
    });
    this.buttonHighLight();
  }
  //#endregion

  //#region "Button HighLight"
  buttonHighLight() {
    const path = (this.router as any).location.path();

    if (path.includes("physicianaddress")) {
      document.getElementById("Address").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("Address").style.color = "#fff";
    }
    else if (path.includes("physicianspeciality")) {
      document.getElementById("Speciality").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("Speciality").style.color = "#fff";
    }
    else if (path.includes("physicianschedule")) {
      document.getElementById("Schedule").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("Schedule").style.color = "#fff";
    }
    else if (path.includes("physicianvacation")) {
      document.getElementById("vacation").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("vacation").style.color = "#fff";
    }
    else if (path.includes("physiciandiagnosiscode")) {
      document.getElementById("Diagnosis").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("Diagnosis").style.color = "#fff";
    }
    else if (path.includes("physicianprocedurescode")) {
      document.getElementById("Procedure").style.background = "linear-gradient(to right, #58bdbd 0%, #a49ee1 100%)";
      document.getElementById("Procedure").style.color = "#fff";
    }
  }
  //#endregion

    //#region "Back"
  back() {
    this.router.navigate(['/home/physician/physicianlist']);
  }
  //#endregion
}
