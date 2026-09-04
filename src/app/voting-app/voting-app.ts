import { Component, inject } from '@angular/core';
import { PollStore } from '../Stores/poll.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voting-app',
  imports: [FormsModule],
  templateUrl: './voting-app.html',
  styleUrl: './voting-app.css',
})
export class VotingApp {
  newOption = '';
  store = inject(PollStore);

  addOption() {
    if (!this.newOption.trim() || this.store.options().length >= 10) return;
    this.store.addOption(this.newOption.trim());
    this.newOption = '';
  }

  getPercentage(votes: number) {
    const total = this.store.totalVotes();
    return total ? Math.round((votes / total) * 100) : 0;
  }
}
