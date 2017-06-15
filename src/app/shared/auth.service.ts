import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  constructor(private as: AngularFireAuth) { }

  login(e:string, p:string){
      return this.as.auth.signInWithEmailAndPassword(e,p);
  }

  logout(){
    this.as.auth.signOut(); 
  }

  connectionState() {
    return this.as.authState;
  }

  getUid():string {
    return this.as.auth.currentUser.uid
  }
}
