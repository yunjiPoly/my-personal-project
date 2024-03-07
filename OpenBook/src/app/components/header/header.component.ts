import { catchError, take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy  } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { FEED } from './../../consts/routes.const';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  user$: Observable<firebase.default.User> = this.authService.user$;

  // "take until" pattern to replace unsubscribe observable
  // 
  destroyed$ : Subject<null> = new Subject();

  constructor(
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}
  
  
  // general We shouldn't subscribe to observables, it's not good practice
  // need to subscribe here to show snackBar when user is logged in

  // takeUntil operator: have to stream unitil this condition turns true as soon as the subject emits a value(ondestro$y hook)
  // all subscription will be as canceled as soon as subject destoyed emitted

  // error callback will cancel the call stream

  // everyone you use async pipe there will be a new subscription(resquest) to the serve
  // so we use ngif 
  login() {
    this.authService
      .loginViaGoogle()
      // every time pipe is called there will be a new subscription on the server sending a request
      // which can be an unwanted behavior
      // use ngif $user to check user is logged in then we can show become a seller button
      .pipe(takeUntil(this.destroyed$),catchError((error) => {
          this.snackBar.open(`${error.message}`, 'Close',{
            duration: 4000,
          });
          return EMPTY;
      }),
      )
      .subscribe(
        (response) =>
        // same as if(response) {this.snackBar.open}
          response &&
          this.snackBar.open(
            `Welcome to Open Book. You've successfully logged in!`,
            'Close',
            {
              duration: 4000,
            },
          ),
      );

    // this.authService
    //   .loginViaGoogle()
    //   .pipe(
    //     take(1),
    //     catchError((error) => {
    //       this.snackBar.open(`${error.message} 😢`, 'Close', {
    //         duration: 4000,
    //       });
    //       return EMPTY;
    //     }),
    //   )
    //   .subscribe(
    //     (response) => {
    //       if(response){
    //         this.snackBar.open(`ye`,''),{
    //           duration: 12312,
    //         }
    //       }
    //     }
    //   );
          
  }

  ngOnDestroy(): void {
      this.destroyed$.next(null);
      // this.destroyed$.complete(); no need to complete the subject when none is subscribed
  }
  logout() {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe((response) => {
        this.router.navigate([`/${FEED}`]);
        this.snackBar.open('Peace! glad you came!', 'Close', {
          duration: 4000,
        });
      });
  }
}
