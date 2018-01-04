import { Injectable } from '@angular/core';
import { PivotalAuthService } from '../auth/pivotal-auth.service';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PivotalDataService {
  private _pivotalApiToken = '';
  private PIVOTAL_API_URL = 'https://www.pivotaltracker.com/services/v5/';

  /*
    In this case, it'd be a good idea to make Projects an Observable that is
    scanned when each project's stories are fetched (so they are more detailed)
  */


  constructor(private _pivotalAuthService: PivotalAuthService,
              private _http: HttpClient) {
    this._pivotalApiToken = this._pivotalAuthService.getApiToken();
  }



  setHeaders() {
    return new HttpHeaders().set('X-TrackerToken', this._pivotalApiToken);
  }

  getUser() {
    return this._http
               .get(`${this.PIVOTAL_API_URL}/me`, { headers: this.setHeaders() })
               .publishReplay(1)
               .refCount();

  }

  doSomethingWithTheToken() {
    console.log(this._pivotalApiToken);
  }

  getProjectStories(projectId: Number) {
    const storiesUrl = `${this.PIVOTAL_API_URL}projects/${projectId}/stories/?limit=1000`;
    return this._http.get(storiesUrl, { headers: this.setHeaders() })
               .publishReplay(1)
               .refCount();
  }

  getProjectLabels(projectId: Number) {
    const labelsUrl = `https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels/`;
    return this._http.get(labelsUrl, {headers: this.setHeaders() })
               .publishReplay(1)
               .refCount();
  }

  refreshApiToken() {
    this._pivotalApiToken = this._pivotalAuthService.getApiToken();
  }

}
