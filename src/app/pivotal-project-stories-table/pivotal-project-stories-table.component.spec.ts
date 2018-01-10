import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotalProjectStoriesTableComponent } from './pivotal-project-stories-table.component';

describe('PivotalProjectStoriesTableComponent', () => {
  let component: PivotalProjectStoriesTableComponent;
  let fixture: ComponentFixture<PivotalProjectStoriesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PivotalProjectStoriesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotalProjectStoriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
