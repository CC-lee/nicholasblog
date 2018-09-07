/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImageCommentService } from './image-comment.service';

describe('Service: ImageComment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCommentService]
    });
  });

  it('should ...', inject([ImageCommentService], (service: ImageCommentService) => {
    expect(service).toBeTruthy();
  }));
});