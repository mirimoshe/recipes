import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResipeComponent } from './add-resipe.component';

describe('AddResipeComponent', () => {
  let component: AddResipeComponent;
  let fixture: ComponentFixture<AddResipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddResipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
