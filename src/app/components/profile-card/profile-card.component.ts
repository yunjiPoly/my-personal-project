import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input() user: firebase.default.User;
  @Output() logoutClick: EventEmitter<null> = new EventEmitter<null>();

  // emit to the parent component
  // header
  logout() {
    this.logoutClick.emit();
  }
}
