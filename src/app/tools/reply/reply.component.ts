import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  comments: Comment [] = [] 
  constructor(@Inject(MAT_DIALOG_DATA) private postID : string) { }

  ngOnInit(): void {
    this.getComments();
  }

  isCommentCreator(comment: Comment){
    return comment.creatorID == AppComponent.getUserDocument().userID;

  }

  getComments(){
    this.firestore.listenToCollection(
      {
        name: "Post Comments",
        path: ["Posts", this.postID,"PostComments"],
        where: [new OrderBy("timestamp", "asc")],
        onUpdate: (result) => {
          result.docChanges().forEach(
            postCommentDoc => {
              if (postCommentDoc.type == "added") {
                this.comments.unshift(<Comment>postCommentDoc.doc.data());
              }
            }
          )
        }
      }
    );
  }
  onSendClick(commentInput:HTMLInputElement){
    if(!(commentInput.value.length >0 )) return;
    this.firestore.create(
      {
        path:["Posts", this.postID,"PostComments"],
        data: {
          comment :commentInput.value,
          creatorID: AppComponent.getUserDocument().userID,
          creatorName:AppComponent.getUserDocument().publicName,
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete:(docID) => {
          commentInput.value = "";
        }
      }
    )

  }


}

export interface Comment{
  creatorID: string;
  creatorName: string;
  comment: string;
  timestamp: firebase.default.firestore.Timestamp;
}
