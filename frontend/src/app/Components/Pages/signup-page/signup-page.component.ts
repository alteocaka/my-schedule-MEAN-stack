import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignup(email: string, password: string){
    this.authService.signup(email, password).subscribe((res) => {
      console.log(res);
    });
  }

}
