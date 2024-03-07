import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { NgModule } from '@angular/core';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';

@NgModule({
  imports: [AngularFireModule.initializeApp(environment.firebase)],
})
export class AppFirebaseModule {}
