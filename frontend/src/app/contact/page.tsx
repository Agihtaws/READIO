import React from 'react';
import styles from '../page.module.css';

const Contact = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      
      <section className={styles.contactSection}>
        <p className={styles.contactIntro}>Have questions about Readio? Want to report a bug or suggest a new feature? We'd love to hear from you! Choose the most convenient way to reach our team below.</p>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            
            <div className={styles.contactItem}>
              <h3>Email</h3>
              <p>support@readio.app</p>
            </div>
            
            <div className={styles.contactItem}>
              <h3>Social Media</h3>
              <ul className={styles.socialLinks}>
                <li><a href="https://twitter.com/readioapp" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://instagram.com/readioapp" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://linkedin.com/company/readio" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
            
            <div className={styles.contactItem}>
              <h3>Office Hours</h3>
              <p>Monday - Friday: 10:00 AM - 6:00 PM (IST)</p>
              <p>Saturday: 10:00 AM - 2:00 PM (IST)</p>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <h2 className={styles.sectionTitle}>Send a Message</h2>
            
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email address" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={6} placeholder="Type your message here..." required></textarea>
              </div>
              
              <button type="submit" className={styles.submitButton}>Send Message</button>
            </form>
          </div>
        </div>
      </section>
      
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        
        <div className={styles.faqItem}>
          <h3>How many free uses do I get before needing to sign up?</h3>
          <p>You can use Readio for free twice per day. After that, you'll need to create an account to continue using our services.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>What file types can I upload for text extraction?</h3>
          <p>Currently, Readio supports image files (JPG, PNG, etc.) and PDF documents. We automatically extract text from these files for processing.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>How accurate is the text extraction from images?</h3>
          <p>Our text extraction uses Llama-3.2-90B-Vision-Instruct model and works best with clear, well-lit images of printed text. Handwritten text or low-quality images may result in less accurate extraction.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>Which languages are supported for translation?</h3>
          <p>Readio supports translation to and from over 20 languages, including Tamil, Hindi, French, Spanish, German, Chinese, Japanese, Arabic, and many others.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>Is my data secure when using Readio?</h3>
          <p>Yes, we take data security seriously. Your study materials are processed securely and are not stored permanently or shared with third parties without your consent.</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
