import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClient, HttpResponse } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../environments/environment';
import { error } from '@angular/compiler/src/util';
import { AppConfigModel } from './core/AppConfigModel';
import { AppSettings } from './core/AppSettingsModel';
import { Subject } from 'rxjs';

/**
  Service used to read app configuration settings from Environment files
*/

@Injectable({
  providedIn: 'root',
})

export class AppConfigService {

  public ApplicationConfig: AppConfigModel = new AppConfigModel();
  private _isLoaded: boolean = false;
  private _appConfigModel = new AppConfigModel();
  public sideNavState: Subject<boolean> = new Subject(); //Dont remove its for title show...


  constructor(private http: HttpClient) {
    this.setValue();
  }

  setValue() {
    this.http.get('assets/appsettings.json')
      .map(
        res => {
          const configData = JSON.stringify(res);
          this._appConfigModel.ApiEndPoint = JSON.parse(configData).apiEndPoint;
          this.ApplicationConfig.ApiEndPoint = JSON.parse(configData).apiEndPoint;
          this._isLoaded = true;
        }
      );
  }

}

