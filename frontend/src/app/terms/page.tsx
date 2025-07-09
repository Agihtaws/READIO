import React from 'react';
import styles from '../page.module.css';

const Terms = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      
      <section className={styles.policySection}>
        <p>Last Updated: July 8, 2025</p>
        
        <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
        <p>Welcome to Readio. By accessing or using our application, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our application.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>2. Description of Service</h2>
        <p>Readio is an AI-powered study assistant that provides tools including:</p>
        <ul>
          <li>Text extraction from images and PDFs</li>
          <li>Text summarization</li>
          <li>Flashcard generation</li>
          <li>Multiple-choice question creation</li>
          <li>Multi-language translation services</li>
          <li>AI-powered study chat</li>
        </ul>
        <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>3. Free Trial and Subscription</h2>
        <p>Readio offers a limited free trial of 2 uses per day for non-registered users. To access unlimited usage, you must create an account.</p>
        <p>We offer various subscription plans with different pricing and features. By subscribing to a paid plan, you agree to pay all applicable fees as described at the time of purchase.</p>
        <p>All payments are processed securely through our payment providers. Subscription fees are non-refundable except where required by law.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>4. User Accounts</h2>
        <p>You may be required to create an account to use certain features of our application. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
        <p>You agree to provide accurate and complete information when creating an account and to update your information as needed to keep it accurate and current.</p>
        <p>We reserve the right to disable any user account if we believe you have violated any provision of these Terms.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>5. User Content</h2>
        <p>Our application allows you to input and upload content, including text, images, and PDF files ("User Content"). You retain all rights to your User Content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content for the purpose of providing and improving our services.</p>
        <p>You are solely responsible for your User Content and the consequences of posting or publishing it. We do not endorse any User Content or opinions expressed by users.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>6. Acceptable Use</h2>
        <p>You agree not to use our application to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe the intellectual property rights of others</li>
          <li>Upload or transmit viruses or malicious code</li>
          <li>Attempt to gain unauthorized access to our systems or user accounts</li>
          <li>Engage in automated use of the system that may harm or burden our infrastructure</li>
          <li>Generate, distribute, or promote harmful, threatening, or discriminatory content</li>
          <li>Use the service for cheating on academic assessments or exams</li>
          <li>Bypass or attempt to bypass the free trial usage limitations</li>
        </ul>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>7. Intellectual Property</h2>
        <p>The application, including all content, features, and functionality, is owned by us and is protected by copyright, trademark, and other intellectual property laws.</p>
        <p>Our name, logo, and all related names, logos, product and service names, designs, and slogans are our trademarks. You must not use such marks without our prior written permission.</p>
        <p>The AI-generated content produced by our service (summaries, flashcards, MCQs, etc.) is provided for your personal educational use only.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>8. AI-Generated Content</h2>
        <p>Readio uses advanced AI models to generate study materials. While we strive to provide accurate and high-quality content, AI-generated materials may contain errors, inaccuracies, or misinterpretations. You should always verify important information with authoritative sources.</p>
        <p>You are granted a personal, non-transferable license to use the AI-generated content for your educational purposes only. You may not redistribute, sell, or publish the AI-generated content without our permission.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>9. Disclaimer of Warranties</h2>
        <p>THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        <p>We do not guarantee that the application will be error-free or uninterrupted, or that any defects will be corrected. We do not warrant that the AI-generated content will be accurate, complete, or suitable for any specific purpose.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>10. Limitation of Liability</h2>
        <p>TO THE FULLEST EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APPLICATION.</p>
        <p>OUR TOTAL LIABILITY FOR ALL CLAIMS RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE DURING THE THREE MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>11. Educational Use</h2>
        <p>Readio is designed to assist with studying and learning, but we do not guarantee the accuracy or completeness of any content generated through our services. The application should be used as a supplementary tool and not as a replacement for formal education or professional advice.</p>
        <p>You agree to use the service responsibly and ethically in your educational pursuits.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>12. Termination</h2>
        <p>We may terminate or suspend your access to the application immediately, without prior notice or liability, for any reason, including if you breach these Terms.</p>
        <p>Upon termination, your right to use the application will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>13. Changes to Terms</h2>
        <p>We may revise these Terms at any time by updating this page. By continuing to use the application after those revisions become effective, you agree to be bound by the revised Terms.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>14. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>15. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p>Email: legal@readio.app</p>
      </section>
    </div>
  );
};

export default Terms;

