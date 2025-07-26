import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Toast} from 'primeng/toast';
import {Header} from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('eticaret');
}
