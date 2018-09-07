import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from '../../components/ng2-smart-table';
import { ClassComponent } from './class.component';
import { ClassManageComponent } from './class-manage/class-manage.component';
import { ClassManageService } from './class-manage/class-manage.service';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassCreateService } from './class-create/class-create.service';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { ClassEditService } from './class-edit/class-edit.service';
import { ClassService } from './class.service';
import { FormsModule } from '@angular/forms';
import { routing } from './class.routing';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AuthGuardService } from './auth-guard.service';
import { Autosize } from 'ng-autosize';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    Ng2SmartTableModule,
    FormsModule,
    routing,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [
    ClassComponent,
    ClassManageComponent,
    ClassCreateComponent,
    ClassEditComponent,
    Autosize
  ],
  providers: [
    ClassService,
    AuthGuardService
  ]
})
export class ClassModule { }
