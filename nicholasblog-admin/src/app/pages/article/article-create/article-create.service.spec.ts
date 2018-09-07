/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArticleCreateService } from './article-create.service';

describe('Service: ArticleCreate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleCreateService]
    });
  });

  it('should ...', inject([ArticleCreateService], (service: ArticleCreateService) => {
    expect(service).toBeTruthy();
  }));
});