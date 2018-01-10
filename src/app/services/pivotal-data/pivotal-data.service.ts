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

@Injectable()
export class PivotalDataService {
  private _pivotalApiToken = '';
  private PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5/';
  private _user: Observable<any>;
  private _projects: any;
  private _projectsScanner: Subject<any> = new Subject<any>();
  /*
    In this case, it'd be a good idea to make Projects an Observable that is
    scanned when each project's stories are fetched (so they are more detailed)
  */
  constructor(private _pivotalAuthService: PivotalAuthService,
              private _http: HttpClient) {

    const emptyProjectsHash = {};



    this._pivotalApiToken = this._pivotalAuthService.getApiToken();
    this._user = this.fetchUserData();
    this._projects = this._projectsScanner.startWith(emptyProjectsHash)
                                          .scan((projectsAccumulator, project) => {
                                            // console.log("projectScanner");
                                            // console.log(project);
                                            return { ...projectsAccumulator, ...project };
                                          })
                                          .publishReplay(1)
                                          .refCount();
  }


  setHeaders() {
    return new HttpHeaders().set('X-TrackerToken', this._pivotalApiToken);
  }

  // fetchProjectData(projectId: number) {
  //   return this._http
  //              .get(`${this.PIVOTAL_API_URL}/`)
  // }

  fetchUserData() {
    const headers = this.setHeaders();
    return this._http
                .get(`${this.PIVOTAL_API_URL}/me`, { headers })
                .publishReplay(1)
                .refCount();
  }

  get user() {
    return this._user;
  }

  get projects() {
    return this._projects;
  }

  refreshUser(): void {
    this._user = this.fetchUserData();
  }

  doSomethingWithTheToken() {
    console.log(this._pivotalApiToken);
  }

  getProjectStories(projectId: Number) {
    const storiesUrl = `${this.PIVOTAL_API_URL}projects/${projectId}/stories/?limit=1000`;
    const self = this;
    return this._http.get(storiesUrl, { headers: this.setHeaders() })
               .map(self.transformStoriesIntoProject.bind(self, projectId))
               .subscribe((project: object) => { return self._projectsScanner.next(project); });
               //.unsubscribe();
  }

  // getProjectLabels(projectId: Number) {
  //   const labelsUrl = `https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels/`;
  //   return this._http.get(labelsUrl, {headers: this.setHeaders() })
  //              .publishReplay(1)
  //              .refCount();
  // }

  transformStoriesIntoProject(projectId: number, stories: any) {
    return {
      [projectId]: {
        byTag: this.groupStoriesByTag(stories),
        allReleases: stories.filter(st => st.story_type === 'release').map(st => st.name),
        allTags: Array.from(this.getTagList(stories))
      }
    };
  }

  groupStoriesByTag(stories: Array<any>) {
    // const tags = stories.
//    const tags =

    // For each story, add a key noting the Release it belongs to
    const storiesWithReleaseName = stories.reduce((acc, story, index) => {
        // If a story is a release, return it with its index
        // among all of the stories.
        return story.story_type === 'release' ? acc.push({...story, index}) && acc : acc;
      }, [])
      .map(rel => [rel.index, rel.name])
      .reduce((acc, elem, arrayIndex, array) => {
        // Then loop over all of the stories and
        // put the ones with indexes below (someRelease)
        // in a key with someReleases.name
        // then, group those stories by label.
        const [releaseIndex, releaseName] = elem;
        const previousReleaseIndex = arrayIndex > 0 ? array[arrayIndex - 1][0] : 0;
        const storiesWithRelease = stories.slice(previousReleaseIndex, releaseIndex)
                                          .map(story => {
                                            story["release"] = releaseName;
                                            return story;
                                          });
        return acc.concat(storiesWithRelease);
      }, []);

    const tagList = this.getTagList(stories);

    console.log("TAGSLISTS");
    console.log(tagList);
    // debugger
    const storiesWithNoTag = stories.filter(story => story.labels.length === 0);

    const storiesByTag = Array.from(tagList).reduce((acc, tag) => {
      const storiesWithTag = stories.filter(story => new Set(story.labels.map(l => l.name)).has(tag));
      if (acc[`${tag}`]) { return acc[`${tag}`].push(storiesWithTag) && acc; }
      acc[`${tag}`] = storiesWithTag;
      return acc;
    }, {});

    console.log("STORIES BY TAG");
    console.log(storiesByTag);




    return storiesByTag;
  }

  getTagList(stories) {
    return stories.reduce((tags, story) => {
      if (story.labels.length === 0) {
        story.labels.push({ name: "No tag" });
        tags.add("No tag");
      }
      story.labels.forEach(label => tags.add(label.name));
      return tags;
    }, new Set());
  }

  refreshApiToken() {
    this._pivotalApiToken = this._pivotalAuthService.getApiToken();
  }

}
