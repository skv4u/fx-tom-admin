import { Component, OnInit, Renderer2 } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-rj-approval',
  templateUrl: './rj-approval.component.html',
  styleUrls: ['./rj-approval.component.scss']
})
export class RjApprovalComponent implements OnInit {
  showStatus:boolean=false;
  RJList:any=[];
  currentIndex:number=0;
  isProgressing:boolean=false;
  IsEdit:boolean=false;

  registerForm: FormGroup;
  isregisterFormValid : boolean = true;
  country: string = '';
  state: string = '';
  countryList: any[] = [];
  stateList: any[] = [];
  isProgessing: boolean = false;
  reasonforEdit: string = '';
  pictureFileName: string = '';
  isPersonalInformationOpen: boolean = false;
  isdisplayinformationOpen: boolean = false;
  MINIMUM_AGE: number = 13;
  MAXIMUM_AGE: number = 100;
  isindividual: boolean = false;
  ISD: string = '';
  RJList1:any=[];
  editData:any;
  showConfirmPopup:boolean=false;
  status:string="";
  serachvalue: string = '';
  statusList:any=["Approved","Rejected","Blocked"]
  constructor(public prodcastService:ProdcastService,public webService:WebService,public toast:ToastService, public fb: FormBuilder,public _localStorage:LocalstorageService,public _commonService:CommonService,public render:Renderer2) { }

  ngOnInit() {
    this.getRjApprovalsList();
    this.prodcastService.getUserStatistics();
  }
  getRjApprovalsList(){
    this.prodcastService.loader=true;
    this.webService.commonMethod('user/list/admin','' , 'GET').subscribe(
      (data) => {
        this.prodcastService.loader=false;
        this.RJList = data.Response;
        for(let a of this.RJList){
          a.StatusCode=a.approval_status.toLowerCase();
          a.ShowStatus = false;
        }
        this.RJList1=this.RJList
      }, err => {
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      })
  }

  searchList(data:any) {
    let temp = this.RJList1.filter(x => JSON.stringify(x).toLowerCase().includes(data.toLowerCase()));
    this.RJList = temp;
  }
  showPopup(i,status){
    if(this.RJList[i].approval_status == 'Blocked' && status == 'Rejected'){
      this.toast.error('User is Blocked');
      return;
    }
    this.currentIndex = i;
    this.status = status;
    this.showConfirmPopup = true;
  }
  getApproveStatus(){
    // if(this.RJList[this.currentIndex].approval_status == 'Approved'){
    //   this.toast.error('User Already Approved')
    //   return;
    // }
    this.prodcastService.loader=true;
    let req={
    "user_id":this.RJList[this.currentIndex].id ,
    "approval_status": this.status,
    "created_by":"Admin"
    }   
    this.webService.commonMethod('user/approve/admin',req , 'PUT').subscribe(
      (data) => {
        this.prodcastService.loader=false;
        this.showConfirmPopup = false;
       if(data.Status == 'Success' && data.Response){
        this.RJList[this.currentIndex].approval_status = this.status;
        this.RJList[this.currentIndex].StatusCode = this.status.toLowerCase();
         this.toast.success('Status Updated Sucessfully');
         this.prodcastService.getRjStatistics();
         
       }
       else{
         this.toast.error('invalid data');         
       }
      // },err=>{
      }, err => {
        this.prodcastService.loader=false;
        this.showConfirmPopup = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }
  getRJDetails(a){
    this.prodcastService.loader=true;
    this.editData={};
    this.initdata();
    this.webService.commonMethod('user/view/'+ a.id,'', "GET").subscribe(
      data => {
        console.log(data)
        if(data.Status == 'Success' && data.Response){
          this.editData = data.Response;
          this.isPersonalInformationOpen = true;
         this.country =this.editData.country;
         this.state =this.editData.state;
         this.ISD = this.editData.isd ? this.editData.isd : "+91";
         this.pictureFileName = this.editData.profile_image;
          this.registerForm = this.fb.group({
            fullname: [this.editData.fullname, [Validators.required]],
            username: [this.editData.username, [Validators.required]],
            usertype: 'RJ',
            dob: [this.editData.dob, [Validators.required]],
            isd:this.editData.isd,
            phone: [this.editData.phone, [Validators.required,Validators.minLength(10),Validators.maxLength(10),this._commonService.customNumber]],
            email: [this.editData.email, [Validators.required,this._commonService.customEmail, Validators.maxLength(60)]],
            profile_image:this.editData.profile_image,
            podcaster_type: this.editData.podcaster_type,//this.editData.podcaster_type == 'individual' ? 'Individual' : "Organization",
            podcaster_value:this.editData.podcaster_value,
            address1:this.editData.address1,
            address2:this.editData.address2,
            address3:this.editData.address3,
            aboutme:this.editData.aboutme,
            twitter:this.editData.twitter,
            facebook:this.editData.facebook,
            snapchat:this.editData.snapchat,
            blogger:this.editData.blogger,
            telegram:this.editData.telegram,
            linkedin:this.editData.linkedin
          })
          this.getCountryList();
          this.isindividual = this.registerForm.value.podcaster_type == 'Individual' ? true : false;
          this.IsEdit=true;
          this.prodcastService.loader=false;
        }
      })
  }
  initdata(){
    this.prodcastService.loader=true;
    this.pictureFileName='';
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      usertype: 'RJ',
      dob: ['', [Validators.required]],
      isd:this.editData.isd,
      phone: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),this._commonService.customNumber]],
      email: [this.editData.email, [Validators.required,this._commonService.customEmail, Validators.maxLength(60)]],
      profile_image:'',
      podcaster_type: this.editData.podcaster_type,//this.editData.podcaster_type == 'individual' ? 'Individual' : "Organization",
      podcaster_value:'',
      address1:'',
      address2:'',
      address3:'',
      aboutme:'',
      twitter:'',
      facebook:'',
      snapchat:'',
      blogger:'',
      telegram:'',
      linkedin:''
    })
    this.prodcastService.loader=false;
  }
  updateProfile() {
    this.prodcastService.loader=true;
    if (!this.registerForm.valid) { 
      this.isProgessing = false;
      this.isregisterFormValid = false;
      return
    } else {
      let req = {
          "id": this.editData.id,
          "fullname": this.registerForm.value.fullname,
          "username":  this.registerForm.value.username,
          "dob": this.registerForm.value.dob,
          "isd": this.ISD,
          "phone": this.registerForm.value.phone,
          "email": this.registerForm.value.email,
          "profile_image": this.pictureFileName,
          "podcaster_type": this.registerForm.value.podcaster_type,
          "podcaster_value": this.registerForm.value.podcaster_value,
          "address1": this.registerForm.value.address1,
          "address2": this.registerForm.value.address2,
          "address3": this.registerForm.value.address3,
          "country": this.country,
          "state": this.state,
          "usertype":this.registerForm.value.usertype,
          "note_description": this.reasonforEdit,
          "created_by": this._localStorage.getUserData().username,
          "aboutme": this.registerForm.value.aboutme,
          "twitter": this.registerForm.value.twitter,
          "facebook": this.registerForm.value.facebook,
          "snapchat": this.registerForm.value.snapchat,
          "blogger": this.registerForm.value.blogger,
          "telegram": this.registerForm.value.telegram,
          "linkedin": this.registerForm.value.linkedin
        //   }
      }
      this.webService.commonMethod('user/update', req, "PUT").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
            this.prodcastService.loader=false;
            this.toast.success('Updated Successfully');
            this.getRjApprovalsList()
            this.IsEdit=false;
            }else {
             this.toast.error(data.Response);
            }
        }
      )
    }
  }
  getCountryList(){
    this.prodcastService.loader=true;
    this.webService.commonMethod('country', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.countryList = data.Response;
          // let selectedcountry=this.countryList.filter(x => x.name == this.country);
         // this.country = selectedcountry[0].id;
          this. getStateList(this.country);
          this.prodcastService.loader=false;
        }
      }
    )
  }

  getStateList(countryname){
    let id=this.getCountryId()
    this.stateList = [];
    this.webService.commonMethod('country/state/' + id, '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.stateList = data.Response;
          this.state = this.state ? this.state : this.stateList[0].name;
        }
      }
    )
  }
  
  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    if (this.webService.validImageList().indexOf(file.type) == -1) {
      this.toast.error("Invalid image");
      return
    }
    this.prodcastService.loader=true;
    console.log(file, "element");
    if(file.type.indexOf('image') == -1){
      this.toast.error("Invalid image");
      return
   }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.isProgessing = true;
    this.webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
      if (data.type === HttpEventType.Response) {
        this.pictureFileName = data.body.Response
        this.editData.profile_image = data.body.Response
        this.registerForm.value.profile_image = data.body.Response
        this.prodcastService.loader=false;
        this.prodcastService.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodcastService.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodcastService.loader = false;
        this.pictureFileName = "";
        this.prodcastService.loaderMessage = "Uploading...";
      });
    //}
    //  else {
    //    this.toast.error('not a Audio File')
    //  }


  }

  removeFile(){
    this.prodcastService.loader=true;
    let req = {
        filename : this.pictureFileName
    }
    this.isProgessing = true;
    this.webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.prodcastService.loader=false;
        this.pictureFileName = '';
      },err => {
        this.pictureFileName = '';
        this.prodcastService.loader=false;
      });
  }

  getpodcastdisable(){
    if(this.registerForm.value.podcaster_type == 'individual'){
      this.isindividual = true;
     this.registerForm.get("podcaster_value").setValue(' ');
    }else{
      this.isindividual = false;
    }
  }
  validation() {
    let diff = new Date().getFullYear() - new Date(this.registerForm.value.dob).getFullYear();
    if ((this.MAXIMUM_AGE < diff) || (this.MINIMUM_AGE > diff)) {
      this.toast.error("Invalid date of birth");
      return
    }

  }
  getCountryId() {
    let id = '';
    for (let a of this.countryList) {
      if (a.name == this.country) {
        id = a.id;
        break;
      }
    }
    return id
  }

  private cancelClick: Function;
  handleClick($event: any) {
    console.log("unbind")
    let target = $event.target.classList.contains('outsideclick') ||
                    $event.target.parentNode.classList.contains('outsideclick')
      if (target || target == null) return;
    this.showStatus=false;
    this.RJList[this.currentIndex].ShowStatus = false;
    this.cancelClick();    
  }
  bindSingleClickEvent(){
    if(this.cancelClick) this.cancelClick();
    this.cancelClick = this.render.listen('document', 'click',
    ($event: any) => this.handleClick($event));
  }
}