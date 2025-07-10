from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, List
import os
import base64
from dotenv import load_dotenv
import asyncio
from iointel import Agent, Workflow
import json
import aiohttp
import io
from PIL import Image, ImageDraw, ImageFont
from PyPDF2 import PdfReader

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API key from environment
api_key = os.getenv("IO_API_KEY")
if not api_key:
    raise ValueError("IO_API_KEY environment variable is not set")

# Models for request/response
class TextRequest(BaseModel):
    text: str

class TranslationRequest(BaseModel):
    text: str
    targetLanguage: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    chatHistory: Optional[List[ChatMessage]] = None

@app.post("/api/pdf-page-count")
async def pdf_page_count(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        print(f"Received PDF file for page count: {file.filename}, size: {len(content)} bytes")
        
        # Create a BytesIO object from the content
        pdf_bytes = io.BytesIO(content)
        
        # Use PyPDF2 to get page count
        pdf = PdfReader(pdf_bytes)
        page_count = len(pdf.pages)
        
        print(f"PDF has {page_count} pages")
        
        return {"pageCount": page_count}
            
    except Exception as e:
        print(f"Error getting PDF page count: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to get PDF page count: {str(e)}")

@app.post("/api/extract-pdf-text")
async def extract_pdf_text(file: UploadFile = File(...), page: int = Form(None)):
    try:
        # Read file content
        content = await file.read()
        print(f"Extracting text from PDF: {file.filename}")
        
        # Create a BytesIO object from the content
        pdf_bytes = io.BytesIO(content)
        
        # Use PyPDF2 to read the PDF
        pdf = PdfReader(pdf_bytes)
        
        # Extract text from all pages or specific page
        if page is not None:
            if page < 1 or page > len(pdf.pages):
                raise HTTPException(status_code=400, detail=f"Page {page} does not exist. PDF has {len(pdf.pages)} pages")
            
            # Extract text from the specified page
            text = pdf.pages[page - 1].extract_text()
            return {"text": f"--- Page {page} ---\n{text}"}
        else:
            # Extract text from all pages (limit to first 4)
            all_text = []
            max_pages = min(len(pdf.pages), 4)
            
            for i in range(max_pages):
                page_text = pdf.pages[i].extract_text()
                all_text.append(f"--- Page {i+1} ---\n{page_text}")
            
            # Add note if there are more pages
            if len(pdf.pages) > max_pages:
                all_text.append(f"\n--- Page {max_pages+1} and beyond omitted (only first {max_pages} pages processed) ---\n")
            
            # Join all text from all pages
            combined_text = "\n\n".join(all_text)
            
            print(f"Successfully extracted text from PDF: {len(combined_text)} characters")
            return {"text": combined_text}
            
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")

@app.post("/api/pdf-to-image")
async def pdf_to_image(file: UploadFile = File(...), page: int = Form(1)):
    try:
        # Read file content
        content = await file.read()
        print(f"Converting page {page} of PDF: {file.filename}")
        
        # Create a BytesIO object from the content
        pdf_bytes = io.BytesIO(content)
        
        # Use PyPDF2 to read the PDF
        pdf = PdfReader(pdf_bytes)
        
        # Check if page exists
        if page < 1 or page > len(pdf.pages):
            raise HTTPException(status_code=400, detail=f"Page {page} does not exist. PDF has {len(pdf.pages)} pages")
        
        # Extract text from the page
        text = pdf.pages[page - 1].extract_text()
        
        # Generate a simple image with the text using PIL
        # This is a fallback solution when we can't render the PDF directly
        # Create a blank image
        img = Image.new('RGB', (800, 1000), color=(255, 255, 255))
        d = ImageDraw.Draw(img)
        
        # Use default font
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()
        
        # Draw text
        d.text((20, 20), f"Page {page}\n\n{text}", fill=(0, 0, 0), font=font)
        
        # Save to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        print(f"Created image representation of PDF page {page}")
        
        # Return the image
        return Response(
            content=img_byte_arr.getvalue(),
            media_type="image/png"
        )
            
    except Exception as e:
        print(f"Error converting PDF to image: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to image: {str(e)}")

@app.post("/api/extract-pdf-all-pages")
async def extract_pdf_all_pages(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        print(f"Extracting text from all PDF pages: {file.filename}")
        
        # Create a BytesIO object from the content
        pdf_bytes = io.BytesIO(content)
        
        # Use PyPDF2 to read the PDF
        pdf = PdfReader(pdf_bytes)
        
        # Extract text from ALL pages
        all_text = []
        
        for i in range(len(pdf.pages)):
            page_text = pdf.pages[i].extract_text()
            all_text.append(f"--- Page {i+1} ---\n{page_text}")
        
        # Join all text from all pages
        combined_text = "\n\n".join(all_text)
        
        print(f"Successfully extracted text from all {len(pdf.pages)} PDF pages: {len(combined_text)} characters")
        return {"text": combined_text}
            
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")

@app.post("/api/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        print(f"Received file: {file.filename}, size: {len(content)} bytes")
        
        # Convert to base64 for the model
        base64_encoded = base64.b64encode(content).decode("utf-8")
        data_url = f"data:{file.content_type};base64,{base64_encoded}"
        
        # Make a direct API call to the IO Intelligence API
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        # Create the request body for vision model
        body = {
            "model": "meta-llama/Llama-3.2-90B-Vision-Instruct",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract all text visible in this image. Return only the raw extracted text without any headers, commentary, or formatting. Do not add 'Extracted Text:' or any other labels."},
                        {
                            "type": "image_url",
                            "image_url": {"url": data_url}
                        }
                    ]
                }
            ],
            "max_tokens": 2048
        }
        
        # Make the API call
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.intelligence.io.solutions/api/v1/chat/completions",
                headers=headers,
                json=body
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    print(f"API Error: {error_text}")
                    raise HTTPException(status_code=500, detail=f"API Error: {response.status}")
                
                data = await response.json()
        
        # Extract the text from the response
        extracted_text = data["choices"][0]["message"]["content"]
        
        # Clean up common headers that the model might add despite instructions
        headers_to_remove = [
            "**Extracted Text:**",
            "*Extracted Text:*",
            "Extracted Text:",
            "**Text from image:**",
            "*Text from image:*",
            "Text from image:",
            "**Text:**",
            "*Text:*",
            "Text:"
        ]
        
        for header in headers_to_remove:
            if extracted_text.startswith(header):
                extracted_text = extracted_text[len(header):].strip()
        
        # Remove any leading asterisks
        while extracted_text.startswith('*'):
            extracted_text = extracted_text[1:].strip()
        
        print(f"Successfully extracted text from image: {len(extracted_text)} characters")
        return {"text": extracted_text}
        
    except Exception as e:
        print(f"Error extracting text from image: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to extract text from image: {str(e)}")

@app.post("/api/summarize")
async def summarize(request: TextRequest):
    try:
        # Create agent and workflow
        agent = Agent(
            name="Summary Agent",
            instructions="""You are an assistant specialized in summarization. Create clear, concise summaries in simple English that capture the main points.
            Focus on providing meaningful information and key concepts.
            Format your response as plain text without any metadata or function calls.
            Include important details, structures, and processes.
            Make the summary informative and educational.
            """,
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            api_key=api_key,
            base_url="https://api.intelligence.io.solutions/api/v1"
        )
        
        workflow = Workflow(objective=request.text, client_mode=False)
        
        # Run summarization task
        result = (await workflow.summarize_text(
            max_words=250,  # Increased word limit for more detailed summary
            agents=[agent]
        ).run_tasks())["results"]
        
        # Process the result to extract clean summary
        clean_summary = ""
        
        # Check if result is a dictionary with summarize_text key
        if isinstance(result, dict) and "summarize_text" in result:
            clean_summary = result["summarize_text"]
        # Check if result is a string containing [final_result(...)]
        elif isinstance(result, str) and "[final_result" in result:
            import re
            # Try to extract summary from final_result format
            summary_match = re.search(r'summary="([^"]+)"', result)
            if summary_match:
                clean_summary = summary_match.group(1)
            else:
                # If can't extract, use the whole result as is
                clean_summary = result
        else:
            # Just convert to string if it's some other format
            clean_summary = str(result)
        
        # Clean up any remaining formatting or special characters
        clean_summary = clean_summary.replace('\\n', '\n').replace('\\t', '\t')
        
        # Add a custom post-processing step to enhance the summary if needed
        if len(clean_summary) < 100:  # If summary is too short, add more context
            # Run a custom task to improve the summary
            enhanced_prompt = f"""
            The following text needs a more detailed summary:
            
            {request.text}
            
            Please provide a comprehensive summary that includes:
            1. Main concepts and structures
            2. Important processes and functions
            3. Key relationships between different parts
            4. Significant characteristics
            
            Format as plain text without metadata.
            """
            
            enhanced_result = (await workflow.custom(
                name="enhanced-summary",
                objective=enhanced_prompt,
                instructions="Create a detailed, informative summary",
                agents=[agent],
            ).run_tasks())["results"]
            
            clean_summary = str(enhanced_result)
        
        return {"summary": clean_summary}
    except Exception as e:
        print(f"Error in summary generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

@app.post("/api/flashcards")
async def generate_flashcards(request: TextRequest):
    try:
        # Create agent and workflow
        agent = Agent(
            name="Flashcard Extractor Agent",
            instructions="""You are an assistant specialized in creating flashcards. 
            Extract key concepts and create question-answer pairs that help with learning.
            Focus on the most important information and format as a proper JSON array.
            Each flashcard should have a clear question and concise answer.
            """,
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            api_key=api_key,
            base_url="https://api.intelligence.io.solutions/api/v1"
        )
        
        workflow = Workflow(objective=request.text, client_mode=False)
        
        # Create custom prompt for flashcards
        custom_prompt = f"""
        Create a set of flashcards from the following text. 
        Each flashcard should have a question on the front and an answer on the back.
        Focus on key concepts, definitions, and important facts.
        Format the output EXACTLY as a JSON array of objects with 'question' and 'answer' properties.
        The output should be valid JSON that can be parsed directly.
        
        Example format: 
        [
          {{"question": "What is photosynthesis?", "answer": "The process by which plants convert light energy to chemical energy"}},
          {{"question": "What is cellular respiration?", "answer": "The process of breaking down glucose to release energy"}}
        ]
        
        Text: {request.text}
        """
        
        # Run custom task
        results = (await workflow.custom(
            name="create-flashcards",
            objective=custom_prompt,
            instructions="Generate flashcards in valid JSON format",
            agents=[agent],
        ).run_tasks())["results"]
        
        # Check if the response contains a create-flashcards key
        if isinstance(results, dict) and 'create-flashcards' in results:
            try:
                # Extract the JSON string from the markdown code blocks
                import re
                json_str = results['create-flashcards']
                
                # Find JSON array between markdown code blocks if present
                json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', json_str)
                if json_match:
                    json_str = json_match.group(1)
                else:
                    # Try to find just a JSON array
                    json_match = re.search(r'\[\s*\{.*\}\s*\]', json_str, re.DOTALL)
                    if json_match:
                        json_str = json_match.group(0)
                
                # Clean up the JSON string
                json_str = json_str.replace('\n', ' ').replace('\\', '')
                print("Extracted JSON string:", json_str)
                
                # Import json here to ensure it's available
                import json
                parsed_cards = json.loads(json_str)
                print("Successfully parsed flashcards:", len(parsed_cards))
                
                # Return directly with the "flashcards" key that your frontend expects
                return {"flashcards": parsed_cards}
            except Exception as e:
                print(f"Error parsing flashcards from create-flashcards key: {e}")
                print(f"Content of create-flashcards: {results['create-flashcards']}")
                # Continue with other parsing methods if this fails
        
        # Parse the JSON from the results
        try:
            # If results is already a dictionary, handle that case
            if isinstance(results, dict):
                print("Results is a dictionary:", results)
                if "flashcards" in results:
                    return {"flashcards": results["flashcards"]}
            
            # If results is a string, try to extract JSON from it
            if isinstance(results, str):
                # Clean up the results string to extract just the JSON part
                import re
                import json
                
                # Print the raw results for debugging
                print("Raw flashcard results:", results)
                
                # Look for JSON array in the text
                json_match = re.search(r'\[\s*\{.*\}\s*\]', results, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    # Clean up common formatting issues
                    json_str = json_str.replace('\n', ' ').replace('\\', '')
                    print("Extracted JSON string:", json_str)
                    
                    flashcards = json.loads(json_str)
                    print("Successfully parsed flashcards:", len(flashcards))
                    return {"flashcards": flashcards}
            
            # Try to find individual question/answer pairs
            if isinstance(results, str):
                questions = re.findall(r'"question":\s*"([^"]+)"', results)
                answers = re.findall(r'"answer":\s*"([^"]+)"', results)
                
                if questions and answers and len(questions) == len(answers):
                    flashcards = [{"question": q, "answer": a} for q, a in zip(questions, answers)]
                    return {"flashcards": flashcards}
            
            # If we get here, we need to try a more aggressive approach
            # Extract lines from either string or dict format
            lines = []
            if isinstance(results, str):
                lines = results.split('\n')
            elif isinstance(results, dict) and 'create-flashcards' in results:
                lines = results['create-flashcards'].split('\n')
            
            flashcards = []
            current_card = {}
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Look for question patterns
                if "question" in line.lower() and ":" in line:
                    if current_card and "question" in current_card:
                        if "answer" not in current_card:
                            current_card["answer"] = "See summary for details"
                        flashcards.append(current_card)
                        current_card = {}
                    
                    q_parts = line.split(":", 1)
                    if len(q_parts) > 1:
                        current_card["question"] = q_parts[1].strip().strip('"').strip()
                
                # Look for answer patterns
                elif "answer" in line.lower() and ":" in line and "question" in current_card:
                    a_parts = line.split(":", 1)
                    if len(a_parts) > 1:
                        current_card["answer"] = a_parts[1].strip().strip('"').strip()
                        flashcards.append(current_card)
                        current_card = {}
            
            # Add the last card if incomplete
            if current_card and "question" in current_card:
                if "answer" not in current_card:
                    current_card["answer"] = "See summary for details"
                flashcards.append(current_card)
            
            # If we found flashcards, return them
            if flashcards:
                return {"flashcards": flashcards}
            
            # Last resort: create some basic flashcards from the text
            return {"flashcards": [
                {"question": "What is the main topic of this text?", "answer": "See summary for details"},
                {"question": "What are key concepts covered in this text?", "answer": "See summary for key points"}
            ]}
                
        except Exception as parse_error:
            print(f"Error parsing flashcards JSON: {parse_error}")
            # Create some basic flashcards as fallback
            return {"flashcards": [
                {"question": "What is the main topic of this text?", "answer": "See summary for details"},
                {"question": "What are key concepts covered in this text?", "answer": "See summary for key points"}
            ]}
        
    except Exception as e:
        print(f"Exception in flashcards: {str(e)}")
        # Even if there's an error, return something usable
        return {"flashcards": [
            {"question": "Error occurred", "answer": "Please try regenerating the flashcards."}
        ]}

@app.post("/api/mcqs")
async def generate_mcqs(request: TextRequest):
    try:
        # Add this helper function to fix malformed JSON
        def fix_malformed_mcq_json(json_str):
            # Fix missing colons after isCorrect
            json_str = json_str.replace('"isCorrect false', '"isCorrect": false')
            json_str = json_str.replace('"isCorrect true', '"isCorrect": true')
            
            # Fix other common issues
            json_str = json_str.replace(',,', ',')
            json_str = json_str.replace(',]', ']')
            json_str = json_str.replace(',}', '}')
            
            return json_str
            
        # Create agent and workflow
        agent = Agent(
            name="MCQ Generator Agent",
            instructions="""You are an assistant specialized in creating high-quality multiple-choice questions. 
            Focus on extracting key concepts, important facts, names, numbers, and definitions from the text.
            Create comprehensive multiple-choice questions that cover the main content of the text.
            Each question must have EXACTLY ONE correct answer and three plausible distractors.
            Each question must have a detailed explanation for why the correct answer is right and why others are wrong.
            
            IMPORTANT: Vary which option (A, B, C, or D) is the correct answer across different questions.
            Do not make option A always the correct answer - distribute correct answers randomly among all options.
            
            Analyze the content carefully and create an appropriate number of questions:
            - For simple or short content, create fewer questions (3-5)
            - For medium complexity or length, create a moderate number of questions (5-15)
            - For complex, detailed, or long content, create more questions (15-30)
            - Focus on quality over quantity - each question should test important knowledge
            
            Ensure questions cover all major topics, concepts, and important details in the text.""",
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            api_key=api_key,
            base_url="https://api.intelligence.io.solutions/api/v1"
        )
        
        # Add a unique ID to avoid workflow conflicts
        import uuid
        workflow_id = str(uuid.uuid4())
        workflow = Workflow(objective=request.text, client_mode=False)
        
        # First, let's analyze the content to determine appropriate question count
        analysis_prompt = f"""
        Analyze the following text and determine an appropriate number of multiple-choice questions to create.
        Consider the following factors:
        - Content complexity and depth
        - Number of distinct topics, concepts, or facts
        - Length and detail level of the text
        - Educational importance of various elements
        
        Return only a number representing your recommended question count.
        
        Text: {request.text[:2000]}... (text truncated for analysis)
        """
        
        # Get recommendation for question count
        analysis_result = (await workflow.custom(
            name="analyze-content",
            objective=analysis_prompt,
            instructions="Analyze the content and recommend an appropriate number of MCQs. Return only a number.",
            agents=[agent],
        ).run_tasks())["results"]
        
        # Try to extract a number from the analysis result
        try:
            import re
            number_match = re.search(r'\d+', str(analysis_result))
            if number_match:
                recommended_count = int(number_match.group())
                # Apply reasonable limits
                recommended_count = max(3, min(30, recommended_count))
            else:
                # Default if no number found
                recommended_count = 10
        except:
            recommended_count = 10
            
        print(f"Recommended MCQ count for this content: {recommended_count}")
        
        # Create custom prompt for MCQs with the recommended count
        custom_prompt = f"""
        Create approximately {recommended_count} multiple-choice questions (MCQs) based on the following text.
        The number of questions should be appropriate to cover the main content thoroughly.
        
        Focus on important information such as:
        - Key concepts and principles
        - Important names, dates, and numbers
        - Definitions and terminologies
        - Significant processes and relationships
        
        Each MCQ MUST have:
        1. A clear, concise question
        2. Four options (A, B, C, D) with EXACTLY ONE correct answer
        3. A detailed explanation for why the correct answer is right and why the others are incorrect
        
        IMPORTANT REQUIREMENT: Distribute the correct answers randomly among options A, B, C, and D.
        DO NOT always make option A the correct answer. Vary which option is correct across different questions.
        
        Format the output as a JSON array of objects with 'question', 'options', and 'explanation' properties.
        The 'options' should be an array of objects, each with 'text' and 'isCorrect' properties.
        
        IMPORTANT: Each question MUST have EXACTLY ONE option marked as correct (isCorrect: true) and the other three as incorrect (isCorrect: false).
        
        Example format:
        [
          {{
            "question": "What is the capital of France?",
            "options": [
              {{"text": "London", "isCorrect": false}},
              {{"text": "Paris", "isCorrect": true}},
              {{"text": "Berlin", "isCorrect": false}},
              {{"text": "Madrid", "isCorrect": false}}
            ],
            "explanation": "Paris is the capital of France. London is the capital of the UK, Berlin is the capital of Germany, and Madrid is the capital of Spain."
          }},
          {{
            "question": "Which element has the chemical symbol 'O'?",
            "options": [
              {{"text": "Osmium", "isCorrect": false}},
              {{"text": "Oxygen", "isCorrect": true}},
              {{"text": "Gold", "isCorrect": false}},
              {{"text": "Silver", "isCorrect": false}}
            ],
            "explanation": "Oxygen has the chemical symbol 'O'. Osmium is 'Os', Gold is 'Au', and Silver is 'Ag'."
          }},
          {{
            "question": "Who wrote 'Romeo and Juliet'?",
            "options": [
              {{"text": "Charles Dickens", "isCorrect": false}},
              {{"text": "Jane Austen", "isCorrect": false}},
              {{"text": "William Shakespeare", "isCorrect": true}},
              {{"text": "Mark Twain", "isCorrect": false}}
            ],
            "explanation": "William Shakespeare wrote 'Romeo and Juliet'. Charles Dickens wrote 'Oliver Twist', Jane Austen wrote 'Pride and Prejudice', and Mark Twain wrote 'Adventures of Huckleberry Finn'."
          }}
        ]
        
        Text: {request.text}
        """
        
        # Run custom task to generate MCQs
        results = (await workflow.custom(
            name="create-mcqs",
            objective=custom_prompt,
            instructions=f"Generate approximately {recommended_count} high-quality MCQs in JSON format with EXACTLY ONE correct answer per question. Make sure to vary which option (A, B, C, or D) is correct.",
            agents=[agent],
        ).run_tasks())["results"]
        
        # Parse the JSON from the results
        try:
            import re
            import json
            
            print("Raw MCQ results:", results)
            
            mcqs_data = None
            
            # Approach 1: Direct JSON parsing if results is already a list
            if isinstance(results, list):
                mcqs_data = results
            
            # Approach 2: If results is a dict with create-mcqs key
            elif isinstance(results, dict) and "create-mcqs" in results:
                mcqs_text = results["create-mcqs"]
                
                # Look for JSON array in the text between markdown code blocks
                json_match = re.search(r'```json\s*([\s\S]*?)\s*```', mcqs_text, re.DOTALL)
                if json_match:
                    json_str = json_match.group(1)
                    # Clean up the JSON string
                    json_str = json_str.replace('\n', ' ').strip()
                    # Fix malformed JSON
                    json_str = fix_malformed_mcq_json(json_str)
                    mcqs_data = json.loads(json_str)
                else:
                    # Try to find just a JSON array
                    json_match = re.search(r'\[\s*\{.*\}\s*\]', mcqs_text, re.DOTALL)
                    if json_match:
                        json_str = json_match.group(0)
                        # Fix malformed JSON
                        json_str = fix_malformed_mcq_json(json_str)
                        mcqs_data = json.loads(json_str)
            
            # Approach 3: Extract JSON array using regex if results is a string
            elif isinstance(results, str):
                # Look for JSON array in the text
                json_match = re.search(r'\[\s*\{.*\}\s*\]', results, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    # Clean up common formatting issues
                    json_str = json_str.replace('\n', ' ').strip()
                    # Fix malformed JSON
                    json_str = fix_malformed_mcq_json(json_str)
                    mcqs_data = json.loads(json_str)
            
            # Process the MCQs data if we found it
            if mcqs_data and isinstance(mcqs_data, list):
                # Validate and fix each MCQ to ensure exactly one correct answer
                for mcq in mcqs_data:
                    if "options" in mcq and isinstance(mcq["options"], list):
                        # Count correct answers
                        correct_count = sum(1 for opt in mcq["options"] if opt.get("isCorrect") is True)
                        
                        # If no correct answers, mark a random one as correct (not always the first)
                        if correct_count == 0 and len(mcq["options"]) > 0:
                            import random
                            random_index = random.randint(0, len(mcq["options"]) - 1)
                            mcq["options"][random_index]["isCorrect"] = True
                        
                        # If multiple correct answers, keep only one as correct (randomly)
                        if correct_count > 1:
                            # Find all correct options
                            correct_indices = [i for i, opt in enumerate(mcq["options"]) if opt.get("isCorrect") is True]
                            # Choose one randomly to keep as correct
                            import random
                            keep_index = random.choice(correct_indices)
                            # Set all others to incorrect
                            for i, opt in enumerate(mcq["options"]):
                                opt["isCorrect"] = (i == keep_index)
                
                return {"mcqs": mcqs_data}
            
            # If we get here, we couldn't parse the JSON
            raise ValueError("Could not extract valid JSON from the response")
            
        except Exception as parse_error:
            print(f"Failed to parse MCQs: {parse_error}")
            print(f"Results type: {type(results)}")
            print(f"Results content: {results}")
            
            # Create default MCQs as fallback with randomized correct answers
            import random
            default_mcqs = [
                {
                    "question": "What is the main topic of this text?",
                    "options": [
                        {"text": "The text content", "isCorrect": False},
                        {"text": "Something else", "isCorrect": True},
                        {"text": "Not related", "isCorrect": False},
                        {"text": "None of the above", "isCorrect": False}
                    ],
                    "explanation": "This is a default question because we couldn't parse the MCQs."
                },
                {
                    "question": "What should you do next?",
                    "options": [
                        {"text": "Try again", "isCorrect": False},
                        {"text": "Check your input", "isCorrect": False},
                        {"text": "Contact support", "isCorrect": True},
                        {"text": "None of the above", "isCorrect": False}
                    ],
                    "explanation": "This is a default question because we couldn't parse the MCQs."
                }
            ]
            return {"mcqs": default_mcqs}
            
    except Exception as e:
        print(f"Exception in MCQs generation: {str(e)}")
        # Return a default set of MCQs instead of an error with randomized correct answers
        import random
        correct_index = random.randint(0, 3)
        options = [
            {"text": "Try again", "isCorrect": False},
            {"text": "Check your input", "isCorrect": False},
            {"text": "Verify API connection", "isCorrect": False},
            {"text": "Contact support", "isCorrect": False}
        ]
        options[correct_index]["isCorrect"] = True
        
        default_mcqs = [
            {
                "question": "Error occurred while generating MCQs.",
                "options": options,
                "explanation": "There was an error generating MCQs. Please try again with different text."
            }
        ]
        return {"mcqs": default_mcqs}


@app.post("/api/translate")
async def translate_text(request: TranslationRequest):
    try:
        # Create agent and workflow
        agent = Agent(
            name="Translation Agent",
            instructions="You are an assistant specialized in translation. Translate text accurately while preserving meaning and context. Support multiple languages including Tamil, Hindi, Telugu, Malayalam, Bengali, Marathi, Urdu, Gujarati, Kannada, and others.",
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            api_key=api_key,
            base_url="https://api.intelligence.io.solutions/api/v1"
        )
        
        workflow = Workflow(objective=request.text, client_mode=False)
        
        # Get language display name for prompt clarity
        language_display_names = {
            "english": "English",
            "tamil": "Tamil (தமிழ்)",
            "hindi": "Hindi (हिन्दी)",
            "french": "French (Français)",
            "telugu": "Telugu (తెలుగు)",
            "malayalam": "Malayalam (മലയാളം)",
            "spanish": "Spanish (Español)",
            "german": "German (Deutsch)",
            "italian": "Italian (Italiano)",
            "portuguese": "Portuguese (Português)",
            "russian": "Russian (Русский)",
            "japanese": "Japanese (日本語)",
            "chinese": "Chinese (中文)",
            "arabic": "Arabic (العربية)",
            "korean": "Korean (한국어)",
            "bengali": "Bengali (বাংলা)",
            "marathi": "Marathi (मराठी)",
            "urdu": "Urdu (اردو)",
            "gujarati": "Gujarati (ગુજરાતી)",
            "kannada": "Kannada (ಕನ್ನಡ)"
        }
        
        target_language = language_display_names.get(request.targetLanguage, request.targetLanguage)
        
        # Create a custom prompt for better translation with specific language instructions
        custom_prompt = f"""
        Translate the following text into {target_language}:
        
        {request.text}
        
        Ensure the translation:
        1. Maintains the original meaning and context
        2. Uses natural phrasing in the target language
        3. Preserves paragraph structure and formatting
        4. Handles specialized terms appropriately
        5. Maintains the tone of the original text
        
        Return only the translated text without any additional explanations or metadata.
        """
        
        # Use custom task for better control over translation
        results = (await workflow.custom(
            name="enhanced-translation",
            objective=custom_prompt,
            instructions=f"Translate the text into {target_language} with high quality",
            agents=[agent],
        ).run_tasks())["results"]
        
        # Clean up the results
        if isinstance(results, dict) and "enhanced-translation" in results:
            translation = results["enhanced-translation"]
        else:
            translation = str(results)
            
        # Remove any "Translation:" prefix that might appear
        translation = translation.replace("Translation:", "").strip()
        
        return {"translation": translation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to translate text: {str(e)}")


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Create agent and workflow
        agent = Agent(
            name="Chat Assistant Agent",
            instructions="""You are a helpful study assistant that answers questions about various academic topics.
            Provide clear, concise, and accurate answers to help the user understand the subject matter.
            If you don't know the answer, admit it rather than making something up.
            Use examples and analogies when appropriate to help explain complex concepts.
            Format your responses as plain text without any JSON, markdown, or other formatting.""",
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            api_key=api_key,
            base_url="https://api.intelligence.io.solutions/api/v1"
        )
        
        # Prepare the prompt with chat history
        chat_history_text = ""
        if request.chatHistory and len(request.chatHistory) > 0:
            chat_history_text = "Previous conversation:\n"
            for msg in request.chatHistory:
                role = "User" if msg.role == "user" else "Assistant"
                chat_history_text += f"{role}: {msg.content}\n"
        
        prompt = f"""
        {chat_history_text}
        
        User's current question: {request.message}
        
        Please provide a helpful, educational response to this question.
        If the question refers to previous messages in the conversation, make sure to address those references.
        If the question is about a specific topic, explain the key concepts clearly.
        If it's a complex topic, break it down into simpler parts.
        
        FORMAT YOUR RESPONSE AS PLAIN TEXT ONLY.
        """
        
        if request.context:
            prompt += f"\n\nAdditional context provided by the user:\n{request.context}"
        
        workflow = Workflow(objective=prompt, client_mode=False)
        
        # Run custom task
        results = (await workflow.custom(
            name="direct-chat-response",
            objective=prompt,
            instructions="Provide a helpful educational response as plain text only",
            agents=[agent],
        ).run_tasks())["results"]
        
        # Clean up the results
        clean_response = results
        if isinstance(results, dict):
            # If results is a dictionary, extract text from any key
            for key in ["direct-chat-response", "chat-response", "response", "text", "answer"]:
                if key in results:
                    clean_response = results[key]
                    break
        
        # If it's still a dict or any non-string, convert to string
        if not isinstance(clean_response, str):
            clean_response = str(clean_response)
            
        # Remove any JSON formatting that might be present
        clean_response = clean_response.replace('```json', '').replace('```', '').strip()
        
        # If it still looks like JSON, try to extract the text
        if clean_response.startswith('{') and clean_response.endswith('}'):
            try:
                import json
                parsed = json.loads(clean_response)
                for key in ["response", "text", "answer", "content", "message"]:
                    if key in parsed:
                        clean_response = parsed[key]
                        break
            except:
                pass
        
        return {"response": clean_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get chat response: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
