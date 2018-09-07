/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImageCreateService } from './image-create.service';

describe('Service: ImageCreate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCreateService]
    });
  });

  it('should ...', inject([ImageCreateService], (service: ImageCreateService) => {
    expect(service).toBeTruthy();
  }));
});