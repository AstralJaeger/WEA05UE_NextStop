import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appGravatar]'
})
export class GravatarDirective implements OnInit {

  @Input() set email(value: string) {
    this.update(value);
  }

  private readonly fallback = 'retro'

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    if (this.el) {
      this.el.nativeElement.src = '//www.gravatar.com/avatar/';
    }
  }

  async update(value: string): Promise<void> {
    if (value == null || this.el.nativeElement == null) {
      return;
    }

    const msg = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msg);
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join()
    this.el.nativeElement.src = `//www.gravatar.com/avatar/${hashHex}?d=${this.fallback}`;
  }
}
