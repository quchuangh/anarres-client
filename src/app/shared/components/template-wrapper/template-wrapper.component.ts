import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'template-wrapper',
  templateUrl: './template-wrapper.component.html',
  styleUrls: ['./template-wrapper.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateWrapperComponent implements OnInit {
  @Input() wrap: 'bottom' | 'top' | 'both' = 'bottom';
  @Input() template!: TemplateRef<{}>;

  constructor() {}

  ngOnInit(): void {}
}
