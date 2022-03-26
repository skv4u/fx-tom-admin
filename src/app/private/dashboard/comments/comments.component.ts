import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
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
  constructor(public prodcastService: ProdcastService, public webService: WebService, public LocalStorage: LocalstorageService) { }

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
      },
      err => {
        this.prodcastService.loader = false;
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

      },
      err => {
        this.prodcastService.loader = false;
      }
    )
  }

  replyComment(i, id, comment) {
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
      },
      err => {
        this.prodcastService.loader = false;
      }
    )
  }

  createCommets() {
    this.prodcastService.loader = true;
    // console.log("commentText", this.commentText);
    let elem: any = <HTMLMapElement>document.getElementById('commenttext');
    let commentHTML = elem.innerHTML;

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
      },
      err => {
        this.prodcastService.loader = false;
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
      },
      err => {
        this.prodcastService.loader = false;
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
      },
      err => {
        this.prodcastService.loader = false;
      }
    )
  }
}
