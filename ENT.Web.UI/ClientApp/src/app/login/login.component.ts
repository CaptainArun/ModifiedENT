import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from './models/login.model';
import { AuthService } from '../core/auth.service';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../core/custom-http.service';
import { first, finalize } from 'rxjs/operators';
// import { AccountService, AlertService } from '../_services';
import { UtilService } from '../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { EmployeeDatabaseComponent } from '../dashboard/employeeDatabase.component';
import { signUpComponent } from './signUp/signUp.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginModel: Login = new Login();
  loading = false;
  submitted = false;
  erroMessage: string = '';
  public showPassword: boolean = false;
  wrongPassword: boolean = false;

  form: FormGroup;

  constructor(private fb: FormBuilder, private util: UtilService, private route: ActivatedRoute, private router: Router, private authSvc: AuthService, private dialog: MatDialog, private customHttpSvc: CustomHttpService, private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({

      UserName: [this.loginModel.UserName, Validators.required],
      Password: [this.loginModel.Password, Validators.required],

    })
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.loginForm.controls; }

  onforgotpassword() {
    this.submitted = true;


    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.util.showMessage("error!!", "not an image format , please choose an image format", BMSMessageBoxColorMode.Danger, BMSMessageBoxMode.MessageBox);

  }


  onSubmit() {

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.loginModel = this.loginForm.value;
      this.authSvc.authendicate(this.loginModel).then(res => {
        if (res.Status === 0) {
          localStorage.setItem('token', res.Result.token);
          localStorage.setItem('LoggedinUser', this.loginModel.UserName);

          this.openDatabase();
        }
        else {
          this.loginErrorHandler(res);
        }
      }
      )
        .catch(
          err => this.loginErrorHandler(err)
        );

    }
    this.loading = false;

  }

  openDatabase() {
    this.authSvc.getUserModels().then(data => {
      let TenantdataCount = data;
      if (TenantdataCount.length === 1) {
        this.onSelectDatabase(TenantdataCount[0]);
      }
      else {
        this.openTenentPopUp();
      }
    });
  }

  onSelectDatabase(dbDetails: any) {
    localStorage.setItem('DBdetails', JSON.stringify(dbDetails));
    localStorage.setItem('DatabaseName', dbDetails.Tenantdbname);
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.router.navigate(['/home/dashboard/employee']);
  }
  openTenentPopUp() {
    const dialogRef = this.dialog.open(EmployeeDatabaseComponent, {
      height: '500px',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  loginErrorHandler(status: any) {
    this.erroMessage = status.Message;
    this.submitted = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;

  }
  SignUp() {
    const dialogRef = this.dialog.open(signUpComponent, {
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // submitDoctorAuthentication() { }

  //submitAuthentication() {

  //  this.router.navigate(['/home/dashboard/employee']);
  //}
  //submitDoctorAuthentication() {
  //  this.router.navigate(['/home/dashboard/doctor']);
  //}

  // forgetPassword() {
  //  this.router.navigate(['forgetpassword']);
  // }

  //openDatabase() {
  //    const dialogRef = this.dialog.open(EmployeeDatabaseComponent, {
  //      height: '1000px',
  //      width: '1000px',
  //    });
  //}

}
