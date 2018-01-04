import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PivotalAuthService } from '../../services/auth/pivotal-auth.service';
import { PivotalDataService } from '../../services/pivotal-data/pivotal-data.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pivotal-api-key-input',
  templateUrl: './pivotal-api-key-input.component.html',
  styleUrls: ['./pivotal-api-key-input.component.scss']
})
export class PivotalApiKeyInputComponent implements OnInit, OnDestroy {
  user: Observable<any> = null;
  projects: any = null;

  storyStateStyles = {
    accepted: { color: 'green' },
    delivered: { color: 'yellow' },
    finished: { color: 'blue' },
    started:  { color: 'lightgrey' },
    rejected: { color: 'lightred' },
    unstarted: { color: 'lightblue' },
    unscheduled: { color: 'rgba(255, 255, 255, 0.8)' }
  };


  private subscriptions: Subscription[] = [];
  @ViewChild('pivotalApiTokenInput') pivotalApiTokenInput;
  constructor(private _pivotalAuthService: PivotalAuthService,
              private _pivotalDataService: PivotalDataService) {
              }

  ngOnInit() {

  }

  ngOnDestroy() {
    // https://medium.com/thecodecampus-knowledge/the-easiest-way-to-unsubscribe-from-observables-in-angular-5abde80a5ae3
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  determineStoryStyle(story) {
    switch (story.story_type) {
      case 'release':
        return { backgroundColor: 'lightblue',
                 color: 'white',
                 fontSize: '2em',
                 fontWeight: 'bold',
                 borderTop: '1px solid black',
                 borderBottom: '1px solid black',
                 paddingTop: '10px',
                 paddingBottom: '10px' };
      case 'chore':
        return { backgroundColor: 'lightgrey', color: 'black' };
      case 'feature':
        return { backgroundColor: 'yellow', color: 'black' };
      case 'bug':
        return { backgroundColor: 'lightpink', color: 'black' };
      default:
        return { backgroundColor: 'green', color: 'white' };
    }
  }

  preventDefaultSubmit(event) {
    event.preventDefault();
    return false;
  }
  submitPivotalApiKey() {
    event.preventDefault();
    this._pivotalAuthService
        .saveApiToken(this.pivotalApiTokenInput
                          .nativeElement
                          .value);
    this.user = this._pivotalDataService.getUser();
                  //  .map(userData => JSON.stringify(userData));

  }

  dontSubmit(event) {
    event.preventDefault();
    return false;
  }

  fetchProjectStories(event, projectId) {
   // debugger
    event.preventDefault();
    const self = this;
   // let stors: any = "asd";
    this.subscriptions.push(
      this._pivotalDataService.getProjectStories(projectId)
          .map((stories: Array<any>) => stories)
          .subscribe((stories: Array<any>) => {
            self.projects = {...self.projects,
                             ...{ [projectId]: {
                                     stories: self.groupStoriesByLabel(stories)
                                   }
                                }
                            };
          })
    );
  }

  fetchProjectLabels(projectId) {
    this._pivotalDataService.getProjectLabels(projectId);
  }

  groupStoriesByLabel(stories: Array<any>) {
    // Stories from pivotal come stored in the order they are in, so
    // if you have
    // story1,
    // story2,
    // story3,
    // story4,
    // someRelease
    // so in this case we assume that stories (1...4) belong to someRelease
    const releasesWithIndex = stories.reduce((acc, story, index) => {
                              // If a story is a release, return it with its index
                              // among all of the stories.
                              return story.story_type === 'release' ? acc.push({...story, index}) && acc : acc;
    }                         , []);

    const storiesByReleaseAndLabel = releasesWithIndex
                                      .map(rel => [rel.index, rel.name])
                                      .reduce((acc, elem, arrayIndex, array) => {
                                        // Then loop over all of the stories and
                                        // put the ones with indexes below (someRelease)
                                        // in a key with someReleases.name
                                        // then, group those stories by label.
                                        const [releaseIndex, releaseName] = elem;
                                        const previousReleaseIndex = arrayIndex > 0 ? array[arrayIndex - 1][0] : 0;
                                        acc[releaseName] = stories.slice(previousReleaseIndex, releaseIndex)
                                                                  .reduce(this.groupByLabel.bind(this), {});
                                        return acc;
                                      }, {});
    // const storiesByReleaseAndLabel = Object.keys(storiesByRelease).reduce((acc, keyName) => {
    //   acc[keyName] = storiesByRelease[keyName].reduce(this.byLabel.bind(this), {});
    //   return acc;
    // }, {});

    // const storiesByLabel = stories.reduce((groupedStories, currentStory) => {
    //   const currentStoryLabels = currentStory.labels.map(label => label.name);
    //   const boundInitializeOrAddToLabel = this.initializeOrAddToLabel.bind(this, groupedStories, currentStory);
    //   currentStoryLabels.forEach(boundInitializeOrAddToLabel);
    //   return groupedStories;
    // }, {});
    // uniqueLabels.reduce((accumulator, label, index, arr) => {

    // }, {});
    console.log(storiesByReleaseAndLabel);
    return storiesByReleaseAndLabel;
  }

  // chunkByRelease(stories, startIndex, releaseIndex, result = []) {
  //   if(stories.length < startIndex) { return result; }

  //   result.push(stories.slice(startIndex, releaseIndex));
  //   chunkByRelease(stories, releaseIndex, )
  // }

  // filterByIndex(_, index) {
  //   return index < releaseIndex;
  // }

  groupByLabel(groupedStories, currentStory) {
   // (groupedStories, currentStory) => {
      const currentStoryLabels = currentStory.labels.map(label => label.name);
      const boundInitializeOrAddToLabel = this.initializeOrAddToLabel.bind(this, groupedStories, currentStory);
      currentStoryLabels.forEach(boundInitializeOrAddToLabel);
      return groupedStories;
   // }
  }

  initializeOrAddToLabel(groupedStories, currentStory, label) {
    if (groupedStories[label]) {
      groupedStories[label].push(currentStory);
    } else {
      groupedStories[label] = [currentStory];
    }
  }

  getKeys(hash) {
    //debugger
    return Object.keys(hash);
  }

}


// {
//   "kind":"me",
//   "id":2904669,
//   "name":"Eugenio Lopez",
//   "initials":"EL",
//   "username":"eugeniolopez",
//   "time_zone":{
//      "kind":"time_zone",
//      "olson_name":"America/Los_Angeles",
//      "offset":"-08:00"
//   },
//   "api_token":"b9c1df34a39f7174d98e76cc58ea1e10",
//   "has_google_identity":false,
//   "accounts":[
//      {
//         "kind":"account_summary",
//         "id":1036943,
//         "name":"test_account",
//         "status":"active",
//         "days_left":28,
//         "plan":"Free"
//      }
//   ],
//   "projects":[
//      {
//         "kind":"membership_summary",
//         "id":8954441,
//         "project_id":2000791,
//         "project_name":"Premiazos v2.0",
//         "project_color":"008c8d",
//         "favorite":false,
//         "role":"member",
//         "last_viewed_at":"2017-12-21T16:00:05Z"
//      },
//      {
//         "kind":"membership_summary",
//         "id":9238953,
//         "project_id":1945151,
//         "project_name":"Totems AutoAyuda",
//         "project_color":"b800bb",
//         "favorite":false,
//         "role":"member",
//         "last_viewed_at":"2017-08-29T16:28:15Z"
//      },
//      {
//         "kind":"membership_summary",
//         "id":9238969,
//         "project_id":2096082,
//         "project_name":"Totems Fase 2",
//         "project_color":"e46642",
//         "favorite":false,
//         "role":"member",
//         "last_viewed_at":"2018-01-04T10:56:14Z"
//      },
//      {
//         "kind":"membership_summary",
//         "id":9356621,
//         "project_id":2120046,
//         "project_name":"Plataforma Interoperabilidad - Fase 2",
//         "project_color":"00a3d6",
//         "favorite":false,
//         "role":"member",
//         "last_viewed_at":"2018-01-03T17:06:32Z"
//      }
//   ],
//   "email":"eugenio.lopez@continuum.cl",
//   "receives_in_app_notifications":true,
//   "created_at":"2017-05-15T14:43:50Z",
//   "updated_at":"2018-01-04T11:12:39Z"
// }
