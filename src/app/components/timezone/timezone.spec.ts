import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timezone } from './timezone';

describe('Timezone', () => {
  let component: Timezone;
  let fixture: ComponentFixture<Timezone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timezone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timezone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
