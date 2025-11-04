import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    omnisend?: any[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  // private baseUrl = 'https://localhost:7179/api/Checkout';
  //private baseUrl = 'https://railwaydeployement.onrender.com/api/Omnisend';
  private baseUrl = 'http://localhost:8080/api/Omnisend';
  //environment.apiBaseUrl + '/checkout';

  constructor(private http: HttpClient) {}

  sendStartedCheckout(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/started-checkout`, payload);
  }
  identifyContact(email: string, phone?: string) {
    if (window.omnisend) {
      window.omnisend.push(['identify', { email, phone }]);
    }
  }

  //  trackStartedCheckout(data: any): void {
  //   if (window.omnisend) {
  //     window.omnisend.push([
  //       'track',
  //       'started checkout',
  //       data
  //     ]);
  //     console.log('Omnisend checkout event pushed:', data);
  //   } else {
  //     console.warn('Omnisend script not loaded yet.');
  //   }
  // }
  trackStartedCheckout(data: any) {
    if (window.omnisend) {
      window.omnisend.push([
        'track',
        'started checkout',
        {
          origin: 'api',
          eventID: crypto.randomUUID(), // unique event ID
          eventVersion: '',
          eventTime: new Date().toISOString(),
          ...data,
          callbacks: {
            onSuccess: () => console.log('Omnisend event success'),
            onError: () => console.error('Omnisend event failed'),
          },
        },
      ]);
    }
  }

  createContact(contact: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, contact);
  }

  createCustomer(contact: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers`, contact);
  }
}
