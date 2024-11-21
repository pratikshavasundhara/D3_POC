import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDirectedTreeComponent } from './force-directed-tree.component';

describe('ForceDirectedTreeComponent', () => {
  let component: ForceDirectedTreeComponent;
  let fixture: ComponentFixture<ForceDirectedTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForceDirectedTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForceDirectedTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
