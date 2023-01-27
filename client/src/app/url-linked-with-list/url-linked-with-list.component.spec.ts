import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlLinkedWithListComponent } from './url-linked-with-list.component';

describe('UrlLinkedWithListComponent', () => {
  let component: UrlLinkedWithListComponent;
  let fixture: ComponentFixture<UrlLinkedWithListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlLinkedWithListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlLinkedWithListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
