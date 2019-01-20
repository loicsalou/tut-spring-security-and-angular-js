import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'app-keyboard-events',
             templateUrl: './keyboard-events.component.html',
             styleUrls: [ './keyboard-events.component.css' ]
           })
export class KeyboardEventsComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  combo(idOrToString: string) {
    console.log(idOrToString);
  }

}
