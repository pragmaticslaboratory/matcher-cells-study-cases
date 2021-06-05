import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit{
  public innerWidth: any;
  @HostListener('window:resize', ['$event'])

  ngOnInit(){
    this.onResize(0);
  }

  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}
