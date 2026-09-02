import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      answer: 'Paris'
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
      answer: 'Jupiter'
    },
    {
      question: 'What is the chemical symbol for gold?',
      options: ['Au', 'Ag', 'Fe', 'Hg'],
      answer: 'Au'
    }
  ];

  currentIndex = signal(0);
  score = signal(0);
  finished = signal(false);
  
  currentQuestion = () => this.questions[this.currentIndex()];

  answer(option: string) {
    if (option === this.currentQuestion().answer) {
      this.score.update(s => s + 1);

    }

    if (this.currentIndex() < this.questions.length - 1) {
      this.currentIndex.update(i => i + 1);
    } else {
      this.finished.set(true);
    }
  }

  reset() {
    this.currentIndex.set(0);
    this.score.set(0);
    this.finished.set(false);
  }
}
