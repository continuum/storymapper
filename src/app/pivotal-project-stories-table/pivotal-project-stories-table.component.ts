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
  tagsToShow: Observable<Set<string>>;
  releasesToShow: Observable<Set<string>>;
  @Input() projectId: number;

  constructor(private _pivotalDataService: PivotalDataService) {
    this.projects = this._pivotalDataService.projects;
    this.tagsToShow = this.projects.map(projects => projects[this.projectId].allTags)
                                   .scan((acc, items) => {
                                      items.forEach(x => acc.add(x));
                                      return acc;
                                    } , new Set());
    this.releasesToShow = this.projects.map(projects => projects[this.projectId].allReleases)
                                       .scan((acc, items) => {
                                         items.forEach(x => acc.add(x));
                                         return acc;
                                        }, new Set());
  }

  ngOnInit() { }

  getProjectTags(projectId, release?) {
    return this.projects.map(projects => projects[projectId].allTags);
  }

  getStoriesByTag(projectId, tag, release?) {
    if (release) {
       return this.projects.map(projectsHash => projectsHash[projectId])
                           .startWith([])
                           .scan((acc, project) =>
                              acc.concat(project.byTag[tag])
                                  .filter(st => st.story_type !== 'release'
                                        && st.release === release)
                            );
    }
    return this.projects.map(projects => projects[projectId].byTag[tag]);
  }

  releaseCheckboxesHandler(event) {

    const { value, checked } =  event.target;
    debugger;

    value ? this.addReleaseToShow(value) : this.removeReleaseToShow(value);
  }

  addReleaseToShow(releaseValue) {
    this.releasesToShow = this.releasesToShow.map((releases: Set<string>) => releases.add(releaseValue) && releases);
  }

  removeReleaseToShow(releaseValue) {
    this.releasesToShow = this.releasesToShow.map((releases: Set<string>) => releases.delete(releaseValue) && releases);
  }


}
