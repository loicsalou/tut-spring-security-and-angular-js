import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import { TemplateDirective } from './template.directive';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'zas-timemachine',
  templateUrl: './timemachine.component.html',
  styleUrls: [ './timemachine.component.scss' ]
})
export class TimemachineComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() items: any[] = [];
  @Input() itemStyle = {};
  @Input() glasspane = true;
  @Input() navigation = true;
  @Input() shiftSpace = 50;
  @Input() height = 300;
  @Input() width = 550;
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  @Input() throttletime = 100;
  @Input() zIndexOffset = 1021; // Oblique-ui's sticky CSS is 1020
  @Output() closed = new EventEmitter<boolean>();

  @ContentChildren(TemplateDirective) templates: QueryList<TemplateDirective>;

  wheelEvent$: Subject<WheelEvent> = new Subject();

  headerTemplate: TemplateRef<any>;
  panelTemplate: TemplateRef<any>;
  footerTemplate: TemplateRef<any>;

  currentItem = 0;
  historyItemStyles: any[] = [];
  private scaleFactor = 1;
  private wheelEventSubscription: Subscription;

  constructor() {
  }

  @HostListener('window:keydown.arrowUp', [ '$event' ]) next(event: KeyboardEvent) {
    event.preventDefault();
    this.nextItem(event);
  }

  @HostListener('window:keydown.arrowDown', [ '$event' ]) prev(event: KeyboardEvent) {
    event.preventDefault();
    this.prevItem(event);
  }

  @HostListener('window:keydown.escape', [ '$event' ]) cancel(event: KeyboardEvent) {
    event.preventDefault();
    this.closed.emit(true);
  }

  @HostListener('window:mousewheel', [ '$event' ]) wheel(event: WheelEvent) {
    event.preventDefault();
    this.wheelEvent$.next(event);
  }

  ngAfterContentInit() {
    this.templates.forEach(tpl => {
      switch (tpl.getTemplateName()) {
        case 'header':
          this.headerTemplate = tpl.template;
          break;

        case 'footer':
          this.footerTemplate = tpl.template;
          break;

        case 'panel':
          this.panelTemplate = tpl.template;
          break;

        default:
          console.log('unknown template type ' + tpl.getTemplateName());
      }
    });
  }

  ngOnInit() {
    if (!this.items) {
      this.items = [];
    }
    this.calcCssForItem(0);
    this.wheelEventSubscription = this.wheelEvent$.pipe(
      throttleTime(Math.abs(this.throttletime))
    ).subscribe((ev: WheelEvent) => this.mousewheelEvent(ev));
  }

  ngOnDestroy() {
    if (this.wheelEventSubscription) {
      this.wheelEventSubscription.unsubscribe();
    }
  }

  close() {
    this.closed.emit(true);
  }

  /**
   * active / désactive le glasspane qui masque le fond d'écran
   */
  toggleGlasspane() {
    this.glasspane = !this.glasspane;
  }

  /**
   * calcule le style de l'item, permettant l'effet 3D
   * @param ix index dans l'historique
   */
  getHistoryItemStyle(ix: number) {
    return { ...this.itemStyle, ...this.historyItemStyles[ ix ] };
  }

  /**
   * calcule le style des commandes de navigation, principalement le positionnement et le z-index pour qu'elle soit
   * toujours au premier plan
   */
  getNavigationStyle() {
    return {
      'z-index': this.zIndexOffset + 100
    };
  }

  /**
   * calcule le style général du composant, relatif à la taille
   */
  getTimeMachineStyle() {
    return {
      'width': this.width + 'px',
      'height': this.height + 'px',
      'margin-top': Math.min(this.offsetY + 22 * this.items.length, 120) + 'px'
    };
  }

  /**
   * calcule la distance de perspective de l'item
   */
  getItemsStyle() {
    return {
      'perspective': this.width + 'px'
    };
  }

  /**
   * met au premier plan l'item demandé
   * @param ix index de l'item à afficher
   */
  moveToItem(ix: number) {
    this.currentItem = ix;
    this.calcCssForItem(ix);
  }

  /**
   * passe à l'item suivant
   */
  nextItem(event: UIEvent) {
    event.stopPropagation();
    if (this.currentItem < this.items.length - 1) {
      this.currentItem++;
      this.calcCssForItem(this.currentItem);
    }
  }

  /**
   * revient à l'item précédent
   */
  prevItem(event: UIEvent) {
    event.stopPropagation();
    if (this.currentItem > 0) {
      this.currentItem--;
      this.calcCssForItem(this.currentItem);
    }
  }

  /**
   * agrandit le panel courant
   */
  resetZoomItem(event: MouseEvent) {
    event.stopPropagation();
    this.scaleFactor /= 1.1;
    this.zoom();
  }

  /**
   * agrandit le panel courant
   */
  zoomItem(event: MouseEvent) {
    event.stopPropagation();
    this.scaleFactor = this.scaleFactor * 1.1;
    this.zoom();
  }

  /**
   * gestion des touches de navigation dans les items affichés pour aller en avant ou en arrière
   * @param event contient les informations sur la touche utilisée
   */
  keyDown(event: KeyboardEvent) {
    if (event.code === 'ArrowUp') {
      event.preventDefault();
      this.nextItem(event);
    } else if (event.code === 'ArrowDown') {
      event.preventDefault();
      this.prevItem(event);
    }
  }

  private calcCssForItem(start: number) {
    this.historyItemStyles = [];
    const siz = this.items.length;
    let ix = 0;
    this.items.forEach(item => {
      const opacity = ix < start ? 0 : 1;
      const zindex = ix < start ? 0 : (this.zIndexOffset + siz - ix);
      const offsetX = (ix - start) * -this.shiftSpace;
      const offsetY = ix < start ? 0 : this.calcYOffset(ix - start);
      const styles = {
        width: this.width + 'px',
        opacity: opacity,
        'z-index': zindex,
        transform: 'translate3d(' + (-offsetX / 2) + 'px, ' + offsetY + 'px, ' + offsetX + 'px)'
      };
      if (ix + 1 < start) {
        styles[ 'display' ] = 'none';
      }
      this.historyItemStyles.push(styles);
      ix++;
    });
  }

  /**
   * gestion de la roulette de la souris
   * @param ev contient les informations reçues de la roulette
   */
  private mousewheelEvent(ev: WheelEvent) {
    // compatibilité IE: le deltaY n'existe pas, on calcule le delta autrement
    const delta = Math.max(-1, Math.min(1, (ev['wheelDelta'] || -ev.detail)));
    if (delta >= 0) {
      if (ev.ctrlKey) {
        this.scaleFactor *= 1.1;
        this.zoom();
      } else {
        this.nextItem(ev);
      }
    } else {
      if (ev.ctrlKey) {
        this.scaleFactor /= 1.1;
        this.zoom();
      } else {
        this.prevItem(ev);
      }
    }
  }

  /**
   * calcule l'offset vertical entre le panel de rang rank et le précédent
   * @param number rang pour lequel on calcule l'offset
   */
  private calcYOffset(rank: number) {
    if (rank < 0) {
      return 0;
    }
    return rank === 0 ? -this.shiftSpace : this.calcYOffset(rank - 1) - Math.pow(.8, rank) * this.shiftSpace;
  }

  private zoom() {
    if (this.scaleFactor > 2) {
      this.scaleFactor = 2;
    }
    if (this.scaleFactor < 0.5) {
      this.scaleFactor = 0.5;
    }
    const newScaleCss = { ...this.historyItemStyles };
    newScaleCss[ this.currentItem ] = {
      ...newScaleCss[ this.currentItem ],
      transform: 'scale(' + this.scaleFactor + ')'
    };

    this.historyItemStyles = newScaleCss;
  }
}
