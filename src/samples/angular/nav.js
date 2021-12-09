import { Component } from '@angular/core'

@Component({
  selector: 'app-nav',
  template: `
    <nav class="py-4 px-6 text-sm font-medium">
      <ul class="flex space-x-3">
        <ng-content></ng-content>
      </ul>
    </nav>
  `,
})

export class NavComponent {}
