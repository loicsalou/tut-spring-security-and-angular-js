import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, filter, scan, take, takeUntil, tap} from 'rxjs/operators';
import {ComboOptions} from './combo-options';
import {stringify} from 'querystring';

@Directive({
             selector: '[appKeyboardEvents]'
           })
export class KeyboardEventsDirective {
  private static DEFAULT_COMBO_OPTIONS: ComboOptions = {
    id: undefined,
    ctrl: false,
    alt: false,
    shift: false,
    scope: 'tag',
    code: undefined
  };
  @Input() appKeyboardEvents;
  @Input() comboOptions: ComboOptions;
  @Output() onCombo: EventEmitter<string> = new EventEmitter<string>();
  private destroyed$ = new Subject<void>();
  private keydownEvents = new Subject<KeyboardEvent>();
  private hovered = false;

  constructor() {
  }

  ngOnInit() {
    this.comboOptions = {
      ...KeyboardEventsDirective.DEFAULT_COMBO_OPTIONS,
      ...this.comboOptions
    };
    this.declareCombo(this.keydownEvents, this.comboOptions);
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  @HostListener('mouseenter', [ '$event' ])
  mouseenter(event: MouseEvent) {
    this.hovered = true;
  }

  @HostListener('mouseleave', [ '$event' ])
  mouseleave(event: MouseEvent) {
    this.hovered = false;
  }

  @HostListener('document:keydown', [ '$event' ])
  keydown(event: KeyboardEvent) {
    this.keydownEvents.next(event);
  }

  @HostListener('document:keypress', [ '$event' ])
  search(event: KeyboardEvent) {
  }

  private declareCombo(eventSource: Subject<KeyboardEvent>, specialKeys: ComboOptions, maxWait = 300) {
    this.keydownEvents.pipe(
      takeUntil(this.destroyed$),
      filter(event => {
        const ret = event.ctrlKey === specialKeys.ctrl && event.altKey === specialKeys.alt
          && event.shiftKey === specialKeys.shift && event.code === this.comboOptions.code;
        return ret;
      }),
      filter(event => {
        const ret = this.comboOptions.scope === 'tag' ? this.hovered : true;
        return ret;
      })
    ).subscribe(
      (combo: KeyboardEvent) => {
        this.onCombo.emit(this.comboOptions.id ? this.comboOptions.id : stringify(this.comboOptions));
      }
    );
  }

  private declareSequenceCombo(specialKeys = {alt: true, ctrl: true, shift: false}, maxWait = 300) {
    this.keydownEvents.pipe(
      takeUntil(this.destroyed$),
      tap(event => {
            console.log('key is "' + event.key + '". ctrl: ' + event.ctrlKey + ', alt: ' + event.altKey + ', shift: ' + event.shiftKey);
            console.log('code is "' + event.code + '"');
          }
      ),
      filter(event => event.ctrlKey === specialKeys.ctrl && event.altKey === specialKeys.alt
        && event.shiftKey === specialKeys.shift),
      tap(event => console.log('special keys OK for key=' + event.code)),
      tap(character => console.log('character is ' + character)),
      // debounceTime(maxWait),
      scan((events: KeyboardEvent[], event: KeyboardEvent) => {
        events.push(event);
        return events;
      }, []),
      debounceTime(1000),
      tap(acc => console.log('accumulater is "' + acc.join('-') + '"')),
      take(1)
    ).subscribe(
      (combo: KeyboardEvent[]) => {
        this.processCombo(combo);
      },
      err => console.error(err),
      () => {
        console.log('completed');
        //this.declareCombo(specialKeys, maxWait);
      }
    );
  }

  private processCombo(combo: KeyboardEvent[]) {
    if (combo.length === 1) {
      switch (combo[ 0 ].code) {
        case 'KeyX': {
          this.destroyed$.next();
          console.log('FIN');
          break;
        }

        default: {
          console.log('Combo reçue: ' + combo.join('-'));
        }

      }
    } else {
      const result = combo
        .map((event: KeyboardEvent) => event.key)
        .reduce((acc: string, eventKey: string) => {
          return acc + eventKey;
        }, '');
      console.log('combo is ' + result);
    }
  }
}
