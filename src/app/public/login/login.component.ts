import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { Router } from '@angular/router';
import { WebService } from 'src/app/shared/services/web.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    "UserName": ['', Validators.required],
    "Password": ['', Validators.required]
  });
  loginFormValid: boolean = true;
  isUserDataExists: boolean = false;
  apiCalled: boolean = false;
  constructor(public formBuilder: FormBuilder, public _localStorage: LocalstorageService, public router: Router, public webservice: WebService, public ToastService: ToastService, public prodcastService: ProdcastService) { }
  ngOnInit() {
    let UserData = this._localStorage.getUserData();
    this.isUserDataExists = UserData ? true : false;
    if (this.isUserDataExists) this.router.navigate(['/dashboard']);
  }
  login() {

    if (!this.loginForm.valid)
      this.loginFormValid = false;
    else
      this.loginFormValid = true;
    if (this.loginFormValid) {
      this.apiCalled = true;
      let req = {
        "username": this.loginForm.value.UserName,
        "password": this.loginForm.value.Password
      }
      this.webservice.commonMethod('user/login/admin', req, 'POST').subscribe(
        (data) => {
          this.apiCalled = false;
          if (data.Status == 'Success' && data.Response) {
            this._localStorage.setUserData(data.Response);
            // this.ToastService.success('Login Successfully')
            this.prodcastService.getCategoryList();
            this.prodcastService.getLanguageList();
            this.prodcastService.getWebCategoryList();
            this.prodcastService.getSpotList();
            this.router.navigate(['/dashboard']);
           
          }
          else {
            this.ToastService.error(data.Response)
          }
        })
    }

  }
}
