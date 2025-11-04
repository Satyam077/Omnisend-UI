import { Component, HostListener, OnInit } from '@angular/core';
import { CheckoutService } from '../../Services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  price = 100;
  discountedPrice = this.price;
  discountApplied = false;
  showPopup = false;
  popupShownOnce = false;
  response: any;
  customerResponse: any;
  productTitle = 'Stylish Sneakers';

  constructor(private omnisend: CheckoutService) {}
  ngOnInit(): void {}

  // Detect mouse leaving window top (exit intent)
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.popupShownOnce && event.clientY <= 25) {
      this.showPopup = true;
      this.popupShownOnce = true;
      //this.createContact();
    }
  }

  // User clicked "Proceed to Checkout"
  startCheckout() {
    this.createCustomer();
    const payload = {
      origin: 'api',
      eventID: crypto.randomUUID(),
      eventName: 'started checkout',
      eventVersion: '',
      eventTime: new Date().toISOString(),
      properties: {
        abandonedCheckoutURL: 'https://fed-filings.argosstaging.com/checkout.aspx?application=llc&recordID=1070&email=wpoll215@yopmail.com',
        cartID: 'cart123',
        currency: 'EUR',
        lineItems: [
          {
            productCategories: [{ id: '123', title: 'Shoes' }],
            productDescription: 'The best product ever!',
            productDiscount: 10.19,
            productID: '1',
            productImageURL: 'https://example.com/product.jpg',
            productPrice: this.discountApplied
              ? this.discountedPrice
              : this.price,
            productQuantity: 1,
            productSKU: '200',
            productStrikeThroughPrice: 120.0,
            productTitle: this.productTitle,
            productURL: 'https://example.com/product/1',
            productVariantID: '123',
            productVariantImageURL: 'https://example.com/product-variant.jpg',
          },
        ],
        value: this.discountApplied ? this.discountedPrice : this.price,
      },
      contact: {
        id: '6908b37a90e3a43d2f736b27',
        email: 'c59933290@gmail.com',
        phone: '+443031237300',
        firstName: 'John',
        lastName: 'Doe',
        city: 'New York',
        country: 'United States',
        countryCode: 'US',
      },
    };

    this.omnisend.sendStartedCheckout(payload).subscribe({
      next: (res) => (this.response = res,
        console.log('response:', res)
      ),
      error: (err) => (this.response = err),
    });
    //this.createContact();

  }

  // Apply 20% discount
  applyDiscount() {
    this.discountApplied = true;
    this.discountedPrice = +(this.price * 0.8).toFixed(2);
    this.showPopup = false;
    alert('🎉 20% discount applied to your total!');
  }

  // Close popup without applying offer
  closePopup() {
    this.showPopup = false;
  }
  createContact() {
    const contact = {
      email: 'john1@example.com',
      contactID: '69049659decdae4620112def',
      createdAt: new Date().toISOString(),
      firstName: 'Chandan',
      lastName: 'Chauhan',
      country: 'United States',
      countryCode: 'US',
      state: 'TX',
      city: 'Austin',
      postalCode: '73301',
      address: '123 Main St',
      gender: 'm',
      phone: '',
      birthdate: null,
      status: 'subscribed',
      tags: ['form_subscriber', 'welcome_discount', 'source: form'],
      segments: ['690383e231a0f2765672d87d'],
      statuses:
      [
        {
          channel: 'email',
          status: 'subscribed',
          date: new Date().toISOString(),
          statusDate: new Date().toISOString(),
        },
      ],
      optIns: [
        {
          channel: 'email',
          date: new Date().toISOString(),
        },
      ],
      consents: [
        {
          channel: 'email',
          source: 'form:69047b9a4b954252bb1f65d4',
          ip: '122.176.73.115',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0',
          createdAt: new Date().toISOString(),
        },
      ],
      customProperties: null,
      identifiers: [
        {
          id: 'john1@example.com',
          type: 'email',
          source: 'form',
          channels: {
            email: {
              status: 'subscribed',
              statusDate: new Date().toISOString(),
            },
          },
        },
      ],
    };
    this.omnisend.createContact(contact).subscribe({
      next: (res) => (this.response = res),
      error: (err) => (this.response = err),
    });
    // console.log(
    //   'Contact creation initiated with data:',
    //   contact,
    //   this.response
    // );
  }

  createCustomer() {
    const customer = {
      email: 'c59933290@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      country: 'United States',
      countryCode: 'US',
      city: 'New York',
      sendWelcomeEmail: false,
      status: 'subscribed',
      statusDate: new Date().toISOString(),
      statuses: [
        {
          statusDate: new Date().toISOString(),
          channel: 'email',
          status: 'subscribed',
          date: '2025-10-31T10:58:33.612Z',
        },
      ],
      customProperties: {
        recordId: 'REC-987654',
        applicationName: 'FED FILINGS LLC',
        recordSubmitDate: new Date().toISOString(),
        applicationUrl:
          'https://fed-filings.argosstaging.com/checkout.aspx?application=llc&recordID=1070&email=wpoll215@yopmail.com',
        einNumber: '12-3456789',
        checkoutStatus: 0, // 0 = pending
        sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID(),
      },
    };

    this.omnisend.createCustomer(customer).subscribe({
      next: (res) => (this.customerResponse = res,
        console.log('Response from server:', res)
      ),
      error: (err) => (this.customerResponse = err,
        console.error('Error from server:', err)
      ),
    });
  }
}
