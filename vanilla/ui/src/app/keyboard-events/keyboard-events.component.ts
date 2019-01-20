import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'app-keyboard-events',
             templateUrl: './keyboard-events.component.html',
             styleUrls: [ './keyboard-events.component.scss' ]
           })
export class KeyboardEventsComponent implements OnInit {

  lastSequence = undefined;
  lastCombo1 = undefined;
  lastCombo2 = undefined;
  lastComboAngular: string;

  histoData: string[] = [ 'donnée historique 1', 'donnée historique 2', 'donnée historique 3', 'donnée historique 4', 'donnée historique 5', 'donnée historique 6', 'donnée historique 7', 'donnée historique 8', 'donnée historique 9', 'donnée historique 10' ];
  showHisto = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggleHistory() {
    this.showHisto = !this.showHisto;
  }

  comboAngular(event: KeyboardEvent) {
    this.lastComboAngular = event.code;
    setTimeout(() => this.lastComboAngular = undefined, 2000);
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
