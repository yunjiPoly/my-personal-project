import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
// import { catchError, filter, switchMap, takeUntil } from 'rxjs/operators';
// import { UserPost } from '../../consts/user-post';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, filter, switchMap, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FEED } from 'src/app/consts/routes.const';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { UserPost } from 'src/app/consts/user-post';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject();
  fileToUpload: File;
  jobImagePreview: string | ArrayBuffer;
  pictureForm: FormGroup;
  submitted = false;
  uploadProgress$: Observable<number>;
  user: firebase.User;

  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly storageService: StorageService,
    private readonly utilService: UtilService,
  ) {}

  ngOnInit(): void {
    this.pictureForm = this.formBuilder.group({
      photo: [null, [Validators.required, this.image.bind(this)]],
      description: [null, Validators.required],
    });
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => (this.user = user));

    this.pictureForm
      .get('photo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        this.handleFileChange(newValue.files);
      });
  }

  handleFileChange([jobImage]) {
    this.fileToUpload = jobImage;
    const reader = new FileReader();
    reader.onload = (loadEvent) => (this.jobImagePreview = loadEvent.target.result);
    reader.readAsDataURL(jobImage);
  }

  postJob() {
    this.submitted = true;
    const mediaFolderPath = `${`jobsss/media/`}/${this.user.email}/media/`;

    const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata(
      mediaFolderPath,
      this.fileToUpload,
    );

    this.uploadProgress$ = uploadProgress$;

    downloadUrl$
      .pipe(
        switchMap((photoUrl: string) => {
          const userPost: UserPost = {
            userAvatar: this.user.photoURL,
            userName: this.user.displayName,
            lastUpdated: new Date().getTime(),
            photoUrl,
            description: this.pictureForm.value.description,
            purrs: 0,
          };
          return this.databaseService.addUserPost(userPost);
        }),
        catchError((error) => {
          this.snackBar.open(`${error.message} 😢`, 'Close', {
            duration: 4000,
          });
          return of(null);
        }),
        //filter((res) => !!res),  ca changer le ordre. Il commence a post par le bas.
        takeUntil(this.destroy$),
      )
      .subscribe((downloadUrl) => {
        this.submitted = false;
        this.router.navigate([`/${FEED}`]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }

  private image(photoControl: AbstractControl): { [key: string]: boolean } | null {
    if (photoControl.value) {
      const [jobImage] = photoControl.value.files;
      return this.utilService.validateFile(jobImage)
        ? null
        : {
            image: true,
          };
    }
    return;
  }
}
