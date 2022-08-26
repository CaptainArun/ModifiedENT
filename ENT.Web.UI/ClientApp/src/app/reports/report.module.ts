import { NgModule } from "@angular/core";
import { ReportHomeComponent } from './report-home.component';
import { ReportRoutingModule } from './report.routing.module';
import { ReportService } from './report.service';

@NgModule({
  imports: [
    ReportRoutingModule
  ],
  declarations: [
    ReportHomeComponent
  ],
  providers: [ReportService]
})
export class ReportModule { }
