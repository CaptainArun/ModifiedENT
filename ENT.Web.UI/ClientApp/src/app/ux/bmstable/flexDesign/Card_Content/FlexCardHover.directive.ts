import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[HoverDataAttri]',
})
export class FlexCardHoverDirective {

  @Output() HoverdataEvent = new EventEmitter();

  constructor(private el: ElementRef, private renderer: Renderer2,) { }

  //#region - Emitting a data for cart Hover ...

  @HostListener('mouseover') mouseover() {

    let dataOfParticularobj = this.el.nativeElement.firstElementChild.innerHTML;
    if (dataOfParticularobj.includes(",")) {
      let dataOfsplit = dataOfParticularobj.split(",");
      this.HoverdataEvent.emit(dataOfsplit[0]);
    }
    else {
      this.HoverdataEvent.emit("");
    }

    this.renderer.addClass(this.el.nativeElement.childNodes[1], "tooltipx1");
  }

  @HostListener('mouseleave') mouseleave() {
    this.renderer.removeClass(this.el.nativeElement.childNodes[1],"tooltipx1");
    this.HoverdataEvent.emit("");
  }

  //#endregion
}

