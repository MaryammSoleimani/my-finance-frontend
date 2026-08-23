import { Component, OnInit } from '@angular/core';
import { Assets } from './assets/assets';
import { CashFlow } from "./cash-flow/cash-flow";
import { Events } from "./events/events";
@Component({
  selector: 'app-plans',
  imports: [Assets, CashFlow, Events],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans implements OnInit{
  username: string = '';

  ngOnInit() {
    const storedUser = localStorage.getItem('username');
    this.username = storedUser ? storedUser : 'Guest';
  }
}
