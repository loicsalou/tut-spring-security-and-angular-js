import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, filter, scan, take, takeUntil} from 'rxjs/operators';
import {ComboOptions} from './combo-options';
import {SequenceOptions} from './sequence-options';

@Directive({
             selector: '[sequence]'
           })
export class KeyboardEventsSequenceDirective {
  private static DEFAULT_COMBO_OPTIONS: ComboOptions = {
    id: undefined,
    ctrl: false,
    alt: false,
    shift: false,
    scope: 'tag',
    code: undefined
  };
  private static OMITTED_PATTERN = new RegExp(/^(Control|Shift|Alt)/);
  @Input() sequence: SequenceOptions;
  @Output() onSequence: EventEmitter<string> = new EventEmitter<string>();
  private destroyed$ = new Subject<void>();
  private keydownEvents = new Subject<KeyboardEvent>();
  private hovered = false;

  constructor() {
  }

  ngOnInit() {
    this.sequence = {
      ...KeyboardEventsSequenceDirective.DEFAULT_COMBO_OPTIONS,
      ...this.sequence
    };
    this.captureSequence(this.keydownEvents, this.sequence);
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

  mapToChar(code: string): any {
    if (code.startsWith('Key')) {
      return code.substr(3, 1);
    } else if (code.startsWith('Digit')) {
      return code.substr(5, 1);
    } else {
      return ''; // caractère ignoré
    }
  }

  private captureSequence(eventSource: Subject<KeyboardEvent>, specialKeys: SequenceOptions, maxWait = 300) {
    this.keydownEvents.pipe(
      takeUntil(this.destroyed$),
      filter(event => event.ctrlKey === specialKeys.ctrl && event.altKey === specialKeys.alt
        && event.shiftKey === specialKeys.shift),
      filter(event => specialKeys.scope === 'tag' ? this.hovered : true),
      filter(event => {
        const ret = !KeyboardEventsSequenceDirective.OMITTED_PATTERN.test(event.code);
        return ret;
      }),
      scan((events: KeyboardEvent[], event: KeyboardEvent) => {
        events.push(event);
        return events;
      }, []),
      debounceTime(maxWait),
      take(1)
    ).subscribe(
      (combo: KeyboardEvent[]) => {
        this.processCombo(combo);
      },
      err => console.error(err),
      () => {
        this.captureSequence(eventSource, specialKeys, maxWait);
      }
    );
  }

  private processCombo(combo: KeyboardEvent[]) {
    const result = combo
      .map((event: KeyboardEvent) => event.code)
      .reduce((acc: string, eventKey: string) => {
        if (KeyboardEventsSequenceDirective.OMITTED_PATTERN.test(eventKey)) {
          return acc;
        }
        return acc + this.mapToChar(eventKey);
      }, '');
    this.onSequence.emit(result);
  }
}
