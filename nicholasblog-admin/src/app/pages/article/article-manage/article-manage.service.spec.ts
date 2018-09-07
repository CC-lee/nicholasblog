/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArticleManageService } from './article-manage.service';

describe('Service: ArticleManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleManageService]
    });
  });

  it('should ...', inject([ArticleManageService], (service: ArticleManageService) => {
    expect(service).toBeTruthy();
  }));
});