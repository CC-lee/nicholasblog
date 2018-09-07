import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { AuthGuardService } from './auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './profile.routing';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  acceptedFiles: 'image/gif,image/jpeg,image/jpg,image/png',
  createImageThumbnails: true
};
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  declarations: [ProfileComponent],
  providers: [AuthGuardService]
})
export class ProfileModule { }