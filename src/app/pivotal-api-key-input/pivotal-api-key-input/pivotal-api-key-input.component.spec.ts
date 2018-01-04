import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotalApiKeyInputComponent } from './pivotal-api-key-input.component';

describe('PivotalApiKeyInputComponent', () => {
  let component: PivotalApiKeyInputComponent;
  let fixture: ComponentFixture<PivotalApiKeyInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PivotalApiKeyInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotalApiKeyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
