import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewManage } from './review-manage';

describe('ReviewManage', () => {
  let component: ReviewManage;
  let fixture: ComponentFixture<ReviewManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewManage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewManage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
