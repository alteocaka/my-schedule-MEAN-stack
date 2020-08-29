import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service'
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(email: string, password: string){
    this.authService.login(email, password).subscribe((res) => {
      this.router.navigateByUrl('/lists');
      console.log(res);
    })
  }

}
