import { Component } from '@angular/core';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LukeProject';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument;
 
  constructor(private loginSheet: MatBottomSheet, private router: Router){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
            
         
            },
            whenSignedOut: user => {
              AppComponent.userDocument = null;
              

            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"])
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            },
            whenChanged: user => {}
          }
        )
      }
    )
  }

  public static getUserDocument(){
    return AppComponent.userDocument;

  }

  getUsername(){
      return AppComponent.userDocument.publicName;
    } 

  getUserProfile(){
    this.firestore.listenToDocument(
      {
        name:"Getting Document",
        path:["Users",this.auth.getAuth().currentUser.uid],
        onUpdate: (result) => {
          AppComponent.userDocument = <UserDocument>result.data()
          this.userHasProfile = result.exists
          AppComponent.userDocument.userID = this.auth.getAuth().currentUser.uid;
          if(this.userHasProfile){
          this.router.navigate(["postfeed"]);
        }
        }
      }
    );
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLogoutClick(){
    this.auth.signOut();
  }
  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent)

  }

  
  }

  export interface UserDocument {
    publicName: string;
    description: string;
    userID: string;
}
