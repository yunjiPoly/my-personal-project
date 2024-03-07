import { AngularFirestoreCollection, DocumentReference, AngularFirestore } from "@angular/fire/compat/firestore";
import { Injectable } from "@angular/core";
import { from, Observable } from 'rxjs';
import { UserPost } from "../consts/user-post";

// search all : ctrl shift f
@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
  private userPostsCollection: AngularFirestoreCollection<UserPost>;
  userPosts$: Observable<UserPost[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.userPostsCollection = afs.collection<UserPost>('user-posts');
    this.userPosts$ = this.userPostsCollection.valueChanges({ idField: 'id' });
  }

  addUserPost(userPost: UserPost): Observable<DocumentReference> {
    return from(this.userPostsCollection.add(userPost));
  }

  updatePost(userPost: UserPost): Observable<void> {
    return from(
      this.afs.doc<UserPost>(`user-posts/${userPost.id}`).update({
        purrs: ++userPost.purrs,
      }),
    );
  }
}
