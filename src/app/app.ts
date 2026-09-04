import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Stopwatch } from './stopwatch/stopwatch';
import { Quiz } from './quiz/quiz';
import { PasswordGenerator } from './password-generator/password-generator';
import { ChatUI } from './chat-ui/chat-ui';
import { GithubUserSearchUI } from './github-user-search-ui/github-user-search-ui';
import { VotingApp } from './voting-app/voting-app';
import { NotesApp } from './notes-app/notes-app';
import { MiniCartSystem } from './mini-cart-system/mini-cart-system';
import { TrafficSignal } from './traffic-signal/traffic-signal';

@Component({
  selector: 'app-root',
  imports: [Stopwatch, Quiz, PasswordGenerator, ChatUI, GithubUserSearchUI, VotingApp, NotesApp, MiniCartSystem, TrafficSignal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Angular-Portfolio');
}
