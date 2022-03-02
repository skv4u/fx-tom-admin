import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    "UserName":['',Validators.required],
    "Password":['',Validators.required]
  });
  loginFormValid: boolean = true;
  isUserDataExists:boolean=false;
  constructor(public formBuilder: FormBuilder,public _localStorage:LocalstorageService,public router:Router) {   }
  ngOnInit() {
   let UserData = this._localStorage.getUserData();
  this.isUserDataExists = UserData ? true : false;
  if(this.isUserDataExists) this.router.navigate(['/dashboard']);
  }
  login(){
    if (!this.loginForm.valid) 
      this.loginFormValid = false;
     else 
      this.loginFormValid = true;
    if(this.loginFormValid)
    this.router.navigate(['/dashboard']);
    
  }
}
