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
    this.user = this._pivotalDataService.user;
                  //  .map(userData => JSON.stringify(userData));

  }

  dontSubmit(event) {
    event.preventDefault();
    return false;
  }

  // fetchProjectStories(event, projectId) {
  //  // debugger
  //   event.preventDefault();
  //   const self = this;
  //   console.log("PROJECT ID " + projectId);

  //  // let stors: any = "asd";
  //   this.subscriptions.push(
  //     this._pivotalDataService.getProjectStories(projectId)
  //         .map((stories: Array<any>) => stories)
  //         .subscribe((stories: Array<any>) => {
  //         //  debugger

  //           // TODO: Fix many redundant iterations...
  //           self.projects = {...self.projects,
  //                            ...{ [projectId]: {
  //                                     byTag: self.groupStoriesByTag(stories),
  //                                     allReleases: stories.filter(st => st.story_type === 'release').map(st => st.name) ,
  //                                     allTags: Array.from(self.getTagList(stories))
  //                                   }
  //                               }
  //                           };
  //           console.log("self.projects");
  //           console.log(self.projects);
  //           // console.log("by tag");
  //           //  console.log(self.groupStoriesByTag(stories));
  //         })
  //   );
  // }

  // fetchProjectLabels(projectId) {
  //   this._pivotalDataService.getProjectLabels(projectId);
  // }

  groupStoriesByReleaseAndLabel(stories: Array<any>) {
    console.log("STORIES ARE => ");
    console.log(stories);
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
    console.log("stories by release and label");
    console.log(storiesByReleaseAndLabel);
    return storiesByReleaseAndLabel;
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

  // chunkByRelease(stories, startIndex, releaseIndex, result = []) {
  //   if(stories.length < startIndex) { return result; }

  //   result.push(stories.slice(startIndex, releaseIndex));
  //   chunkByRelease(stories, releaseIndex, )
  // }

  // filterByIndex(_, index) {
  //   return index < releaseIndex;
  // }

  range(length, startOffset) {
    return Array.apply({ length }).map((_, i) => startOffset + i);
  }

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

  getKeys(hash, _) {
// debugger
    return Object.keys(hash) || [];
  }

  // getTags(storiesObject) {
  //   return Object.keys(storiesObject);
  // }

  getProjectTags(projectId, release?) {
    //  debugger
    if (release) { return Object.keys(this.projects[projectId].byTag[release]); }
    return Object.keys(this.projects[projectId].byTag);
  }

  getProjectReleases(projectId) {
    // debugger;
   if (!this.projects[projectId]) { return []; }
   return Object.keys(this.projects[projectId].byTag);
  }

  // getReleaseTags(projectId) {
  //  // debugger
  //   const releases = this.projects[projectId];
  //   return Object.keys(releases).map(releaseName => {

  //   }, releases);
  // }

  getStoriesByTag(projectId, tag, release?) {
    //
     debugger
    if (release) { return this.projects[projectId].byTag[tag].filter(story => story.release === release); }
    return this.projects[projectId].byTag[tag];
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
