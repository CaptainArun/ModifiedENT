import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-imageCropComponent',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.css']
})

export class imageCropComponent {

  //#region Property Declaration
  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  //#endregion Property Declaration

  //#region constructor   

  constructor(private dialogRef: MatDialogRef<imageCropComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  //#endregion constructor

  //#region 
  upload() {

    fetch(this.croppedImage).then(res => res.blob()).then(myBlob => {

      const myFile = new File([myBlob], 'image.png', {
        type: myBlob.type,
      });

      this.data = this.data ? this.data : "profile";
      const formData = new FormData();
      formData.append('file', myFile, this.data + '.png');

      const result = {
        "formData": formData, "image": this.croppedImage
      }
      this.dialogRef.close(result);
    })
  }

  //#region "To close the Pop up"

  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion 

}
