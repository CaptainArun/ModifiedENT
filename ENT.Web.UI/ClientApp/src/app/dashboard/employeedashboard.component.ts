import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog,MatSort,MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets, RadialChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

export interface PeriodicElement {
  patientName: string;
  appDate: string;
  appTime: string;
  consult: string;
  purpose: string;
  appStatus : string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {patientName: 'Mr.Rahul Sharma', appDate: '22-10-2019', appTime: "10:00 AM", consult: 'Dr.Amit Vyas', purpose: 'Tympanoplasty', appStatus: 'Scheduled'},
  {patientName: 'Mr.Amit Singh', appDate: '22-10-2019', appTime: "10:30 AM", consult: 'Dr.Amit Vyas', purpose: 'Tonsillectomy', appStatus: 'Scheduled'},
  {patientName: 'Mr.Ravi', appDate: '22-10-2019', appTime: "11:35 AM", consult: 'Dr.Amit Vyas', purpose: 'Parathyroidectomy', appStatus: 'Scheduled'},
  {patientName: 'Mrs.Meera', appDate: '24-10-2019', appTime: "10:45 AM", consult: 'Dr.Amit Vyas', purpose: 'Septoplasty', appStatus: 'Pending'},
  {patientName: 'Mr.Raj Singh', appDate: '24-10-2019', appTime: "11:20 AM", consult: 'Dr.Amit Vyas', purpose: 'Laryngoplasty', appStatus: 'Scheduled'},
  {patientName: 'Mr.Sony Bhagat', appDate: '24-10-2019 ', appTime: "11:45 AM", consult: 'Dr.Amit Vyas', purpose: 'Tympanoplasty', appStatus: 'Scheduled'},
  {patientName: 'Mr.Gupta', appDate: '24-10-2019', appTime: "11:55 AM", consult: 'Dr.Amit Vyas', purpose: 'Tonsillectomy', appStatus: 'Scheduled'},
];


@Component({
  selector: 'app-EmployeeDashboard',
  templateUrl: 'employeedashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {

  selected = 'option1';
  public show: boolean = false;
  check1() {
    this.show = !this.show;
  }

  //Bar Chart 
  public barChartOptions: ChartOptions = {

    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }], yAxes: [{
         ticks: {
              beginAtZero: true,
              max: 100,
              min: 0,
              stepSize: 10
            },
        gridLines: {
          display: false
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
  };
  public barChartLabels: Label[] = ['June', 'July', 'August', 'September', 'October'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartColors = [
    {
      backgroundColor: ['#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a'],
      borderColor: '#fff',
    },
    {
      backgroundColor: ['#ffaa80', '#ffaa80', '#ffaa80', '#ffaa80', '#ffaa80'],
      borderColor: '#fff',
    },
    {
      backgroundColor: ['#b3b3ff', '#b3b3ff', '#b3b3ff', '#b3b3ff', '#b3b3ff'],
      borderColor: '#fff',
    }
  ];


  public barChartData: ChartDataSets[] = [
    { data: [38, 48, 40, 59, 76], label: 'Confirmed' },
    { data: [18, 25, 11, 25, 43], label: 'Rescheduled' },
    { data: [3, 15, 9, 19, 22], label: 'Cancelled' }
  ];

  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {

      },
    }
  };
  public pieChartLabels: Label[] = ['Male', 'Female', 'Others'];
  public pieChartData: number[] = [350, 190, 10];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPluginsPie = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['#ffa1b5', '#86c7f3', '#ffe29a'],
    },
  ];

  // Stacked 
  public stackedBarChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
         ticks: {
              beginAtZero: true,
              max: 200,
              min: 0,
              stepSize: 20
            },
        gridLines: {
          display: false
        }
      }], yAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
      }
    },
  };
  public stackedBarChartLabels: Label[] = ['Hearing loss', 'Dizziness', 'Hoarseness', 'Ear infection', 'Tonsil or adenoid infection', 'Swimmers ear', 'Snoring', 'Sleep Apnea', 'Tinnitus', 'Nose bleeds'];
  public stackedBarChartType: ChartType = 'horizontalBar';
  public stackedBarChartLegend = true;
  public stackedBarChartPlugins = [pluginDataLabels];
  public stackBararChartColors = [
    {
      backgroundColor: ['#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5', '#ffa1b5'],
      borderColor: '#fff',
    },
    {
      backgroundColor: ['#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3', '#86c7f3'],
      borderColor: '#fff',
    },
    {
      backgroundColor: ['#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a', '#ffe29a'],
      borderColor: '#fff',
    }
  ];


  public stackedBarChartData: ChartDataSets[] = [
    { data: [28, 48, 40, 19, 76, 27, 40, 56, 12, 84], label: 'Male', stack: 'a' },
    { data: [18, 65, 71, 25, 13, 36, 20, 75, 46, 38], label: 'Female', stack: 'a' },
    { data: [3, 0, 1, 2, 0, 0, 3, 2, 0, 1], label: 'Others', stack: 'a' }
  ];

  //public show: boolean = false;

 static: boolean;
  //paginator: MatPaginator;
displayedColumns: string[] = ['appDate', 'appTime', 'patientName', 'consult', 'purpose', 'appStatus'];
dataSource = new MatTableDataSource(ELEMENT_DATA);

@ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//   @ViewChild(MatSort) sort: MatSort;
// @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

   applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 
  viewOT() {
    this.router.navigate(['/home/ot/pre-surgical-list']);
  }

  appointments() {
    this.router.navigate(['/home/appointments/AppointmentsListComponent']);
  }

  Visits() {
    this.router.navigate(['/home/visits']);
  }

  opdList() {
    this.router.navigate(['/home/opds/patientlist']);
  }
}
