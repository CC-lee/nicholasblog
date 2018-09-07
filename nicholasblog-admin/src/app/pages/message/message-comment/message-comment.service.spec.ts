/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MessageCommentService } from './message-comment.service';

describe('Service: MessageComment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageCommentService]
    });
  });

  it('should ...', inject([MessageCommentService], (service: MessageCommentService) => {
    expect(service).toBeTruthy();
  }));
});