import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Stopwatch } from './stopwatch/stopwatch';
import { Quiz } from './quiz/quiz';
import { PasswordGenerator } from './password-generator/password-generator';
import { ChatUI } from './chat-ui/chat-ui';
import { GithubUserSearchUI } from './github-user-search-ui/github-user-search-ui';

@Component({
  selector: 'app-root',
  imports: [Stopwatch, Quiz, PasswordGenerator, ChatUI, GithubUserSearchUI],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Angular-Portfolio');
}
