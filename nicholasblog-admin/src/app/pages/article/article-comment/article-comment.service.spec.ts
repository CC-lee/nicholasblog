/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArticleCommentService } from './article-comment.service';

describe('Service: ArticleComment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleCommentService]
    });
  });

  it('should ...', inject([ArticleCommentService], (service: ArticleCommentService) => {
    expect(service).toBeTruthy();
  }));
});