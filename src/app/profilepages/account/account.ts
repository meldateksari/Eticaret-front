import {Component, ElementRef, HostListener} from '@angular/core';
import {ProfileSidebar} from '../profile-sidebar/profile-sidebar';
import {AuthService} from '../../auth/service/auth.service';
import {UserService} from '../../services/user.service';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [
    ProfileSidebar, CommonModule, RouterLink
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
  providers: [AuthService]
})
export class Account {

  isHelpOpen = false;
  constructor(private authService: AuthService,private elRef: ElementRef) {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }


  openHelp() {
    this.isHelpOpen = true;
    // Modal açılınca odağı al
    setTimeout(() => {
      const el = this.elRef.nativeElement.querySelector('#help-modal') as HTMLElement | null;
      el?.focus();
    }, 0);
  }

  closeHelp() {
    this.isHelpOpen = false;
  }

  // ESC ile kapatma
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isHelpOpen) this.closeHelp();
  }
}
