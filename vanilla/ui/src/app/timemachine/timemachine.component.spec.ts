import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimemachineComponent } from './timemachine.component';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../../../testhelpers/testing.module';

describe('TimemachineComponent', () => {
  let component: TimemachineComponent;
  let fixture: ComponentFixture<TimemachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestingModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimemachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create one line only', () => {
    component.items = [ 'item1', 'item2', 'item3' ];
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const divs = fixture.debugElement.queryAll(By.css('li.item'));
    expect(divs.length).toBe(component.items.length);
  });

});
