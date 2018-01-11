import { Component, OnInit, ViewChild } from '@angular/core';
import { PivotalAuthService } from '../../services/auth/pivotal-auth.service';
import { PivotalDataService } from '../../services/pivotal-data/pivotal-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-pivotal-api-key-input',
  templateUrl: './pivotal-api-key-input.component.html',
  styleUrls: ['./pivotal-api-key-input.component.scss']
})
export class PivotalApiKeyInputComponent implements OnInit {
  user: Observable<any> = null;
  @ViewChild('pivotalApiTokenInput') pivotalApiTokenInput;
  constructor(private _pivotalAuthService: PivotalAuthService,
              private _pivotalDataService: PivotalDataService) {
                this.user = this._pivotalDataService.user;
              }
  ngOnInit() { }

  preventDefaultSubmit(event) {
    event.preventDefault();
    return false;
  }

  submitPivotalApiKey(event) {
    event.preventDefault();
    this._pivotalAuthService
        .saveApiToken(this.pivotalApiTokenInput
                          .nativeElement
                          .value);
    this._pivotalDataService.refreshUserData();
  }

  dontSubmit(event) {
    event.preventDefault();
    return false;
  }
}
