import { TestBed, inject } from '@angular/core/testing';

import { PivotalDataService } from './pivotal-data.service';

describe('PivotalDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PivotalDataService]
    });
  });

  it('should be created', inject([PivotalDataService], (service: PivotalDataService) => {
    expect(service).toBeTruthy();
  }));
});
