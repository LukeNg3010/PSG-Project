import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  auth = new FirebaseTSAuth();
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isSignedIn() && !this.auth.getAuth().currentUser?.emailVerified){
      this.auth.sendVerificationEmail();
    }
    else {
      this.router.navigate([""]);
    }


  }

  onResendClick(){
this.auth.sendVerificationEmail();
  }
}
