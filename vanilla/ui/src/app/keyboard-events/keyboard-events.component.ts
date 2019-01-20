import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'app-keyboard-events',
             templateUrl: './keyboard-events.component.html',
             styleUrls: [ './keyboard-events.component.css' ]
           })
export class KeyboardEventsComponent implements OnInit {

  lastSequence = undefined;
  lastCombo1 = undefined;
  lastCombo2 = undefined;

  constructor() {
  }

  ngOnInit() {
  }

  combo1(combo: string) {
    this.lastCombo1 = combo;
    setTimeout(() => this.lastCombo1 = undefined, 2000);
  }

  combo2(combo: string) {
    this.lastCombo2 = combo;
    setTimeout(() => this.lastCombo2 = undefined, 2000);
  }

  sequence(seq: string) {
    this.lastSequence = seq;
    setTimeout(() => this.lastSequence = undefined, 2000);
  }

}
