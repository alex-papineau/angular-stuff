import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-github-user-search-ui',
  imports: [],
  templateUrl: './github-user-search-ui.html',
  styleUrl: './github-user-search-ui.css',
})
export class GithubUserSearchUI {
  private base_url = 'https://api.github.com/users/';

  query = signal('');
  user = signal<any>(null);
  loading = signal(false);
  error = signal('');

  searchUser() {
    if (!this.query()) {
      this.error.set('Please enter a username');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.user.set(null);

    fetch(this.base_url + this.query())
      .then(response => {
        if (!response.ok) {
          throw new Error('User not found');
        }
        return response.json();
      })
      .then(data => {
        this.user.set(data);
        this.loading.set(false);
      })
      .catch(error => {
        this.error.set(error.message);
        this.loading.set(false);
      });
  }
  openProfile() {
    if (this.user()) {
      window.open(this.user().html_url, '_blank');
    }
  }
}
