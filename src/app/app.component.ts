import { Component } from '@angular/core';
import { PivotalDataService } from './services/pivotal-data/pivotal-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  user: Observable<any>;

  constructor(private _pivotalDataService: PivotalDataService) {
    this.user = this._pivotalDataService.user;
  }
}
