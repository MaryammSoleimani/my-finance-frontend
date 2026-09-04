import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../services/assistant.service';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css'
})
export class ChatBot implements OnInit {
  @Input() isOpen: boolean = false;
  messages: Message[] = [];
  inputMessage: string = '';
  isLoading: boolean = false;

  constructor(private assistantService: AssistantService) {}

  ngOnInit() {

    this.messages.push({
      text: 'Hello! I am your financial assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    });
  }

  sendMessage() {
    if (!this.inputMessage.trim()) return;

    this.messages.push({
      text: this.inputMessage,
      sender: 'user',
      timestamp: new Date()
    });

    const userMessage = this.inputMessage;
    this.inputMessage = '';
    this.isLoading = true;

    this.assistantService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.response,
          sender: 'assistant',
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messages.push({
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'assistant',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }


  closeChat() {
    this.isOpen = false;
  }


  openChat() {
    this.isOpen = true;
  }
}
