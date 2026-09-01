import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { AuthService } from './services/auth.services';
import { CommonModule } from '@angular/common';
import { ChatBot } from "./chat-bot/chat-bot";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ChatBot, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-finance');
  constructor(public authService: AuthService) {}
}
