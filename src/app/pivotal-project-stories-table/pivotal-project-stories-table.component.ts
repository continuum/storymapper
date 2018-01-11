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
    this.projects = this._pivotalDataService.projects.map(x => x);
  }

  ngOnInit() {

  }

  getProjectTags(projectId, release?) {
    //  debugger
  //   if (release) {
  //     return Object.keys(this.projects.map(projects => {
  //       console.log("asd");
  //       return projects[projectId].byTag[release];
  //     }));
  //  }

  //   return Object.keys(this.projects.map(projects => projects[projectId].byTag));


  //   if (release) {
  //     return this.projects.map(projects => {
  //       console.log("asd");
  //       return Object.keys(projects[projectId].byTag[release]);
  //     });
  //  }

  //   return this.projects.map(projects => Object.keys(projects[projectId].byTag));

    return this.projects.map(projects => projects[projectId].allTags);
  }

  getStoriesByTag(projectId, tag, release?) {
    if (release) {
       return this.projects.map(x => x[projectId])
                           .startWith([])
                           .scan((acc, projects) =>
                              acc.concat(projects.byTag[tag])
                                 .filter(st => st.story_type !== 'release'
                                            && st.release === release)
                            );
    }
    return this.projects.map(projects => projects[projectId].byTag[tag]);
  }

}
