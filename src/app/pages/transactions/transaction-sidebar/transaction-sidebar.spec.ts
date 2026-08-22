import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSidebar } from './transaction-sidebar';

describe('TransactionSidebar', () => {
  let component: TransactionSidebar;
  let fixture: ComponentFixture<TransactionSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
