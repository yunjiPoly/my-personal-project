import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { DatabaseService } from './../../services/database.service';
import { UserPost } from 'src/app/consts/user-post';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent {
  userPosts$: Observable<Array<UserPost>> = this.databaseService.userPosts$;

  constructor(private readonly databaseService: DatabaseService) {}

  handlePurrClick(userPost: UserPost) {
    this.databaseService.updatePost(userPost).pipe(take(1)).subscribe();
  }
}