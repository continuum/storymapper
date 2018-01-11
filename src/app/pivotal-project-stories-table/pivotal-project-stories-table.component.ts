import { Component, OnInit, Input } from '@angular/core';
import { PivotalDataService } from '../services/pivotal-data/pivotal-data.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-pivotal-project-stories-table',
  templateUrl: './pivotal-project-stories-table.component.html',
  styleUrls: ['./pivotal-project-stories-table.component.scss']
})
export class PivotalProjectStoriesTableComponent implements OnInit {
  projects;
  @Input() projectId: number;

  constructor(private _pivotalDataService: PivotalDataService) {
    this.projects = this._pivotalDataService.projects;
  }

  ngOnInit() { }

  getProjectTags(projectId, release?) {
    return this.projects.map(projects => projects[projectId].allTags);
  }

  getStoriesByTag(projectId, tag, release?) {
    if (release) {
       return this.projects.map(x => x[projectId])
                           .startWith([])
                           .scan((acc, project) =>
                              acc.concat(project.byTag[tag])
                                 .filter(st => st.story_type !== 'release'
                                            && st.release === release)
                            );
    }
    return this.projects.map(projects => projects[projectId].byTag[tag]);
  }

}
