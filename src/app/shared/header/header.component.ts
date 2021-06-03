import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {


  public innerWidth: any;
  public titulo: string;
  public tituloSubs$: Subscription;

  constructor(
    private router: Router
  ) {
    this.tituloSubs$ = this.getDataRuta()
                            .subscribe((resp) => {
                              this.titulo = resp.title;
                              document.title = `Match Cell - ${this.titulo}`;
                            });
  }

  ngOnInit(): void {
    this.onResize(0);
  }

  navigateRoute(path: string){
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getDataRuta(){
    return this.router.events
    .pipe(
      filter(event => {
        return event instanceof ActivationEnd
      }),
      filter((event: ActivationEnd)=>{
        return event.snapshot.firstChild === null
      }),
      map((event: ActivationEnd) => {
        return event.snapshot.data
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}
