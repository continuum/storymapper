import { TestBed, inject } from '@angular/core/testing';

import { PivotalAuthService } from './pivotal-auth.service';

describe('PivotalAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PivotalAuthService]
    });
  });

  it('should be created', inject([PivotalAuthService], (service: PivotalAuthService) => {
    expect(service).toBeTruthy();
  }));
});
