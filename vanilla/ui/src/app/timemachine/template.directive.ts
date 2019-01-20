import { Directive, Input, TemplateRef } from '@angular/core';

export type TimemachineTemplate = 'header' | 'panel' | 'footer';

@Directive({
  selector: '[zasTemplate]'
})
export class TemplateDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('zasTemplate') zasTemplate: TimemachineTemplate;

  constructor(public template: TemplateRef<any>) {
  }

  getTemplateName(): TimemachineTemplate {
    return this.zasTemplate;
  }
}
