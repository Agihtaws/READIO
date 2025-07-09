import React from 'react';
import styles from '../page.module.css';

const Privacy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      
      <section className={styles.policySection}>
        <p>Last Updated: July 8, 2025</p>
        
        <h2 className={styles.sectionTitle}>Introduction</h2>
        <p>Welcome to Readio. We are committed to protecting your privacy and handling your data with transparency and care. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Information We Collect</h2>
        
        <h3>1. User-Provided Information</h3>
        <p>We collect information you provide directly to us:</p>
        <ul>
          <li>Account information: name, email address, and password when you create an account</li>
          <li>Study materials you input or upload into our system</li>
          <li>Images and PDF files you upload for text extraction</li>
          <li>Chat conversations with our AI assistant</li>
          <li>Feedback and support requests you submit</li>
        </ul>
        
        <h3>2. Automatically Collected Information</h3>
        <p>When you use Readio, we may automatically collect:</p>
        <ul>
          <li>Device information: device type, operating system, and browser type</li>
          <li>Usage data: how you interact with our application, features used, and time spent</li>
          <li>Log data: IP address, date and time of access, and pages viewed</li>
          <li>Device fingerprinting for non-logged in users to track free usage limits</li>
        </ul>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and improve our services</li>
          <li>Process and generate study materials (summaries, flashcards, MCQs, translations)</li>
          <li>Track usage for free trial limitations</li>
          <li>Train and improve our AI models</li>
          <li>Respond to your requests and inquiries</li>
          <li>Monitor and analyze usage patterns and trends</li>
          <li>Protect against unauthorized access and ensure the security of our platform</li>
        </ul>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>AI Models and Data Processing</h2>
        <p>Readio uses advanced AI models to process your content:</p>
        <ul>
          <li>Llama-3.2-90B-Vision-Instruct: For image analysis and text extraction</li>
          <li>Llama-4-Maverick-17B-128E-Instruct-FP8: For text processing, summarization, flashcard creation, MCQ generation, and translation</li>
        </ul>
        <p>When you submit content for processing, it is temporarily stored to generate the requested study materials and then deleted from our active systems once processing is complete.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Data Retention</h2>
        <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
        <p>For non-logged in users, we store device fingerprinting information for 24 hours to track daily usage limits.</p>
        <p>For registered users, account information is retained until you delete your account. You can request deletion of your account and associated data at any time by contacting us.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        <p>However, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Sharing Your Information</h2>
        <p>We do not sell your personal information to third parties. We may share your information with:</p>
        <ul>
          <li>Service providers who assist us in operating our platform</li>
          <li>IO Intelligence API for AI model processing</li>
          <li>Firebase for authentication services</li>
          <li>Legal authorities when required by law</li>
        </ul>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we have about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Delete your personal information</li>
          <li>Object to or restrict the processing of your data</li>
          <li>Receive a copy of your data in a structured, machine-readable format</li>
        </ul>
        <p>To exercise these rights, please contact us using the information provided below.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Children's Privacy</h2>
        <p>Readio is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can take necessary actions.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        <p>We encourage you to review this Privacy Policy periodically for any changes.</p>
      </section>
      
      <section className={styles.policySection}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>Email: privacy@readio.app</p>
      </section>
    </div>
  );
};

export default Privacy;

