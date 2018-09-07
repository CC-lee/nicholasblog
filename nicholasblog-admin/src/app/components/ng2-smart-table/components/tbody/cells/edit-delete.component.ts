import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import { Grid } from '../../../lib/grid';
import { Row } from '../../../lib/data-set/row';
import { DataSource } from '../../../lib/data-source/data-source';

import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CellsService } from './cells.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'ng2-st-tbody-edit-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button *ngIf="isActionEdit" id="actionsbutton" (click)="onEdit($event)" class="btn btn-xs btn-primary">
    <a [routerLink]="editlink + '/'+ row.getData()[editID]" class="ng2-smart-action ng2-smart-action-edit-edit"
        [innerHTML]="editRowButtonContent"></a></button>
    <button *ngIf="isActionRead" id="actionsbutton" (click)="onRead($event)" class = "btn btn-xs btn-primary">
    <a [href]="readlink+'/'+row.getData()[readID]" class="ng2-smart-action ng2-smart-action-read-read"
        [innerHTML]="readButtonContent" (click)="onRead($event)"></a></button>
    <button *ngIf="isActionComment" id="actionsbutton" (click)="onComment($event)" class = "btn btn-xs btn-primary">
    <a href="#" class="ng2-smart-action ng2-smart-action-comment-comment"
        [innerHTML]="commentButtonContent" (click)="onComment($event)"></a></button>
    <button *ngIf="isActionDelete" id="actionsbutton" (click)="onDelete($event)" class = "btn btn-xs btn-danger">
    <a [href]="editlink+'/'+row.getData()[readID]" class="ng2-smart-action ng2-smart-action-delete-delete"
        [innerHTML]="deleteRowButtonContent"></a></button>
  `,
})
export class TbodyEditDeleteComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() source: DataSource;
  @Input() deleteConfirm: EventEmitter<any>;
  @Input() editConfirm: EventEmitter<any>;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() read = new EventEmitter<any>();
  @Output() comment = new EventEmitter<any>();
  @Output() editRowSelect = new EventEmitter<any>();

  isActionEdit: boolean;
  isActionRead: boolean;
  isActionComment: boolean;
  isActionDelete: boolean;
  editRowButtonContent: string;
  deleteRowButtonContent: string;
  readButtonContent: string;
  commentButtonContent: string;
  editlink: string;
  deletelink: string;
  readlink: string;
  commentlink: string;
  editID: string;
  deleteID: string;
  readID: string;
  commentID: string;

  constructor(
    private router: Router,
    private http: Http,
    private cellsService: CellsService
  ) {}

  onEdit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.editRowSelect.emit(this.row);

    if (this.grid.getSetting('mode') === 'external') {
      this.edit.emit({
        data: this.row.getData(),
        source: this.source,
      });
    } else {
      this.grid.edit(this.row);
    }
    this.router.navigate([`${this.editlink}/${this.row.getData()[this.editID]}`]);
  }

  onDelete(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const id = this.row.getData()[this.deleteID];
    if (this.grid.getSetting('mode') === 'external') {
      this.delete.emit({
        data: this.row.getData(),
        source: this.source,
      });
    } else {
      this.grid.delete(this.deletelink, this.row, this.deleteConfirm);
      this.cellsService.delete(this.deletelink, id);
    }
  }

  onRead(event: any) {
    event.preventDefault();
    event.stopPropagation();
    window.open(`${this.readlink}/${this.row.getData()[this.readID]}`);
  }

  onComment(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([`${this.commentlink}/${this.row.getData()[this.commentID]}`]);
  }

  ngOnChanges() {
    this.isActionEdit = this.grid.getSetting('actions.edit');
    this.isActionRead = this.grid.getSetting('actions.read');
    this.isActionComment = this.grid.getSetting('actions.comment');
    this.isActionDelete = this.grid.getSetting('actions.delete');
    this.editRowButtonContent = this.grid.getSetting('edit.editButtonContent');
    this.deleteRowButtonContent = this.grid.getSetting('delete.deleteButtonContent');
    this.readButtonContent = this.grid.getSetting('read.readButtonContent');
    this.commentButtonContent = this.grid.getSetting('comment.commentButtonContent');
    this.editlink = this.grid.getSetting('edit.editurl');
    this.deletelink = this.grid.getSetting('delete.deleteurl');
    this.readlink = this.grid.getSetting('read.readurl');
    this.commentlink = this.grid.getSetting('comment.commenturl');
    this.editID = this.grid.getSetting('edit.idName');
    this.deleteID = this.grid.getSetting('delete.idName');
    this.readID = this.grid.getSetting('read.idName');
    this.commentID = this.grid.getSetting('comment.idName');
  }
}
