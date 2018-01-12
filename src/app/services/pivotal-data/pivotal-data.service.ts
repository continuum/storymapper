import { Injectable } from '@angular/core';
import { PivotalAuthService } from '../auth/pivotal-auth.service';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

// import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
// import { Observer } from 'rxjs/Observer';



@Injectable()
export class PivotalDataService {
  private _pivotalApiToken = '';
  private PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5/';
  private _user: Subject<any> = null;
  private _projects: any;
  private _projectsScanner: Subject<any> = new Subject<any>();
  /*
    In this case, it'd be a good idea to make Projects an Observable that is
    scanned when each project's stories are fetched (so they are more detailed)
  */
  constructor(private _pivotalAuthService: PivotalAuthService,
              private _http: HttpClient) {
    this._user = new Subject<any>().publishReplay(1)
                                   .refCount() as Subject<any>;

    const emptyProjectsHash = {};
    this.fetchUserData();
    this._projects = this._projectsScanner
                         .startWith(emptyProjectsHash)
                         .scan((projects, project) => ({ ...projects, ...project }))
                         .publishReplay(1)
                         .refCount();
  }


  setHeaders() {
    const pivotalToken = this._pivotalAuthService.getApiToken() || "";
    return new HttpHeaders().set('X-TrackerToken', pivotalToken);
  }


  refreshUserData() {
    console.log("refreshing user data");
    this.fetchUserData();
  }

  fetchUserData() {
    this._http.get(`${this.PIVOTAL_API_URL}/me`, { headers: this.setHeaders() })
              .catch(e => {
                console.log(e);
                return Observable.of(null);
              })
              .subscribe(this._user);
  }

  get user() {
    return this._user;
  }

  get projects() {
    return this._projects;
  }


  getProjectStories(projectId: Number) {
    const storiesUrl = `${this.PIVOTAL_API_URL}projects/${projectId}/stories/?limit=1000`;
    return this._http.get(storiesUrl, { headers: this.setHeaders() })
               .map(this.transformStoriesIntoProject.bind(this, projectId))
               .subscribe((project: object) => this._projectsScanner.next(project));
  }

  transformStoriesIntoProject(projectId: number, stories: any) {
    const storiesWithDefaultReleases = stories.concat(this.defaultReleases());
    return {
      [projectId]: {
        byTag: this.groupStoriesByTag(storiesWithDefaultReleases),
        allReleases: storiesWithDefaultReleases.filter(st => st.story_type === 'release').map(st => st.name),
        allTags: Array.from(this.getTagList(storiesWithDefaultReleases))
      }
    };
  }

  groupStoriesByTag(stories: Array<any>) {
    // For each story, add a key noting the Release it belongs to
    const storiesWithReleaseName = this.addReleaseNameToStories(stories);

    const tagList = this.getTagList(storiesWithReleaseName);
    // const storiesWithNoTag = stories.filter(story => story.labels.length === 0);

    const storiesByTag = Array.from(tagList).reduce((acc, tag) => {
      const storiesWithTag = storiesWithReleaseName.filter(story => new Set(story.labels.map(l => l.name)).has(tag));
      if (acc[`${tag}`]) { return acc[`${tag}`].push(storiesWithTag) && acc; }
      acc[`${tag}`] = storiesWithTag;
      return acc;
    }, {});
    return storiesByTag;
  }


  addReleaseNameToStories(stories) {
    return stories.reduce((acc, story, index) => {
                    // If a story is a release, return it with its index
                    // among all of the stories.
                    return story.story_type === 'release' ? acc.push({...story, index}) && acc : acc;
                  }, [])
                  .map(rel => [rel.index, rel.name])
                  .reduce((acc, elem, arrayIndex, array) => {
                    // Then loop over all of the stories and
                    // put the ones with indexes below (someRelease)
                    // in a key with someReleases.name
                    const [releaseIndex, releaseName] = elem;
                   // if (releaseName === 'Sin lanzamiento planeado') debugger;
                    const previousReleaseIndex = arrayIndex > 0 ? array[arrayIndex - 1][0] : 0;
                    const storiesWithRelease =
                      stories.slice(previousReleaseIndex, releaseIndex)
                             .map(story => ({...story, release: releaseName}));
                    return acc.concat(storiesWithRelease);
                  }, []);
  }

  getTagList(stories) {
    return stories.reduce((tags, story) => {
      if (story.labels.length === 0 && story.story_type !== 'release') {
        story.labels.push({ name: "No tag" });
        tags.add("No tag");
      }
      story.labels.forEach(label => tags.add(label.name));
      return tags;
    }, new Set());
  }

  defaultReleases() {
    return [{story_type: 'release', name: 'Sin lanzamiento planeado', labels: []}
            ];
  }

}
