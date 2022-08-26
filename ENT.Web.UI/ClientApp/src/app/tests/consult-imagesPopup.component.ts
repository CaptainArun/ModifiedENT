import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'consult-imagesPopupComponent',
  templateUrl: 'consult-imagesPopup.component.html'
})

export class ConsultImagesPopupComponent {
  report: boolean = false;
  image: boolean = true;
  report1: boolean = false;
  image1: boolean = true;
  // selected = 'option1';
  // disableSelect = true;

  //show1:any
  //show2:any
  // show3:any
  // show4:any

  public show1: boolean = true;
  public show2: boolean = false;
  public show3: boolean = true;
  public show4: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConsultImagesPopupComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //   img1() {
  //   this.show1 = !this.show1;
  // }

  // img2() {
  //   this.show2 = !this.show2;
  // }
  img3() {
    this.show3 = !this.show3;
    this.show4 = !this.show4;
  }
  img4() {
    this.show4 = !this.show4;
    this.show3 = !this.show3;
  }

  img1() {
    // this.show1 = !this.show2;
    this.show1 = !this.show1;
    this.show2 = !this.show2;

  }
  img2() {
    this.show2 = !this.show2;
    this.show1 = !this.show1;

  }
  openImage() {
    this.image = !this.image;
    this.report = !this.report;
  }
  openReport() {
    this.report = !this.report;
    this.image = !this.image;
  }
  openImage1() {
    this.image1 = !this.image1;
    this.report1 = !this.report1;
  }
  openReport1() {
    this.report1 = !this.report1;
    this.image1 = !this.image1;
  }
}