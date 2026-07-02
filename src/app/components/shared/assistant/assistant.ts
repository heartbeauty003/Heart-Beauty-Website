import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  sender: 'assistant' | 'user';
  time?: string;
}

interface KeywordRule {
  keywords: string[];
  response: string;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant.html',
  styleUrl: './assistant.css'
})
export class Assistant implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  showChatbot: boolean = false;
  currentTime: string | null = '';
  userInput: string = '';
  isTyping: boolean = false;
  private shouldScroll = false;

  assistantMessages: ChatMessage[] = [
    { text: 'Welcome to Heart Beauty, how can I help you today?', sender: 'assistant' },
    { text: "I'm here to help 😊", sender: 'assistant' }
  ];

  suggestions = [
    'What can this assistant do?',
    'Tell me about your offerings',
    'I have an issue'
  ];

  // ── Contact / business details (single source of truth) ──────────────
  private readonly whatsappNumber = '+27 74 014 3618';
  private readonly supportEmail = 'heartbeauty003@gmail.com';
  private readonly businessHours = 'Monday–Saturday, 08:00–16:00 (Closed Sundays)';

  // ── Keyword → response rules, built directly from the Heart Beauty
  //    Customer Service policy (11 June 2026) ────────────────────────────
  private rules: KeywordRule[] = [
    {
      keywords: ['what can you do', 'what can this assistant do', 'help me with', 'what do you do'],
      response:
        "I'm your Heart Beauty virtual assistant 🌸 I can help you:\n\n" +
        '• Find the right wig, bundle, closure or frontal\n' +
        '• Walk you through how to order\n' +
        '• Explain payment steps\n' +
        '• Share delivery info\n' +
        '• Explain our free membership perks\n' +
        '• Connect you with our team\n\n' +
        "What would you like help with today?"
    },
    {
      keywords: ['order', 'how do i buy', 'how to order', 'place an order', 'how do i purchase', 'checkout'],
      response:
        'Ordering with Heart Beauty is simple:\n\n' +
        '1. Browse our products\n' +
        '2. Add your preferred items to your cart\n' +
        '3. Review your cart\n' +
        '4. Proceed to Checkout via WhatsApp or Email\n\n' +
        "Our team will then confirm stock availability and send you payment instructions. Once you've paid, just send your proof of payment so we can prepare your order 💛"
    },
    {
      keywords: ['pay before', 'pay immediately', 'pay now', 'can i pay', 'when do i pay', 'why can\'t i pay online', 'why cant i pay online', 'pay online'],
      response:
        "Please hold off on paying until Heart Beauty confirms your order. Once we've confirmed stock availability and pricing, we'll send you payment instructions. After paying, send your proof of payment via WhatsApp or Email so we can verify it and get your order moving."
    },
    {
      keywords: ['proof of payment', 'send payment', 'where do i send', 'paid already', 'already paid', 'i paid'],
      response:
        `Please send your proof of payment via WhatsApp (${this.whatsappNumberPlaceholder()}) or Email (${this.supportEmailPlaceholder()}) so our team can verify it. Once verified, your order will be processed for dispatch.`
    },
    {
      keywords: ['payment', 'how do i pay', 'payment process', 'payment method'],
      response:
        'Heart Beauty uses a manual payment confirmation process:\n\n' +
        '1. We confirm availability & pricing\n' +
        '2. We send you payment instructions\n' +
        '3. You make payment\n' +
        '4. You send proof of payment\n' +
        '5. We verify it and prepare your order\n\n' +
        "Orders aren't complete until all of these steps are done."
    },
    {
      keywords: ['delivery', 'shipped', 'shipping', 'where is my order', 'track my order', 'has my order', 'when will i receive'],
      response:
        "If you already have an order number, feel free to share it and I can point you in the right direction. Our team sends delivery updates once payment has been verified and your order is dispatched — I don't have access to live tracking here, so for the most accurate update please reach out via WhatsApp or Email."
    },
    {
      keywords: ['member', 'membership', 'loyalty', 'discount', 'discounts', 'exclusive offer', 'special offer'],
      response:
        'Heart Beauty Membership is completely free! 🎁\n\n' +
        'As a member you get:\n' +
        '• Personalised discounts\n' +
        '• Early access to promotions\n' +
        '• Private sales & curated deals\n\n' +
        "Offers are sent directly via Email and/or WhatsApp based on your activity and preferences. You don't need to be a member to shop with us, but it's a nice bonus if you are!"
    },
    {
      keywords: ['contact', 'phone number', 'whatsapp', 'email address', 'reach you', 'business hours', 'opening hours', 'call you'],
      response:
        `You can reach Heart Beauty here:\n\n📱 WhatsApp/Call: ${this.whatsappNumberPlaceholder()}\n✉️ Email: ${this.supportEmailPlaceholder()}\n🕗 Business Hours: ${this.businessHours}\n\nPlease include your order number if you have one, so we can help you faster!`
    },
    {
      keywords: ['change my order', 'cancel my order', 'update my order', 'edit my order'],
      response:
        "For changes or cancellations, please contact our team directly via WhatsApp or Email with your order number so they can assist you as quickly as possible."
    },
    {
      keywords: ['in stock', 'available', 'do you have', 'is this available'],
      response:
        "I don't have access to live stock availability. Once you submit your order via WhatsApp or Email, our team will confirm availability for you."
    },
    {
      keywords: ['wig', 'bundle', 'bundles', 'closure', 'frontal', 'frontals'],
      response:
        "Great choice! To help you find the best option, could you let me know:\n\n" +
        '• Are you looking for a wig, bundles, a closure, or a frontal?\n' +
        '• What texture do you prefer (Straight, Body Wave, Deep Wave, Curly, etc.)?\n' +
        '• What length are you looking for?\n' +
        '• Do you have a preferred colour?\n\n' +
        "Once I know these, I can help point you to the perfect match 💇"
    },
    {
      keywords: ['looking for hair', 'need hair', 'want hair', 'buy hair', 'hair product'],
      response:
        "I'd love to help! 😊\n\nCould you tell me:\n\n" +
        '• Are you looking for a wig, bundles, closure, or frontal?\n' +
        '• What texture do you prefer (Straight, Body Wave, Deep Wave, Curly, etc.)?\n' +
        '• What length are you looking for?\n' +
        '• Do you have a preferred colour?\n\n' +
        'Once I know these, I can help you find the perfect match.'
    },
    {
      keywords: ['issue', 'problem', 'complaint', 'not happy', 'wrong item'],
      response:
        "I'm sorry to hear that! Please reach out to our team directly with your order number so we can sort this out for you:\n\n" +
        `📱 WhatsApp: ${this.whatsappNumberPlaceholder()}\n✉️ Email: ${this.supportEmailPlaceholder()}`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      response: "Hello and welcome to Heart Beauty! 🌸 What can I help you with today?"
    },
    {
      keywords: ['thank', 'thanks'],
      response: "You're so welcome! Let me know if there's anything else I can help you with 💛"
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.setFormattedTime();
    if (this.assistantMessages[1]) {
      this.assistantMessages[1].time = this.currentTime ?? undefined;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private whatsappNumberPlaceholder(): string {
    return this.whatsappNumber;
  }

  private supportEmailPlaceholder(): string {
    return this.supportEmail;
  }

  private setFormattedTime(): void {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    this.currentTime = `${hours}:${minutesStr} ${ampm}`;
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    if (this.showChatbot) {
      this.shouldScroll = true;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch {
      // no-op
    }
  }

  /**
   * Checks the customer's message against the Heart Beauty keyword rules
   * and returns the matching response. Falls back to a safe default that
   * never invents stock, prices, or order confirmations.
   */
  private getResponseForMessage(userText: string): string {
    const normalized = userText.toLowerCase();

    for (const rule of this.rules) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.response;
      }
    }

    return (
      "I don't have a specific answer for that just yet 😊 For anything I can't help with here, " +
      `please reach out to our team directly:\n\n📱 WhatsApp: ${this.whatsappNumberPlaceholder()}\n` +
      `✉️ Email: ${this.supportEmailPlaceholder()}\n\nOr let me know if you'd like help with products, ordering, payment, delivery, or membership!`
    );
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isTyping) {
      return;
    }

    this.assistantMessages.push({ text, sender: 'user' });
    this.userInput = '';
    this.shouldScroll = true;
    this.isTyping = true;

    const response = this.getResponseForMessage(text);
    const delay = 2600 + Math.random() * 800; // ~2.6s - 3.4s, feels natural rather than a fixed tick

    setTimeout(() => {
      this.isTyping = false;
      this.assistantMessages.push({
        text: response,
        sender: 'assistant',
        time: this.getCurrentFormattedTime()
      });
      this.shouldScroll = true;
      this.cdr.detectChanges();
    }, delay);
  }

  sendSuggestion(suggestion: string): void {
    if (this.isTyping) {
      return;
    }

    this.assistantMessages.push({ text: suggestion, sender: 'user' });
    this.shouldScroll = true;
    this.isTyping = true;

    const response = this.getResponseForMessage(suggestion);
    const delay = 2600 + Math.random() * 800;

    setTimeout(() => {
      this.isTyping = false;
      this.assistantMessages.push({
        text: response,
        sender: 'assistant',
        time: this.getCurrentFormattedTime()
      });
      this.shouldScroll = true;
      this.cdr.detectChanges();
    }, delay);
  }

  private getCurrentFormattedTime(): string {
    this.setFormattedTime();
    return this.currentTime ?? '';
  }

  onInputKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}