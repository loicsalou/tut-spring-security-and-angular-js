import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardEventsComponent } from './keyboard-events.component';

describe('KeyboardEventsComponent', () => {
  let component: KeyboardEventsComponent;
  let fixture: ComponentFixture<KeyboardEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
