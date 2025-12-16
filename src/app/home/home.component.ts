import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <section class="hero">
      <div class="hero__text">
        <h1>Inventory Management System</h1>
        <p class="hero__subtitle">
          A modern, web-based solution to help your business track products,
          manage stock levels, and make smarter purchasing decisions in real time.
        </p>
         <h2>Why Choose Our Inventory Management System?</h2>

        <div class="hero__highlights">
          <div class="hero__highlight">
            <h3>Cloud hosted centralized data.</h3>
            <p>
              Centralized cloud-hosted data gives your business secure, real-time access to accurate inventory from anywhere.
            </p>
            <figure class="hero__image-card hero__image-card--secondary">
          <img
            src="../assets/images/cloud_image.jpg"
            alt="Cloud hosted preview"
            [style.width.px]="220"
            style="height: auto;"
          />
           </figure>
          </div>
          <div class="hero__highlight">
             <h3>Streamlined Workflows</h3>
            <p>
              Quickly create, update, and delete inventory items with built-in validation to reduce manual errors and save time.
            </p>
            <figure class="hero__image-card hero__image-card--secondary">
          <img
            src="../assets/images/streamline_image.jpg"
            alt="Streamlined Workflows preview"
            [style.width.px]="225"
            style="height: auto;"
          />
           </figure>
          </div>
          <div class="hero__highlight">
            <h3>Scalable Foundation</h3>
            <p>
            Built with the MEAN stack (MongoDB, Express, Angular, Node.js),
            the system is designed to grow with your business needs.
          </p>
            <figure class="hero__image-card hero__image-card--secondary">
          <img
            src="../assets/images/mean.jpg"
            alt="Scalable Foundation preview"
            [style.width.px]="235"
            style="height: auto;"
          />
           </figure>
          </div>
          <div class="hero__highlight">
            <h3>Customizable Features</h3>
            <p>
            Additional modules, such as reporting and permissions can be added as your organization expands.
          </p>
            <figure class="hero__image-card hero__image-card--secondary">
          <img
            src="../assets/images/custom.jpg"
            alt="Customizable Features preview"
            [style.width.px]="225"
            style="height: auto;"
          />
           </figure>
          </div>
        </div>
      </div>
      <div class="hero__images">
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 2rem;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2933;
        background-color: #f5f7fa;
      }

      .hero {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        align-items: flex-start;
        margin-bottom: 3rem;
      }

      .hero__text {
        flex: 1 1 320px;
        min-width: 0;
      }

      h1 {
        font-size: 2.25rem;
        margin-bottom: 0.5rem;
        color: #111827;
      }

      .hero__subtitle {
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        color: #4b5563;
      }

      .hero__highlights {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .hero__highlight {
        background: #ffffff;
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
      }

      .hero__highlight h3 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
        color: #111827;
      }

      .hero__highlight p {
        font-size: 0.9rem;
        margin: 0;
        color: #4b5563;
      }

      .hero__server-message {
        margin-top: 1rem;
        font-size: 0.95rem;
      }

      .hero__server-label {
        font-weight: 600;
        margin-right: 0.25rem;
      }

      .hero__server-value {
        font-style: italic;
        color: #2563eb;
      }

      .hero__images {
        flex: 1 1 260px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .hero__image-card {
        background: #ffffff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.15);
      }

      .hero__image-card img {
        width: 100%;
        height: auto;
        border-radius: 0.35rem;
        display: block;
        background-color: #e5e7eb; /* in case placeholder images don’t exist yet */
      }

      .hero__image-card figcaption {
        margin-top: 0.4rem;
        font-size: 0.8rem;
        color: #6b7280;
      }

      .hero__image-card--secondary {
        opacity: 0.95;
      }

      .info {
        background: #ffffff;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
      }

      .info h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #111827;
      }

      .info__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .info__item h3 {
        font-size: 1rem;
        margin-bottom: 0.4rem;
        color: #111827;
      }

      .info__item p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #4b5563;
      }

      @media (max-width: 768px) {
        :host {
          padding: 1.25rem;
        }

        .hero {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HomeComponent {
  serverMessage: string;

  constructor(private http: HttpClient) {
    this.serverMessage = '';

    // Simulate a server request that takes 2 seconds to complete
    setTimeout(() => {
      this.http.get(`${environment.apiBaseUrl}/api`).subscribe({
        next: (res: any) => {
          this.serverMessage = res['message'];
        },
        error: () => {
          this.serverMessage = 'Error loading server message';
        },
      });
    }, 2000);
  }
}
