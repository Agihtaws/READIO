import React from 'react';
import styles from '../page.module.css';

const Guide = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>How to Use Readio</h1>
      
      <section className={styles.guideSection}>
        <h2 className={styles.sectionTitle}>Getting Started</h2>
        <ol>
          <li>
            <strong>Input Your Study Material</strong>
            <p>You have three ways to input content:</p>
            <ul>
              <li>Type or paste text directly into the text area</li>
              <li>Upload an image containing text and click "Extract Text"</li>
              <li>Upload a PDF document and select specific pages or extract all text</li>
            </ul>
          </li>
          <li>
            <strong>Choose Your Study Method</strong>
            <p>Select one of the tabs at the top of the content area:</p>
            <ul>
              <li>Summary: For concise overviews of the material</li>
              <li>Flashcards: For memorization through question-answer pairs</li>
              <li>MCQs: For testing your knowledge with multiple-choice questions</li>
              <li>Translation: For converting content to other languages</li>
              <li>Chat: For asking specific questions about the material</li>
            </ul>
          </li>
          <li>
            <strong>Generate Content</strong>
            <p>Click either:</p>
            <ul>
              <li>"Generate Summary" (or relevant button for your selected tab)</li>
              <li>"Generate All Study Materials" to create all types at once</li>
            </ul>
          </li>
        </ol>
      </section>
      
      <section className={styles.guideSection}>
        <h2 className={styles.sectionTitle}>Feature Guide</h2>
        
        <h3>Summary</h3>
        <p>The summary feature condenses your text into key points and concepts, making it easier to grasp the main ideas. This is especially useful for long articles, research papers, or textbook chapters.</p>
        <p>After generating a summary, you'll see the main points organized in paragraphs with key points highlighted.</p>
        
        <h3>Flashcards</h3>
        <p>Flashcards are created as question-answer pairs based on important concepts in your text. To use them:</p>
        <ul>
          <li>Click on any card to flip it and reveal the answer</li>
          <li>Use these for active recall practice - one of the most effective study techniques</li>
          <li>Review flashcards regularly to strengthen memory retention</li>
        </ul>
        
        <h3>Multiple Choice Questions (MCQs)</h3>
        <p>Test your understanding with automatically generated questions:</p>
        <ul>
          <li>Each question has one correct answer and three distractors</li>
          <li>Click on an answer to see if you're correct</li>
          <li>View detailed explanations to understand why answers are correct or incorrect</li>
          <li>Track your score at the bottom of the MCQ section</li>
        </ul>
        
        <h3>Translation</h3>
        <p>Convert your text or summary into different languages:</p>
        <ul>
          <li>Select either the original text or the summary as your source</li>
          <li>Choose from over 20 target languages including Tamil, Hindi, Spanish, and more</li>
          <li>Click "Translate" to generate the translation</li>
          <li>Use this feature for language learning or to make content accessible to non-native speakers</li>
        </ul>
        
        <h3>Chat</h3>
        <p>Have a conversation about your study material:</p>
        <ul>
          <li>Ask specific questions about concepts in your text</li>
          <li>Request clarification on difficult topics</li>
          <li>Ask for examples or analogies to better understand the material</li>
          <li>The AI uses your uploaded content as context for accurate responses</li>
        </ul>
      </section>
      
      <section className={styles.guideSection}>
        <h2 className={styles.sectionTitle}>PDF Handling</h2>
        <p>When working with PDF documents:</p>
        <ol>
          <li>Upload your PDF file using the upload button</li>
          <li>For multi-page PDFs, you'll see a grid of page numbers</li>
          <li>Click on any page number to select that specific page</li>
          <li>Use "Extract Page X" to extract text from the current page</li>
          <li>Use "Extract All Pages" to process the entire document at once</li>
          <li>The extracted text will appear in the input field for further processing</li>
        </ol>
      </section>
      
      <section className={styles.guideSection}>
        <h2 className={styles.sectionTitle}>Tips for Best Results</h2>
        <ul>
          <li>Use clear, well-structured text for more accurate summaries and questions</li>
          <li>For image uploads, ensure the text is clearly visible and the image is well-lit</li>
          <li>Generate the summary first before using other features for best context</li>
          <li>For large documents, consider processing one section at a time for more focused results</li>
          <li>Use the "Generate All Study Materials" button to save time when you need all features</li>
          <li>Watch for the processing indicators (dots) next to tab names to see what's being generated</li>
        </ul>
      </section>
      
      <section className={styles.guideSection}>
        <h2 className={styles.sectionTitle}>Keyboard Shortcuts</h2>
        <table className={styles.shortcutsTable}>
          <tbody>
            <tr>
              <td>Enter</td>
              <td>Send chat message</td>
            </tr>
            <tr>
              <td>Ctrl/Cmd + Enter</td>
              <td>Generate content</td>
            </tr>
            <tr>
              <td>Tab</td>
              <td>Navigate between input fields</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Guide;
