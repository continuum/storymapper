import {PivotalAuthService} from '../services/auth/pivotal-auth.service';
import {PivotalDataService} from '../services/pivotal-data/pivotal-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-pivotal-project-list',
  templateUrl: './pivotal-project-list.component.html',
  styleUrls: ['./pivotal-project-list.component.scss']
})
export class PivotalProjectListComponent implements OnInit {
  user: Observable<any> = null;
  projects: any = null;
  private subscriptions: Subscription[] = [];

  constructor(private _pivotalAuthService: PivotalAuthService,
              private _pivotalDataService: PivotalDataService) {
              }

  ngOnInit() {
    this.user = this._pivotalDataService.user;
    this.projects = this._pivotalDataService.projects.map(x =>  x);
  }



  dontSubmit(event) {
    event.preventDefault();
    return false;
  }

  fetchProjectStories(event, projectId) {
    event.preventDefault();
    this._pivotalDataService.getProjectStories(projectId);
  }

  // fetchProjectStories(event, projectId) {
  //  // debugger
  //   event.preventDefault();
  //   const self = this;
  //   consolse.log("PROJECT ID " + projectId);

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

  // groupStoriesByReleaseAndLabel(stories: Array<any>) {
  //   console.log("STORIES ARE => ");
  //   console.log(stories);
  //   // Stories from pivotal come stored in the order they are in, so
  //   // if you have
  //   // story1,
  //   // story2,
  //   // story3,
  //   // story4,
  //   // someRelease
  //   // so in this case we assume that stories (1...4) belong to someRelease
  //   const releasesWithIndex = stories.reduce((acc, story, index) => {
  //                             // If a story is a release, return it with its index
  //                             // among all of the stories.
  //                             return story.story_type === 'release' ? acc.push({...story, index}) && acc : acc;
  //   }                         , []);

  //   const storiesByReleaseAndLabel = releasesWithIndex
  //                                     .map(rel => [rel.index, rel.name])
  //                                     .reduce((acc, elem, arrayIndex, array) => {
  //                                       // Then loop over all of the stories and
  //                                       // put the ones with indexes below (someRelease)
  //                                       // in a key with someReleases.name
  //                                       // then, group those stories by label.
  //                                       const [releaseIndex, releaseName] = elem;
  //                                       const previousReleaseIndex = arrayIndex > 0 ? array[arrayIndex - 1][0] : 0;
  //                                       acc[releaseName] = stories.slice(previousReleaseIndex, releaseIndex)
  //                                                                 .reduce(this.groupByLabel.bind(this), {});
  //                                       return acc;
  //                                     }, {});
  //   console.log("stories by release and label");
  //   console.log(storiesByReleaseAndLabel);
  //   return storiesByReleaseAndLabel;
  // }

//   groupStoriesByTag(stories: Array<any>) {
//     // const tags = stories.
// //    const tags =

//     // For each story, add a key noting the Release it belongs to
//     const storiesWithReleaseName = stories.reduce((acc, story, index) => {
//         // If a story is a release, return it with its index
//         // among all of the stories.
//         return story.story_type === 'release' ? acc.push({...story, index}) && acc : acc;
//       }, [])
//       .map(rel => [rel.index, rel.name])
//       .reduce((acc, elem, arrayIndex, array) => {
//         // Then loop over all of the stories and
//         // put the ones with indexes below (someRelease)
//         // in a key with someReleases.name
//         // then, group those stories by label.
//         const [releaseIndex, releaseName] = elem;
//         const previousReleaseIndex = arrayIndex > 0 ? array[arrayIndex - 1][0] : 0;
//         const storiesWithRelease = stories.slice(previousReleaseIndex, releaseIndex)
//                                           .map(story => {
//                                             story["release"] = releaseName;
//                                             return story;
//                                           });
//         return acc.concat(storiesWithRelease);
//       }, []);

//     const tagList = this.getTagList(stories);

//     console.log("TAGSLISTS");
//     console.log(tagList);
//     // debugger
//     const storiesWithNoTag = stories.filter(story => story.labels.length === 0);

//     const storiesByTag = Array.from(tagList).reduce((acc, tag) => {
//       const storiesWithTag = stories.filter(story => new Set(story.labels.map(l => l.name)).has(tag));
//       if (acc[`${tag}`]) { return acc[`${tag}`].push(storiesWithTag) && acc; }
//       acc[`${tag}`] = storiesWithTag;
//       return acc;
//     }, {});

//     console.log("STORIES BY TAG");
//     console.log(storiesByTag);




//     return storiesByTag;
//  }

  // getTagList(stories) {
  //   return stories.reduce((tags, story) => {
  //     if (story.labels.length === 0) {
  //       story.labels.push({ name: "No tag" });
  //       tags.add("No tag");
  //     }
  //     story.labels.forEach(label => tags.add(label.name));
  //     return tags;
  //   }, new Set());
  // }

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

  // getProjectTags(projectId, release?) {
  //   //  debugger
  //   if (release) { return Object.keys(this.projects[projectId].byTag[release]); }
  //   return Object.keys(this.projects[projectId].byTag);
  // }

  getProjectReleases(projectId) {
   // debugger;
   if (!this.projects[projectId]) { console.log("proyecto " + projectId + "vacio"); return []; }
   return Object.keys(this.projects[projectId].byTag);
  }

  // getReleaseTags(projectId) {
  //  // debugger
  //   const releases = this.projects[projectId];
  //   return Object.keys(releases).map(releaseName => {

  //   }, releases);
  // }

  getStoriesByTag(projectId, tag, release?) {
    // debugger
    if (release) { return this.projects[projectId].byTag[tag].filter(story => story.release === release); }
    return this.projects[projectId].byTag[tag];
  }


}
