import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class LoadingScreenService {

  isLoadingImg = new Subject<boolean>();

  show() {
    this.isLoadingImg.next(true);
  }

  hide() {
    this.isLoadingImg.next(false);
  }
}
