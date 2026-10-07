import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RrhhLayout } from './rrhh-layout';

describe('RrhhLayout', () => {
  let component: RrhhLayout;
  let fixture: ComponentFixture<RrhhLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RrhhLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(RrhhLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
