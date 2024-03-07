import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
// import { auth } from 'firebase/firebase-auth';
import firebase from 'firebase/compat/app';
// We cannot make Facebook Authentification
// because app ID needs a URL
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<
    Observable<firebase.User>
  > = new BehaviorSubject<Observable<firebase.User>>(null);

  user$ = this.user
    .asObservable()
    .pipe(switchMap((user: Observable<firebase.User>) => user));

  constructor(private afAuth: AngularFireAuth) {
    this.user.next(this.afAuth.authState);
  }

  loginViaGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
