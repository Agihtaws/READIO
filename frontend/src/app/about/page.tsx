import React from 'react';
import styles from '../page.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Readio</h1>
      
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <p>At Readio, we're on a mission to transform how students learn by making study materials more accessible, interactive, and effective. We believe that AI-powered tools can help learners master complex subjects faster and retain information longer.</p>
      </section>
      
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>What is Readio?</h2>
        <p>Readio is an advanced AI-powered study assistant that transforms any text into comprehensive study materials. Whether you're a student, researcher, or lifelong learner, our platform helps you understand and retain information more effectively:</p>
        <ul>
          <li><strong>Smart Summarization:</strong> Convert lengthy texts into concise, easy-to-understand summaries</li>
          <li><strong>Interactive Flashcards:</strong> Create and study with digital flashcards generated from your content</li>
          <li><strong>MCQ Generation:</strong> Test your knowledge with automatically created questions and explanations</li>
          <li><strong>Multi-language Translation:</strong> Break language barriers with support for over 20 languages</li>
          <li><strong>Text Extraction:</strong> Extract text from images and PDFs for immediate study</li>
          <li><strong>AI Chat Assistant:</strong> Ask questions about your study material for deeper understanding</li>
        </ul>
      </section>
      
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Our Technology</h2>
        <p>Readio leverages cutting-edge AI models to deliver exceptional learning experiences:</p>
        <ul>
          <li><strong>Llama-3.2-90B-Vision-Instruct:</strong> For advanced image analysis and text extraction</li>
          <li><strong>Llama-4-Maverick-17B-128E-Instruct-FP8:</strong> Powers our summarization, flashcard generation, MCQ creation, and translation features</li>
          <li><strong>Next.js & React:</strong> For a responsive, modern user interface</li>
          <li><strong>FastAPI Backend:</strong> Ensures fast, reliable processing of your study materials</li>
        </ul>
      </section>
      
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <ul>
          <li><strong>Accessibility:</strong> Making quality study tools available to everyone</li>
          <li><strong>Innovation:</strong> Continuously improving our AI models and features</li>
          <li><strong>Effectiveness:</strong> Creating tools based on proven learning science principles</li>
          <li><strong>Privacy:</strong> Respecting user data and ensuring secure processing</li>
          <li><strong>Inclusivity:</strong> Supporting multiple languages and learning styles</li>
        </ul>
      </section>
      
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Start Learning Smarter Today</h2>
        <p>Whether you're studying for exams, researching complex topics, or simply trying to understand difficult material, Readio is your AI-powered companion for more effective learning. Join thousands of students who are already using Readio to transform how they study.</p>
      </section>
    </div>
  );
};

export default About;
