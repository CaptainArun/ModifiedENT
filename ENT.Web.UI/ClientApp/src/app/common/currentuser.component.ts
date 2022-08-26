import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-currentuser',
  templateUrl: './currentuser.component.html'  
})

export class CurrentuserComponent implements OnInit {

  @Input() loginUserName: string="My Name";
  constructor(private router: Router) { }

  ngOnInit() {  
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
