import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-movies',
  template: `
    <div class="divide-y divide-slate-100">
      <app-nav>
        <app-nav-item routerLink="/new" [isActive]="true">New Releases</app-nav-item>
        <app-nav-item routerLink="/top">Top Rated</app-nav-item>
        <app-nav-item routerLink="/picks">Vincent’s Picks</app-nav-item>
      </app-nav>
      <app-list>
        <app-list-item *ngFor="let movie of movies" [movie]="movie"></app-list-item>
      </app-list>
    </div>
  `,
})

export class MoviesComponent {
  @Input() movies!: {
    image: string
    title: string
    starRating: string
    rating: string
    year: string
    genre: string
    runtime: string
    cast: string
  }[]
}
