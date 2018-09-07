import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, OnChanges } from '@angular/core';

import { Grid } from '../../../lib/grid';
import { DataSource } from '../../../lib/data-source/data-source';

import { Router } from '@angular/router';

@Component({
  selector: '[ng2-st-add-button]',
  template: `
    <a *ngIf="isActionAdd" href="#" class="ng2-smart-action ng2-smart-action-add-add"
        [innerHTML]="addNewButtonContent" (click)="onAdd($event)"></a>
  `,
})
export class AddButtonComponent implements AfterViewInit, OnChanges {

  @Input() grid: Grid;
  @Input() source: DataSource;
  @Output() create = new EventEmitter<any>();

  isActionAdd: boolean;
  addNewButtonContent: string;
  addlink: string;

  constructor(
    private ref: ElementRef,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.ref.nativeElement.classList.add('ng2-smart-actions-title', 'ng2-smart-actions-title-add');
  }

  ngOnChanges() {
    this.isActionAdd = this.grid.getSetting('actions.add');
    this.addNewButtonContent = this.grid.getSetting('add.addButtonContent');
    this.addlink = this.grid.getSetting('add.addurl');
  }

  onAdd(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.grid.getSetting('mode') === 'external') {
      this.create.emit({
        source: this.source,
      });
    } else {
      this.grid.createFormShown = true;
    }
    this.router.navigate([this.addlink]);
  }
}
