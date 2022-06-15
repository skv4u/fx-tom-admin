import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  CommentsList: any = [];
  commentText: any;
  replycomment: string = ""
  showplayer: boolean = false;
  postCommentVisible: boolean = false;
  showConfirmPopup:boolean=false;
  popupdetails:any={
    "PopupType":"",
    "Id":0
  }
  constructor(public prodcastService: ProdcastService, public webService: WebService, public LocalStorage: LocalstorageService,public toast:ToastService) { }

  ngOnInit() {
    this.getCommentList();
  }
  getCommentList() {
    this.prodcastService.loader = true;
    let req = {
      "podcast_id": this.prodcastService.selectedData.id,
      "user_id": this.LocalStorage.getUserData().id
    };
    this.webService.commonMethod('mobuser/podcast/commentreplylist', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        this.CommentsList = data.Response;
        for (let a of this.CommentsList) {
          a.replycomment = "";
        }
        this.showplayer = true;
      // },
      // err => {
      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  LikeandHeart(id, type) {
    this.prodcastService.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id,
      "type": type,
      "created_by": this.LocalStorage.getUserData().username
    }

    this.webService.commonMethod('podcast/commentldh', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        if (data.Status == "Success" && data.Response)
          this.getCommentList();

      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  replyComment(i, id, comment) {
    if(!comment.trim().length){
      this.toast.error('Please add reply')
      return;
    }
    this.prodcastService.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id,
      "description": comment
    };
    this.webService.commonMethod('podcast/comment/reply', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        if (data.Status == 'Success' && data.Response != '') {
          this.CommentsList[i].replycomment = "";
          this.CommentsList = data.Response;
          this.getCommentList();
        }
      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  createCommets() {
    // console.log("commentText", this.commentText);
    let elem: any = <HTMLMapElement>document.getElementById('commenttext');
    let commentHTML = elem.innerHTML;
    if(!elem.innerText.trim().length){
      this.toast.error('Please add comment')
      return;
    }
    this.prodcastService.loader = true;
    let req = {
      "podcast_id": this.prodcastService.selectedData.id,
      "user_id": this.LocalStorage.getUserData().id,
      "description": commentHTML,
      "filepath": "",
      "created_by": this.LocalStorage.getUserData().username
    };
    this.webService.commonMethod('podcast/comment', req, 'POST').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        this.commentText = "";
        document.getElementById('commenttext').innerHTML = "";
        this.getCommentList();
        // this.CommentsList=data.Response;
      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }


  deleteCommets(id) {
    this.prodcastService.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id
    }
    this.webService.commonMethod('mobuser/comment', req, 'DELETE').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        if (data.Status == 'Success' && data.Response)
          this.getCommentList();
      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }
  deleteReply(id) {
    this.prodcastService.loader = true;
    let req = {
      "reply_id": id,
      "user_id": this.LocalStorage.getUserData().id
    }
    this.webService.commonMethod('mobuser/comment/reply', req, 'DELETE').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        if (data.Status == 'Success' && data.Response)
          this.getCommentList();
      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  replyldh(id, type) {
    this.prodcastService.loader = true;
    let req = {
      "reply_id": id,
      "user_id": this.LocalStorage.getUserData().id,
      "type": type,
    }
    this.webService.commonMethod('mobuser/podcast/replyldh', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        if (data.Status == "Success" && data.Response)
          this.getCommentList();
      }, err => {
        this.prodcastService.loader = false;
        if (err.status === 401) {
          this.prodcastService.TokenExpied();
        }
      }
    )
  }
  deletePopupAction(){
    this.showConfirmPopup=false;
    if(this.popupdetails.PopupType == 'comment'){
      this.deleteCommets(this.popupdetails.Id)
    }
    else{
      this.deleteReply(this.popupdetails.Id)
    }
  }
}
