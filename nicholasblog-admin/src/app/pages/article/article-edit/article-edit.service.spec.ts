/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArticleEditService } from './article-edit.service';

describe('Service: ArticleEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleEditService]
    });
  });

  it('should ...', inject([ArticleEditService], (service: ArticleEditService) => {
    expect(service).toBeTruthy();
  }));
});