/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Ng2CommentsService } from './ng2-comments.service';

describe('Service: Ng2Comments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ng2CommentsService]
    });
  });

  it('should ...', inject([Ng2CommentsService], (service: Ng2CommentsService) => {
    expect(service).toBeTruthy();
  }));
});