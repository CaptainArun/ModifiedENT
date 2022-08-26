import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomHttpService } from 'src/app/core/custom-http.service';

@Component({
  selector: 'e-prescription-print',
  templateUrl: './e-prescription-print.component.html',
  styleUrls: ['./e-prescription-print.component.css']
})
export class EPrescriptionPrintComponent implements OnInit {
  medicationsItemsList: any;
  tenantLogo: any;
  signPic: any;

  constructor(private dialogRef: MatDialogRef<EPrescriptionPrintComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer, public customHttp: CustomHttpService) { }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getEPrescriptonPreview();
    this.setTenantLogo();
    this.setSignature();
  }

  getEPrescriptonPreview() {
    this.medicationsItemsList = this.data.medicationItems;
  }

  setTenantLogo() {
    this.tenantLogo = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + this.data.TenantLogo);
    this.tenantLogo = [this.tenantLogo.changingThisBreaksApplicationSecurity];
  }

  setSignature() {
    this.signPic = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + this.data.signatureImage);
    this.signPic = [this.signPic.changingThisBreaksApplicationSecurity];
  }

  printPage() {
    window.print();
  }

  close() {
    this.dialogRef.close();
  }

}
