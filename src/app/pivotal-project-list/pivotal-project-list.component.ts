import { PivotalAuthService } from '../services/auth/pivotal-auth.service';
import { PivotalDataService } from '../services/pivotal-data/pivotal-data.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-pivotal-project-list',
  templateUrl: './pivotal-project-list.component.html',
  styleUrls: ['./pivotal-project-list.component.scss']
})
export class PivotalProjectListComponent implements OnInit {
  user: Observable<any> = null;
  projects: Observable<any> = null;

  constructor(private _pivotalAuthService: PivotalAuthService,
              private _pivotalDataService: PivotalDataService) {
                this.user = this._pivotalDataService.user;
                this.projects = this._pivotalDataService.projects;
              }

  ngOnInit() { }

  fetchProjectStories(event, projectId) {
    event.preventDefault();
    this._pivotalDataService.getProjectStories(projectId);
  }
}
