import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postData: PostData;
  creatorName: string;
  creatorDescription: string;
  firestore = new FirebaseTSFirestore();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCreatorInfo();
  }

  onCommentClick(){
    this.dialog.open(ReplyComponent);
  }

  getCreatorInfo(){
    this.firestore.getDocument(
      {
        path:["Users", this.postData.creatorID],
        onComplete: result => {
          let userDocument = result.data();
          this.creatorName = userDocument.publicName;
          this.creatorDescription = userDocument.description;
        }
      }
    )
  }

}
