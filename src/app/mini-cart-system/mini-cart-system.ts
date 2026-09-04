import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-mini-cart-system',
  imports: [],
  templateUrl: './mini-cart-system.html',
  styleUrl: './mini-cart-system.css',
})
export class MiniCartSystem {

  private STORAGE_KEY = 'cart_data';

  constructor() {
    effect(() => {
      const value = this.cart();


      if (typeof localStorage !== 'undefined' && localStorage.setItem) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
      }
    })
  }

  loadCart(): any[] {
    if (typeof localStorage === 'undefined' || !localStorage.getItem) return [];

    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  products = [
    { id: 1, name: 'Shirt', price: 50 },
    { id: 2, name: 'Shoes', price: 150 },
    { id: 3, name: 'Pants', price: 30 }
  ]

  cart = signal<any[]>(this.loadCart());

  addToCart(product: any) {
    if (this.cart().length >= 10) return;
    this.cart.update(c => [...c, product]);
  }

  removeFromCart(index: number) {
    this.cart.update(c => c.filter((_,i) => i !== index))
  }

  count = computed(() => this.cart().length);
  total = computed(() => this.cart().reduce((acc,item) => acc+item.price, 0));
}
