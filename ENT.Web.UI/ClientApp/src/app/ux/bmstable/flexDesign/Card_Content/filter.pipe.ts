import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

//#region - Filtering data for particular property...

@Pipe({
  name: 'filter'
})
export class CardFilterPipe implements PipeTransform {

  constructor(public datepipe: DatePipe) { }

  transform(Propertyname: any, i: any, listParticularobj: any, DisplayMode: any, FormatString: any) {

    let data = listParticularobj[Propertyname]; //Getting propertyValue

    if (DisplayMode && DisplayMode != "Text") {

      if (FormatString) {
        let dt = new Date(data);
        let dateCovert = this.datepipe.transform(dt, FormatString);
        data = dateCovert;
      }
      else {
        let dt = new Date(data);
        let dateCovert = this.datepipe.transform(dt, "dd/MM/yyyy");
        data = dateCovert;
      }

    }
    
    data = (data == null || data == undefined || data == "" ) ? "---" : data;
    let fontLength = (data + "").length;
    if (fontLength! > 15) {
      let DataValue = data + "";
      let DatasliceValue = DataValue.slice(0, 15);
      let ChangedData = DatasliceValue + "...";
      return ChangedData;
    }
    else {
      return data;
    }
  }
}

//#endregion

//#region - Filtering Image for particular property...

@Pipe({
  name: 'filterimg',
})
export class CardImgFilterPipe implements PipeTransform {
  ImgFile: any;
  ImgView: any;
  constructor(private sanitizer: DomSanitizer) { }
  transform(items: any, listParticularData: any) {
    if (items.DisplayType = "Image") {
      let Propertyname = items.PropertyName;
      let particularobj = listParticularData;
      let data = particularobj[Propertyname];
      if (data != "" && data != null && data != undefined) {
        this.ImgView = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data);
        this.ImgFile = this.ImgView.changingThisBreaksApplicationSecurity;
        return this.ImgFile;
      }
      //Static no profile base64... Don't change...
      else {
        data = "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALwSURBVHgB7VrttZswDL19CzQbRJ0grxOETpAReBukG9ARugFvhG4AnSDpBKETNJ2gtQ52cQhQydjk/eCec49J8JckyxYCYMWKFVN4h7jYGB4Mnw3J/iZ7rzG82rI2PBv+xBsCT/ZoWBn+UfJkmBtuMRNzLOIE+GyvHVjTNVrNs8avXn2eMKG1WNbr79XwCxa2EgvwC51mK/vfRtEHobXGxevnYv9LDp5oidulkWE++gKV0ClFBeoNdkR8FLi1zmzf6YPQCcHlDumw640VTZhNqo4nQL0xoyyzEmFC8OC89gvLg7I9oROmxEzk6NasdDlxvQrjZwffkwq0QwSfJHQaKYRtjpAfhto+ebsPWmL+ktIMqKFUyyfohP8H8gbLlfU1ZC1vBf3vEWiVHDprlAgTROPIFQJ8xZlSYg0gXAiNlt3SrSAEeYNsBfX3mCcI81kwzsarfyf400ADt83WkEWiMQ4rydbOUfTZXh/6N4cEyWx5xnKQhu61Le8sOCQI2bKBDD8wH1dhvcaW1L8xJMim10jSuXQiY+2l1m9sKfIRV+k35PiKcGjaOoWRpPIF7c6QQQ4/QtZQek457MfaDVmkseV7yMGa+gT5cnTjZNBhdNk/jUyKQdChgVwY9okM+kQD2fLOJ6csQtCjMfxg+IJuq/RR23sfEZYtIW+c/+IF7To8YT5cgo4Q5+Dk8ITndpBUngwFHgjCROg05iO1vc7xdrC3pSrVqo40F4Db3geVO5YydecCl5nh95E6vEUTOh/wOYYrul2n8X7z9ZimefKv9pqg3CgKDDv9Dt3zSgqecB8NO2uUCABr1eV33VMZ4Tbnm4r+I3CB7jS/c3Ip/ITCDrcpzdQ84jYdlGMmSnQaKYHkAjiWiJigY4QGhLF4QcTzjPAYYXjMLSKDsKwwSYRw6L/oSekfi4RHOdJYh7fdFC+QJkGIZx0WoMCDg1RCa6GQ076C/iXqIGJ/MEBoc057TH8wwCmkb5iXfVmxYoUCfwFiO0Uja1QihgAAAABJRU5ErkJggg=="
        this.ImgView = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + data);
        this.ImgFile = this.ImgView.changingThisBreaksApplicationSecurity;
        return this.ImgFile;
      }
    }
  }
}

//#endregion

//#region -Data for hidden span full data in card...

@Pipe({
  name: 'filterHoverData'
})
export class CardfilterHoverPipe implements PipeTransform {

  constructor(public datepipe: DatePipe) { }

  transform(Propertyname: any, i: any, listParticularobj: any, DisplayMode: any, FormatString: any) {

    let data = listParticularobj[Propertyname]; //Getting propertyValue
    if (DisplayMode) {
      if (FormatString) {
        let dt = new Date(data);
        let dateCovert = this.datepipe.transform(dt, FormatString);
        data = dateCovert;
      }
      else {
        let dt = new Date(data);
        let dateCovert = this.datepipe.transform(dt, "dd/MM/yyyy");
        data = dateCovert;
      }
    }

    let fontLength = (data + "").length;
    if (fontLength! > 17) {
      let arrData = data + ",";
      return arrData;
    } else {
      return data;
    }
  }
  
}
//#endregion

//#region - [ngClass]-Filtering data for status font color in card...

@Pipe({
  name: 'filterDatacolor'
})
export class CardfilterDatacolorPipe implements PipeTransform {
  transform(Propertyname: any, ApplyStatusFontcolor: any, listParticularobj: any) {

    let data = listParticularobj[Propertyname];

    if (ApplyStatusFontcolor == "ApplyIconFont") {

      switch (data) {
        case "Requested":
          return "StatusWaitAlert fa fa-clock-o";

        case "Progress":
          return "StatusWaitAlert fa fa-clock-o";

        case "Cancelled":
          return "StatusAlert fa fa-times-circle";

        case "Started":
          return "StatusWaitAlert fa fa-hourglass-start";

        case "Pending":
          return "StatusWaitAlert fa fa-hourglass-half";

        case "Scheduled":
          return "StatusWaitAlert fa fa-calendar";

        case "Completed":
          return "StatusokAlert fa fa-check-circle";

        case "Confirmed":
          return "StatusokAlert fa fa-check-circle";

        case "Emergency":
          return "StatusAlert fa fa-exclamation-circle";

        case "General":
          return "StatusWaitAlert fa fa-plus-circle";

        case "Admitted":
          return "StatusWaitAlert fa fa-plus-circle";

        case "Rescheduled":
          return "StatusWaitAlert fa fa-calendar";

        default:
          break;

      }
    }
    else if (ApplyStatusFontcolor == "ApplyFont") {

      switch (data) {
        case "Requested":
          return "StatusFontWaitAlert";

        case "Progress":
          return "StatusFontWaitAlert";

        case "Cancelled":
          return "StatusFontAlert";

        case "Started":
          return "StatusFontWaitAlert";

        case "Pending":
          return "StatusFontWaitAlert";

        case "Scheduled":
          return "StatusFontWaitAlert";

        case "Completed":
          return "StatusFontokAlert";

        case "Confirmed":
          return "StatusFontokAlert";

        case "Emergency":
          return "StatusFontAlert";

        case "General":
          return "StatusFontWaitAlert";

        case "Admitted":
          return "StatusFontWaitAlert";

        case "urgent ":
          return "StatusFontAlert";

        case "Rescheduled":
          return "StatusFontWaitAlert";

        default:
          break;
      }

    }
  }
}

 //#endregion