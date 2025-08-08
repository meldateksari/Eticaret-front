import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpagesSidebar } from './adminpages-sidebar';

describe('AdminpagesSidebar', () => {
  let component: AdminpagesSidebar;
  let fixture: ComponentFixture<AdminpagesSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminpagesSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpagesSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
