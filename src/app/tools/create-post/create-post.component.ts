import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: File;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();

  constructor(private dialog: MatDialogRef<CreatePostComponent>) { }

  ngOnInit(): void {
  }

  onPostClick(captionInput:HTMLTextAreaElement){
    let caption = captionInput.value;
    if(caption.length<=0) return;
    if (this.selectedImageFile){
      this.uploadVideoPost(caption);
    }
    else {
      this.uploadPost(caption);
    }
  }

  uploadVideoPost(caption: string){
    let postID = this.firestore.genDocId()
    this.storage.upload(
      {
        uploadName:"upload Video Post",
        path: ["Posts",postID,"video"],
        data: {
          data: this.selectedImageFile
        },
        onComplete: (downloadUrl) => {
          this.firestore.create(
            {
              path:["Posts", postID],
              data: {
                caption: caption,
                creatorID: this.auth.getAuth().currentUser?.uid,
                imageUrl: downloadUrl,
                timestamp: FirebaseTSApp.getFirestoreTimestamp()
              },
              onComplete: (docID) => {
                this.dialog.close();
              }
            }
          )
        }
      }
    )

  }

  uploadPost(caption: string){
    this.firestore.create(
      {
        path:["Posts"],
        data: {
          caption: caption,
          creatorID: this.auth.getAuth().currentUser?.uid,
          timestamp: FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete: (docID) => {
          this.dialog.close();
        }
      }
    )
  }

  onPhotoSelected(photoSelector: HTMLInputElement){
    this.selectedImageFile = photoSelector.files[0];
    if (!this.selectedImageFile) return;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener("loadend",
    ev => {
      let readableString = fileReader.result?.toString();
      let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
      postPreviewImage.src = readableString;
    })
  }

}
