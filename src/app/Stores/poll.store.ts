import { computed, Inject, Injectable, signal } from "@angular/core";

export interface Option {
    id: number;
    text: string;
    votes: number;
}

@Injectable({ providedIn: 'root' })

export class PollStore {
    private _options = signal<Option[]>([]);

    options = this._options.asReadonly();

    addOption(text: string) {
        const newOption: Option = {
            id: Date.now(),
            text,
            votes: 0
        };
        this._options.update(o => [...o, newOption]);
    }

    vote(id: number) {
        this._options.update(options =>
            options.map(o =>
                o.id === id ? { ...o, votes: o.votes + 1 } : o
            )
        )
    }

    totalVotes = computed(() =>
        this._options().reduce((sum, o) => sum + o.votes, 0)
    );
}