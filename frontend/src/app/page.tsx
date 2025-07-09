// page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { usageTracker } from '@/lib/usageTracker';

// Type definitions
type TabType = 'summary' | 'flashcards' | 'mcqs' | 'translation' | 'chat';

interface FlashCard {
  question: string;
  answer: string;
}

interface MCQOption {
  text: string;
  isCorrect: boolean;
}

interface MCQ {
  question: string;
  options: MCQOption[];
  explanation: string;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
}

// Progress Bar Component
const ProgressBar = ({ isLoading }: { isLoading: boolean }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          // Gradually increase progress but slow down as it approaches 90%
          const increment = (90 - prev) / 10;
          return Math.min(prev + increment, 90);
        });
      }, 300);
    } else {
      setProgress(100); // Complete the bar when loading is done
    }
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  return (
    <div className={styles.progressBarContainer}>
      <div 
        className={styles.progressBar} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className={styles.typingIndicator}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default function Home() {
  // State variables
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [translation, setTranslation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(5).fill(-1));
  const [showExplanations, setShowExplanations] = useState<boolean[]>(Array(5).fill(false));
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [translationSource, setTranslationSource] = useState('summary');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasExtracted, setHasExtracted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // PDF specific state
  const [pdfPages, setPdfPages] = useState<number>(0);
  const [currentPdfPage, setCurrentPdfPage] = useState<number>(1);
  const [pdfPageImages, setPdfPageImages] = useState<string[]>([]);
  const [showPdfPageSelector, setShowPdfPageSelector] = useState<boolean>(false);
  
  // Processing state tracking
  const [isProcessing, setIsProcessing] = useState({
    summary: false,
    flashcards: false,
    mcqs: false
  });
  
  // Backend URL
  const backendUrl = 'http://localhost:8000';

  // Check usage limit on component mount
  useEffect(() => {
    // If user is logged in, no need to check usage
    if (user) return;
    
    // Check if usage limit is reached
    const checkUsageLimit = async () => {
      if (await usageTracker.hasReachedLimit()) {
        setShowLoginPrompt(true);
      }
    };
    
    checkUsageLimit();
  }, [user]);
  
  // Auto-scroll to bottom when chat messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Helper functions
  const getWelcomeMessage = () => {
    if (user) {
      return `Welcome back, ${user.displayName || 'there'}!`;
    }
    return 'Enjoy 2 free trials before signing up!';
  };

  // PDF handling functions
  const handlePdfTextExtraction = async (pdfFile: File, specificPage?: number) => {
    setIsExtracting(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', pdfFile);
      
      if (specificPage) {
        formData.append('page', specificPage.toString());
      }
      
      console.log(`Extracting text from PDF: ${pdfFile.name}`);
      
      // Send the PDF to the backend for text extraction
      const response = await fetch(`${backendUrl}/api/extract-pdf-text`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to extract text: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we got text back
      if (data.text && data.text.trim()) {
        setInput(data.text);
        setHasExtracted(true);
      } else {
        setError('No text was found in the PDF.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setError(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      
      // Check if it's an image or PDF file
      if (!uploadedFile.type.startsWith('image/') && uploadedFile.type !== 'application/pdf') {
        setError('Please upload an image or PDF file.');
        return;
      }
      
      if (uploadedFile.type === 'application/pdf') {
        // For PDF files, we need to get page count first
        getPdfPageCount(uploadedFile);
        return;
      }
      
      // Reset PDF-related states when uploading a regular image
      setPdfPages(0);
      setCurrentPdfPage(1);
      setPdfPageImages([]);
      setShowPdfPageSelector(false);
      
      // For regular images, continue with the existing flow
      setFile(uploadedFile);
      setError(null);
      setHasExtracted(false);
    }
  };

  const getPdfPageCount = async (pdfFile: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', pdfFile);
      
      // Send the PDF to the backend to get page count
      const response = await fetch(`${backendUrl}/api/pdf-page-count`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to get PDF info: ${response.status}`);
      }
      
      const data = await response.json();
      const pageCount = data.pageCount;
      
      // Store the PDF file and page count
      setFile(pdfFile);
      setPdfPages(pageCount);
      setCurrentPdfPage(1);
      setPdfPageImages([]);
      setShowPdfPageSelector(pageCount > 1);
      setError(null);
      setHasExtracted(false);
      
      // If it's a single page PDF, extract text immediately
      if (pageCount === 1) {
        await handlePdfTextExtraction(pdfFile, 1);
      }
      
    } catch (error) {
      console.error('Error getting PDF info:', error);
      setError(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const convertPdfPageToImage = async (page: number) => {
    if (!file || !file.type.includes('pdf')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('page', page.toString());
      
      console.log(`Converting PDF page ${page} to image and extracting text`);
      
      // Extract text from the specific page
      await handlePdfTextExtraction(file, page);
      
      // Send the PDF to the backend for conversion to image (for preview)
      const response = await fetch(`${backendUrl}/api/pdf-to-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to convert PDF: ${response.status}`);
      }
      
      // Get the image blob from response
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      
      // Update the PDF page images array
      const newPdfPageImages = [...pdfPageImages];
      newPdfPageImages[page - 1] = imageUrl;
      setPdfPageImages(newPdfPageImages);
      
      setCurrentPdfPage(page);
      
    } catch (error) {
      console.error('Error converting PDF:', error);
      setError(`Failed to convert PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractAllPdfPages = async () => {
    if (!file || !file.type.includes('pdf') || pdfPages === 0) return;
    
    setIsExtracting(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Extracting text from all pages of PDF: ${file.name}`);
      
      // Use the dedicated extract-pdf-all-pages endpoint instead
      const response = await fetch(`${backendUrl}/api/extract-pdf-all-pages`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to extract text: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we got text back
      if (data.text && data.text.trim()) {
        setInput(data.text);
        setHasExtracted(true);
      } else {
        setError('No text was found in the PDF.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setError(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      setError('Please upload an image or PDF first.');
      return;
    }
    
    // If it's a PDF, use the PDF-specific extraction
    if (file.type === 'application/pdf') {
      await handlePdfTextExtraction(file);
      return;
    }
    
    // Original code for image text extraction
    setIsExtracting(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Extracting text from: ${file.name} (${file.size} bytes)`);
      
      // Send the file to the Python backend for text extraction
      const response = await fetch(`${backendUrl}/api/extract-text`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to extract text: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Extraction result:", data);
      
      // Check if we got text back
      if (data.text && data.text.trim()) {
        // Clean up any headers that might have been added by the model
        let cleanedText = data.text.trim();
        
        // Remove common headers
        const headersToRemove = [
          "**Extracted Text:**",
          "*Extracted Text:*",
          "Extracted Text:",
          "**Text from image:**",
          "*Text from image:*",
          "Text from image:",
          "**Text:**",
          "*Text:*",
          "Text:"
        ];
        
        for (const header of headersToRemove) {
          if (cleanedText.startsWith(header)) {
            cleanedText = cleanedText.substring(header.length).trim();
          }
        }
        
        // Remove any leading asterisks
        while (cleanedText.startsWith('*')) {
          cleanedText = cleanedText.substring(1).trim();
        }
        
        // Set the cleaned extracted text to the input field
        setInput(cleanedText);
        setHasExtracted(true);
      } else {
        setError('No text was found in the uploaded image.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setError(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Content generation functions
  const handleGenerate = async () => {
    if (!input && !file) {
      setError('Please enter text or upload an image or PDF');
      return;
    }
    
    if (!user && await usageTracker.hasReachedLimit()) {
      setShowLoginPrompt(true);
      return;
    }
    
    // If not logged in, increment usage count
    if (!user) {
      await usageTracker.incrementUsage();
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Now we can use the input directly since it contains the extracted text
      const textContent = input;
      
      // Based on the active tab, generate the appropriate content
      switch (activeTab) {
        case 'summary':
          await generateSummary(textContent);
          break;
        case 'flashcards':
          await generateFlashcards(textContent);
          break;
        case 'mcqs':
          await generateMCQs(textContent);
          break;
        case 'translation':
          // For translation, we need a summary first
          if (!summary) {
            await generateSummary(textContent);
          }
          break;
        case 'chat':
          // For chat, we might want the summary as context
          if (!summary) {
            await generateSummary(textContent);
          }
          break;
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sequential processing of study materials
  const handleGenerateAllMaterials = async () => {
    if (!input && !file) {
      setError('Please enter text or upload an image or PDF');
      return;
    }
    
    // Check if user is logged in or has free uses left
    if (!user && await usageTracker.hasReachedLimit()) {
      setShowLoginPrompt(true);
      return;
    }
    
    // If not logged in, increment usage count
    if (!user) {
      await usageTracker.incrementUsage();
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Use the input directly since it contains the extracted text
      const textContent = input;
      
      // First generate summary immediately (synchronously) and show it
      await generateSummary(textContent);
      
      // Set active tab to summary to show immediate results
      setActiveTab('summary');
      setIsLoading(false);
      
      // Now start sequential background processing
      // First set processing state for flashcards
      setIsProcessing(prev => ({ ...prev, flashcards: true }));
      
      // Generate flashcards
      try {
        const flashcardsResponse = await fetch(`${backendUrl}/api/flashcards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textContent }),
        });
        
        if (!flashcardsResponse.ok) {
          throw new Error(`Failed to generate flashcards: ${flashcardsResponse.status}`);
        }
        
        const flashcardsData = await flashcardsResponse.json();
        console.log("Flashcards data received:", flashcardsData);
        
        // Process flashcards data (same as in your existing function)
        if (flashcardsData['create-flashcards']) {
          try {
            const parsedFlashcards = JSON.parse(flashcardsData['create-flashcards']);
            if (Array.isArray(parsedFlashcards) && parsedFlashcards.length > 0) {
              setFlashcards(parsedFlashcards);
              setFlippedCards(new Array(parsedFlashcards.length).fill(false));
            }
          } catch (parseError) {
            console.error('Error parsing flashcards JSON:', parseError);
            if (Array.isArray(flashcardsData.flashcards) && flashcardsData.flashcards.length > 0) {
              setFlashcards(flashcardsData.flashcards);
              setFlippedCards(new Array(flashcardsData.flashcards.length).fill(false));
            }
          }
        } else if (Array.isArray(flashcardsData.flashcards) && flashcardsData.flashcards.length > 0) {
          setFlashcards(flashcardsData.flashcards);
          setFlippedCards(new Array(flashcardsData.flashcards.length).fill(false));
        }
      } catch (error) {
        console.error('Error generating flashcards:', error);
        setFlashcards([{
          question: "Could not generate flashcards",
          answer: "Please try again with different text"
        }]);
        setFlippedCards([false]);
      } finally {
        // Clear flashcards processing state
        setIsProcessing(prev => ({ ...prev, flashcards: false }));
      }
      
      // Now start MCQs generation after flashcards are done
      setIsProcessing(prev => ({ ...prev, mcqs: true }));
      
      try {
        const mcqsResponse = await fetch(`${backendUrl}/api/mcqs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textContent }),
        });
        
        if (!mcqsResponse.ok) {
          throw new Error(`Failed to generate MCQs: ${mcqsResponse.status}`);
        }
        
        const mcqsData = await mcqsResponse.json();
        console.log("MCQs data received:", mcqsData);
        
        if (Array.isArray(mcqsData.mcqs) && mcqsData.mcqs.length > 0) {
          setMcqs(mcqsData.mcqs);
          setSelectedOptions(new Array(mcqsData.mcqs.length).fill(-1));
          setShowExplanations(new Array(mcqsData.mcqs.length).fill(false));
        } else {
          throw new Error('No valid MCQs found in the response');
        }
      } catch (error) {
        console.error('Error generating MCQs:', error);
        const defaultMCQ = {
          question: "Error occurred while generating MCQs.",
          options: [
            { text: "Try again", isCorrect: true },
            { text: "Check your input", isCorrect: false },
            { text: "Verify API connection", isCorrect: false },
            { text: "Contact support", isCorrect: false }
          ],
          explanation: "There was an error generating MCQs. Please try again with different text."
        };
        setMcqs([defaultMCQ]);
        setSelectedOptions([0]);
        setShowExplanations([false]);
      } finally {
        // Clear MCQs processing state
        setIsProcessing(prev => ({ ...prev, mcqs: false }));
      }
      
    } catch (error) {
      console.error('Error in sequential generation:', error);
      setError(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const generateSummary = async (textContent: string) => {
    setIsProcessing(prev => ({ ...prev, summary: true }));
    try {
      const summaryResponse = await fetch(`${backendUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textContent }),
      });
      
      if (!summaryResponse.ok) {
        throw new Error(`Failed to generate summary: ${summaryResponse.status}`);
      }
      
      const summaryData = await summaryResponse.json();
      
      // Handle both string and object formats
      if (typeof summaryData.summary === 'object') {
        if (summaryData.summary.summarize_text) {
          setSummary(summaryData.summary.summarize_text);
        } else {
          setSummary(JSON.stringify(summaryData.summary));
        }
      } else {
        // Clean up the summary
        let cleanedSummary = summaryData.summary || 'No summary generated.';
        
        // Remove preambles like "Here is a summary of the given text in 250 words:"
        const preambles = [
          "Here is a summary of the given text in 250 words:",
          "Here is a summary of the text:",
          "Summary:",
          "Here's a summary:",
          "Here is a summary:"
        ];
        
        // Check for and remove any preambles
        for (const preamble of preambles) {
          if (cleanedSummary.startsWith(preamble)) {
            cleanedSummary = cleanedSummary.substring(preamble.length).trim();
            break;
          }
        }
        
        // More aggressive cleaning of JSON artifacts at the end
        // This will remove everything from the first occurrence of "final_result" or a standalone "[" character
        const jsonArtifactIndices = [
          cleanedSummary.indexOf('final_result'),
          cleanedSummary.indexOf('\n['),
          cleanedSummary.lastIndexOf('\n\n['),
        ].filter(index => index !== -1);
        
        if (jsonArtifactIndices.length > 0) {
          // Find the earliest occurrence of any JSON artifact
          const earliestArtifactIndex = Math.min(...jsonArtifactIndices);
          cleanedSummary = cleanedSummary.substring(0, earliestArtifactIndex).trim();
        }
        
        setSummary(cleanedSummary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
      throw error;
    } finally {
      setIsProcessing(prev => ({ ...prev, summary: false }));
    }
  };

  const generateFlashcards = async (textContent: string) => {
    setIsProcessing(prev => ({ ...prev, flashcards: true }));
    try {
      setIsLoading(true);
      
      const flashcardsResponse = await fetch(`${backendUrl}/api/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textContent }),
      });
      
      if (!flashcardsResponse.ok) {
        throw new Error(`Failed to generate flashcards: ${flashcardsResponse.status}`);
      }
      
      const flashcardsData = await flashcardsResponse.json();
      console.log("Flashcards data received:", flashcardsData);
      
      // Handle the 'create-flashcards' format from the backend
      if (flashcardsData['create-flashcards']) {
        try {
          // Parse the JSON string from the response
          const parsedFlashcards = JSON.parse(flashcardsData['create-flashcards']);
          console.log("Parsed flashcards:", parsedFlashcards);
          
          if (Array.isArray(parsedFlashcards) && parsedFlashcards.length > 0) {
            setFlashcards(parsedFlashcards);
            setFlippedCards(new Array(parsedFlashcards.length).fill(false));
            return; // Exit the function after setting the flashcards
          }
        } catch (parseError) {
          console.error('Error parsing flashcards JSON:', parseError);
        }
      }
      
      // Fallback to the original logic if 'create-flashcards' key doesn't exist or parsing fails
      if (Array.isArray(flashcardsData.flashcards) && flashcardsData.flashcards.length > 0) {
        setFlashcards(flashcardsData.flashcards);
        setFlippedCards(new Array(flashcardsData.flashcards.length).fill(false));
      } else {
        throw new Error('No valid flashcards found in the response');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      // Set a default flashcard to show the error
      setFlashcards([{
        question: "Could not generate flashcards",
        answer: "Please try again with different text"
      }]);
      setFlippedCards([false]);
      setError('Failed to generate flashcards. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessing(prev => ({ ...prev, flashcards: false }));
    }
  };
  
  const generateMCQs = async (textContent: string) => {
    setIsProcessing(prev => ({ ...prev, mcqs: true }));
    try {
      setIsLoading(true);
      
      const mcqsResponse = await fetch(`${backendUrl}/api/mcqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textContent }),
      });
      
      if (!mcqsResponse.ok) {
        throw new Error(`Failed to generate MCQs: ${mcqsResponse.status}`);
      }
      
      const mcqsData = await mcqsResponse.json();
      console.log("MCQs data received:", mcqsData);
      
      if (Array.isArray(mcqsData.mcqs) && mcqsData.mcqs.length > 0) {
        setMcqs(mcqsData.mcqs);
        setSelectedOptions(new Array(mcqsData.mcqs.length).fill(-1));
        setShowExplanations(new Array(mcqsData.mcqs.length).fill(false));
      } else {
        console.error('Unexpected MCQs format:', mcqsData);
        // Create a default MCQ format if the API fails
        const defaultMCQ = {
          question: "Could not generate proper MCQs. Please try again.",
          options: [
            { text: "Option A", isCorrect: false },
            { text: "Option B", isCorrect: false },
            { text: "Option C", isCorrect: true },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "This is a placeholder. Please try generating MCQs again."
        };
        setMcqs([defaultMCQ]);
        setSelectedOptions([0]);
        setShowExplanations([false]);
      }
    } catch (error) {
      console.error('Error generating MCQs:', error);
      // Create a default MCQ format if the API fails
      const defaultMCQ = {
        question: "Error occurred while generating MCQs.",
        options: [
          { text: "Try again", isCorrect: true },
          { text: "Check your input", isCorrect: false },
          { text: "Verify API connection", isCorrect: false },
          { text: "Contact support", isCorrect: false }
        ],
        explanation: "There was an error generating MCQs. Please try again with different text."
      };
      setMcqs([defaultMCQ]);
      setSelectedOptions([0]);
      setShowExplanations([false]);
      setError('Failed to generate MCQs. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessing(prev => ({ ...prev, mcqs: false }));
    }
  };
  
  const handleTranslate = async () => {
    // Get the text to translate based on the selected source
    const textToTranslate = translationSource === 'summary' ? summary : input;
    
    if (!textToTranslate) {
      setError(`Please generate a ${translationSource} first`);
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const translationResponse = await fetch(`${backendUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: textToTranslate, 
          targetLanguage: selectedLanguage 
        }),
      });
      
      if (!translationResponse.ok) {
        throw new Error(`Failed to translate: \${translationResponse.status}`);
      }
      
      const translationData = await translationResponse.json();
      
      if (typeof translationData.translation === 'object') {
        setTranslation(JSON.stringify(translationData.translation));
      } else {
        setTranslation(translationData.translation || 'Translation not available.');
      }
    } catch (error) {
      console.error('Error translating content:', error);
      setError('Failed to translate text. Please try again.');
      setTranslation('Error: Could not translate the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (questionText?: string) => {
    let messageText: string;
    
    // Handle different types of input
    if (typeof questionText === 'string') {
      messageText = questionText;
    } else {
      messageText = chatInput;
    }
    
    if (!messageText.trim()) return;
    
    const userMessage = { text: messageText, isUser: true };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a chat history to send to the backend
      const chatHistory = chatMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));
      
      const chatResponse = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText,
          context: null, // No need for summary context now
          chatHistory: chatHistory // Send the chat history
        }),
      });
      
      if (!chatResponse.ok) {
        throw new Error(`Failed to get chat response: ${chatResponse.status}`);
      }
      
      const chatData = await chatResponse.json();
      
      // Extract the actual text from the response
      let responseText = '';
      
      if (typeof chatData.response === 'string') {
        responseText = chatData.response;
      } else if (typeof chatData.response === 'object') {
        // If response is already an object
        if (chatData.response["chat-response"]) {
          responseText = chatData.response["chat-response"];
        } else {
          responseText = JSON.stringify(chatData.response);
        }
      } else {
        responseText = 'No response received.';
      }
      
      const botMessage = { text: responseText, isUser: false };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false 
      }]);
      setError('Failed to get chat response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
    
  // UI Helper functions
  const flipCard = (index: number) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = !newFlippedCards[index];
    setFlippedCards(newFlippedCards);
  };

  const selectOption = (questionIndex: number, optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
    
    const newShowExplanations = [...showExplanations];
    newShowExplanations[questionIndex] = true;
    setShowExplanations(newShowExplanations);
  };

  const getOptionClassName = (questionIndex: number, optionIndex: number) => {
    if (!mcqs[questionIndex]?.options) return styles.mcqOption;
    
    if (selectedOptions[questionIndex] === -1) {
      return styles.mcqOption;
    }
    
    if (selectedOptions[questionIndex] === optionIndex) {
      return mcqs[questionIndex].options[optionIndex].isCorrect 
        ? `${styles.mcqOption} ${styles.correctOption}`
        : `${styles.mcqOption} ${styles.wrongOption}`;
    }
    
    if (mcqs[questionIndex].options[optionIndex].isCorrect) {
      return `${styles.mcqOption} ${styles.correctOption}`;
    }
    
    return styles.mcqOption;
  };

  const getGenerateButtonText = () => {
    if (isLoading) return 'Processing...';
    
    switch (activeTab) {
      case 'summary': return 'Generate Summary';
      case 'flashcards': return 'Generate Flashcards';
      case 'mcqs': return 'Generate MCQs';
      case 'translation': return 'Generate Summary';
      case 'chat': return 'Generate Summary';
      default: return 'Generate';
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.welcomeMessage}>
        <h2>{getWelcomeMessage()}</h2>
      </div>
      
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className={styles.loginPromptOverlay}>
          <div className={styles.loginPromptModal}>
            <h2>Free Trial Limit Reached</h2>
            <p>You've used your 2 free trials. Please log in or create an account to continue using Readio.</p>
            <div className={styles.loginPromptButtons}>
              <button 
                className={styles.loginPromptButton}
                onClick={() => router.push('/login')}
              >
                Log In
              </button>
              <button 
                className={styles.signupPromptButton}
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
      
      <section className={styles.inputSection}>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.textarea}
            placeholder="Enter your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className={styles.fileUploadWrapper}>
            <input
              type="file"
              id="file-input"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept="image/*, application/pdf"
              ref={fileInputRef}
            />
            <div className={styles.fileInputContainer}>
              <label htmlFor="file-input" className={styles.fileInputLabel}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {file ? file.name : 'Upload an image or PDF'}
                
                {file && (
                  <button 
                    className={styles.deleteFileButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setHasExtracted(false);
                      setPdfPages(0);
                      setPdfPageImages([]);
                      setShowPdfPageSelector(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    aria-label="Delete file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </label>
            </div>
          </div>
          
          {file && file.type === 'application/pdf' && pdfPages > 0 && (
            <div className={styles.pdfPageSelector}>
              <h3 className={styles.pdfPagesTitle}>PDF Pages: {pdfPages}</h3>
              
              <div className={styles.pdfPageGrid}>
                {Array.from({length: pdfPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`${styles.pdfPageButton} ${currentPdfPage === page ? styles.activePdfPage : ''}`}
                    onClick={() => convertPdfPageToImage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <div className={styles.pdfActionsRow}>
                <button 
                  className={styles.extractAllButton}
                  onClick={handleExtractAllPdfPages}
                  disabled={isExtracting}
                >
                  {isExtracting ? 'Extracting All Pages...' : 'Extract All Pages'}
                </button>
                
                <button 
                  className={styles.extractSelectedButton}
                  onClick={() => handlePdfTextExtraction(file, currentPdfPage)}
                  disabled={isExtracting}
                >
                  {isExtracting ? 'Extracting...' : `Extract Page ${currentPdfPage}`}
                </button>
              </div>
              
              {pdfPageImages[currentPdfPage - 1] && (
                <div className={styles.pdfPagePreview}>
                  <img 
                    src={pdfPageImages[currentPdfPage - 1]} 
                    alt={`PDF Page ${currentPdfPage}`}
                    className={styles.pdfPageImage}
                  />
                </div>
              )}
            </div>
          )}
          
          {file && (
            <div className={styles.fileButtonsRow}>
              <button 
                className={styles.extractButton}
                onClick={handleExtractText}
                disabled={isExtracting}
                title="Extract text from image"
              >
                {isExtracting ? 'Extracting...' : 'Extract Text'}
              </button>
              
              {hasExtracted && (
                <button 
                  className={styles.retryButton}
                  onClick={handleExtractText}
                  disabled={isExtracting}
                  title="Re-extract text"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.buttonContainer}>
          <button 
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={isLoading || (!input && !file)}
          >
            {getGenerateButtonText()}
          </button>
          
          {/* Add the Generate All Study Materials button */}
          <button 
            className={`${styles.generateButton} ${styles.generateAllButton}`}
            onClick={handleGenerateAllMaterials}
            disabled={isLoading || (!input && !file)}
          >
            Generate All Study Materials
          </button>
        </div>
      </section>
  
      <section className={styles.tabsContainer}>
        <ul className={styles.tabsList}>
          <li 
            className={`${styles.tabItem} ${activeTab === 'summary' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary {isProcessing.summary && <span className={styles.loadingIndicator}>...</span>}
          </li>
          <li 
            className={`${styles.tabItem} ${activeTab === 'flashcards' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            Flashcards {isProcessing.flashcards && <span className={styles.loadingIndicator}>...</span>}
          </li>
          <li 
            className={`${styles.tabItem} ${activeTab === 'mcqs' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('mcqs')}
          >
            MCQs {isProcessing.mcqs && <span className={styles.loadingIndicator}>...</span>}
          </li>
          <li 
            className={`${styles.tabItem} ${activeTab === 'translation' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('translation')}
          >
            Translation
          </li>
          <li 
            className={`${styles.tabItem} ${activeTab === 'chat' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </li>
        </ul>
        
        <div className={styles.tabContent}>
          {/* For summary, MCQs, translation tabs - show progress bar when loading */}
          {isLoading && (activeTab === 'summary' || activeTab === 'mcqs' || activeTab === 'translation') ? (
            <div className={styles.loadingContainer}>
              <ProgressBar isLoading={isLoading} />
            </div>
          ) : (
            <>
              {activeTab === 'summary' && (
                <div className={styles.summaryContainer}>
                  <div className={styles.summaryContent}>
                    {summary ? (
                      <>
                        {summary.split('\n')
                          .filter(paragraph => !paragraph.includes("final_result") && !paragraph.trim().startsWith('[') && paragraph.trim() !== '[')
                          .map((paragraph, index) => {
                            // Check if this paragraph is the key points heading
                            if (paragraph.includes("Key points:")) {
                              return <p key={index} className={styles.keyPointsHeading}>{paragraph}</p>;
                            }
                            // Check if this is a bullet point
                            else if (paragraph.trim().startsWith("- ")) {
                              // Remove the dash and add our own bullet point styling
                              const bulletText = paragraph.trim().substring(2);
                              return <p key={index} className={styles.bulletPoint}>{bulletText}</p>;
                            }
                            // Regular paragraph
                            else {
                              return <p key={index}>{paragraph}</p>;
                            }
                          })}
                      </>
                    ) : (
                      <p>Enter text or upload an image and click Generate Summary to create a summary.</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'flashcards' && (
                <div className={styles.flashcardsContainer}>
                  {flashcards.length > 0 ? (
                    <div className={styles.flashcardsGrid}>
                      {flashcards.map((card, index) => (
                        <div key={index} className={styles.flashcardContainer}>
                          <div 
                            className={`${styles.flashcard} ${flippedCards[index] ? styles.flipped : ''}`}
                            onClick={() => flipCard(index)}
                          >
                            <div className={styles.flashcardFront}>
                              <h3>{card.question || "Question not available"}</h3>
                            </div>
                            <div className={styles.flashcardBack}>
                              <p>{card.answer || "Answer not available"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Enter text or upload an image and click Generate Flashcards to create flashcards.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'mcqs' && (
                <div className={styles.mcqsContainer}>
                  {mcqs.length > 0 ? (
                    <>
                      <div className={styles.mcqsHeader}>
                        <h2 className={styles.mcqsTitle}>Multiple Choice Questions</h2>
                        <p className={styles.mcqsSubtitle}>Test your knowledge with these questions based on the text</p>
                      </div>
                      
                      {mcqs.map((mcq, qIndex) => (
                        <div key={qIndex} className={styles.mcqContainer}>
                          <div className={styles.mcqQuestionWrapper}>
                            <p className={styles.mcqQuestion}>{qIndex + 1}. {mcq.question}</p>
                          </div>
                          
                          <div className={styles.mcqOptions}>
                            {mcq.options && mcq.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className={getOptionClassName(qIndex, oIndex)}
                                onClick={() => selectOption(qIndex, oIndex)}
                              >
                                <span className={styles.mcqOptionLetter}>{String.fromCharCode(65 + oIndex)}</span>
                                <span className={styles.mcqOptionText}>{option.text}</span>
                                
                                {selectedOptions[qIndex] !== -1 && option.isCorrect && (
                                  <span className={styles.mcqCorrectMark}>✓</span>
                                )}
                                
                                {selectedOptions[qIndex] === oIndex && !option.isCorrect && (
                                  <span className={styles.mcqWrongMark}>✗</span>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {showExplanations[qIndex] && mcq.explanation && (
                            <div className={styles.explanation}>
                              <h4 className={styles.explanationTitle}>Explanation</h4>
                              <p className={styles.explanationText}>{mcq.explanation}</p>
                            </div>
                          )}
                          
                          {!showExplanations[qIndex] && selectedOptions[qIndex] !== -1 && (
                            <button 
                              className={styles.showExplanationButton}
                              onClick={() => {
                                const newShowExplanations = [...showExplanations];
                                newShowExplanations[qIndex] = true;
                                setShowExplanations(newShowExplanations);
                              }}
                            >
                              Show Explanation
                            </button>
                          )}
                          
                          {qIndex < mcqs.length - 1 && <div className={styles.mcqDivider}></div>}
                        </div>
                      ))}
                      
                      <div className={styles.mcqResults}>
                        <p className={styles.mcqResultsText}>
                          {selectedOptions.filter(option => option !== -1).length} of {mcqs.length} questions answered
                        </p>
                        
                        {selectedOptions.filter(option => option !== -1).length === mcqs.length && (
                          <p className={styles.mcqScore}>
                            Score: {selectedOptions.filter((option, index) => 
                              option !== -1 && mcqs[index].options[option].isCorrect
                            ).length} / {mcqs.length}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className={styles.mcqsPlaceholder}>
                      <p>Enter text or upload an image and click Generate MCQs to create multiple-choice questions.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'translation' && (
                <div className={styles.translationContainer}>
                  <div className={styles.translationOptions}>
                    <div className={styles.optionGroup}>
                      <h3 className={styles.optionTitle}>Source Text</h3>
                      <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="translationSource"
                            value="summary"
                            checked={translationSource === 'summary'}
                            onChange={() => setTranslationSource('summary')}
                            className={styles.radioInput}
                          />
                          <span className={styles.radioText}>Summary</span>
                        </label>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="translationSource"
                            value="original"
                            checked={translationSource === 'original'}
                            onChange={() => setTranslationSource('original')}
                            className={styles.radioInput}
                          />
                          <span className={styles.radioText}>Original Text</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className={styles.optionGroup}>
                      <h3 className={styles.optionTitle}>Target Language</h3>
                      <select 
                        className={styles.languageSelect}
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        <option value="english">English</option>
                        <option value="tamil">Tamil</option>
                        <option value="hindi">Hindi</option>
                        <option value="french">French</option>
                        <option value="telugu">Telugu</option>
                        <option value="malayalam">Malayalam</option>
                        <option value="spanish">Spanish</option>
                        <option value="german">German</option>
                        <option value="italian">Italian</option>
                        <option value="portuguese">Portuguese</option>
                        <option value="russian">Russian</option>
                        <option value="japanese">Japanese</option>
                        <option value="chinese">Chinese</option>
                        <option value="arabic">Arabic</option>
                        <option value="korean">Korean</option>
                        <option value="bengali">Bengali</option>
                        <option value="marathi">Marathi</option>
                        <option value="urdu">Urdu</option>
                        <option value="gujarati">Gujarati</option>
                        <option value="kannada">Kannada</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.sourceTextContainer}>
                    <h3 className={styles.sourceTextTitle}>Source Text</h3>
                    <div className={styles.sourceTextContent}>
                      {translationSource === 'summary' 
                        ? summary 
                          ? summary.split('\n')
                              .filter(paragraph => !paragraph.includes("[final_result"))
                              .map((paragraph, index) => (
                                <p key={index} className={styles.sourceParagraph}>{paragraph}</p>
                              ))
                              : <p>Generate a summary first</p>
                              : input 
                                ? input.split('\n').map((paragraph, index) => (
                                    <p key={index} className={styles.sourceParagraph}>{paragraph}</p>
                                  ))
                                : <p>Enter some text first</p>
                            }
                    </div>
                  </div>
                  
                  <div className={styles.buttonContainer}>
                    <button 
                      className={styles.generateButton}
                      onClick={handleTranslate}
                      disabled={isLoading || (translationSource === 'summary' && !summary) || (translationSource === 'original' && !input)}
                    >
                      Translate
                    </button>
                  </div>
                  
                  {translation ? (
                    <div className={styles.translationResult}>
                      <h3 className={styles.translationTitle}>
                        Translation ({selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)})
                      </h3>
                      <div className={styles.translationContent}>
                        {translation.split('\n').map((paragraph, index) => {
                          // Check if this is a bullet point (starts with "- ")
                          if (paragraph.trim().startsWith("- ")) {
                            // Remove the dash and add our own bullet point styling
                            const bulletText = paragraph.trim().substring(2);
                            return <p key={index} className={styles.bulletPoint}>{bulletText}</p>;
                          }
                          // Regular paragraph
                          else {
                            return <p key={index} className={styles.translatedParagraph}>{paragraph}</p>;
                          }
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className={styles.translationPlaceholder}>
                      Select your source text and target language, then click Translate to see the translation.
                    </p>
                  )}
                </div>
              )}
              
              {/* Chat tab with typing indicator */}
              {activeTab === 'chat' && (
                <div className={styles.chatContainer}>
                  <div className={styles.chatMessages}>
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={msg.isUser ? styles.userMessage : styles.botMessage}
                      >
                        {msg.text}
                      </div>
                    ))}
                    
                    {/* Show typing indicator when loading */}
                    {isLoading && (
                      <div className={styles.botMessage}>
                        <TypingIndicator />
                      </div>
                    )}
                    
                    {/* Invisible div for scrolling to bottom */}
                    <div ref={messagesEndRef} />
                    
                    {chatMessages.length === 0 && !isLoading && (
                      <p>First generate a summary, then ask questions about the content to get clarification.</p>
                    )}
                  </div>
                  
                  <div className={styles.chatInputContainer}>
                    <input
                      type="text"
                      className={styles.chatInput}
                      placeholder="Type your question here..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    />
  
                    <button 
                      className={styles.sendButton}
                      onClick={() => handleChatSubmit(chatInput)}
                      disabled={isLoading || !chatInput.trim() || !summary}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
