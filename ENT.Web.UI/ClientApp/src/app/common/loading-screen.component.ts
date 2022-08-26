import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingScreenService } from './loading-screen.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.style.css']
})

export class LoadingScreenComponent implements OnInit {

  constructor(private loadSvc: LoadingScreenService) { }

  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  isLoadingImg: Subject<boolean> = this.loadSvc.isLoadingImg;

  ngOnInit() {
  }

}
