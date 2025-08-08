import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './support.html',
})
export class Support {

  faqs: FAQItem[] = [
    {
      question: 'How can I check my order status?',
      answer:
        'You can view your order status and tracking information by selecting the order from your order history.',
      open: false,
    },
    {
      question: 'What is the return period and policy?',
      answer:
        'You can return products within 14 days of receiving them, provided they are unused and the tags are still attached.',
      open: false,
    },
    {
      question: 'How can I update my address information?',
      answer:
        'Go to the "Addresses" section in your account settings to edit an existing address or add a new one.',
      open: false,
    },
    {
      question: 'What payment methods can I use?',
      answer:
        'You can pay by credit card, debit card, and during certain campaigns, cash on delivery may also be available.',
      open: false,
    },
  ];



  toggleFAQ(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
