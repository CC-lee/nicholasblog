/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImageEditService } from './image-edit.service';

describe('Service: ImageEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageEditService]
    });
  });

  it('should ...', inject([ImageEditService], (service: ImageEditService) => {
    expect(service).toBeTruthy();
  }));
});