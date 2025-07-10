# 📚 Readio: AI-Powered Study Assistant

![Readio Logo](/frontend/public/Screenshot 2025-07-10 141933.png)

**Readio** is a powerful AI study assistant that transforms text into interactive learning materials. It helps students learn more effectively by generating **summaries**, **flashcards**, **MCQs**, **translations**, and provides **AI chat assistance**.

---

## 🌟 Features

### 📝 Content Processing
- ✏️ **Text Input** – Type or paste any text for processing
- 🖼️ **Image Text Extraction** – Extract text from images using `Llama-3.2-90B-Vision-Instruct`
- 📄 **PDF Processing** – Extract text from single pages or entire PDF documents

### 🧠 Study Material Generation
- 📑 **Smart Summarization** – Get concise, easy-to-understand summaries
- 🃏 **Interactive Flashcards** – Practice using automatically generated flashcards
- ❓ **MCQ Generation** – Test yourself with generated multiple choice questions
- 🌐 **Multi-language Translation** – Supports 20+ languages (Tamil, Hindi, Spanish, etc.)
- 💬 **AI Chat Assistant** – Ask questions and clarify doubts interactively

### ⚙️ Advanced Features
- 🔁 **Sequential Processing** – Generate all materials at once with background processing
- 📚 **PDF Navigation** – Choose specific pages for content extraction
- 📊 **Progress Tracking** – Visual indicators for processing status
- 📱 **Responsive Design** – Works smoothly on both desktop and mobile
- 🌙 **Dark/Light Mode** – Study in your preferred theme

---

## 🖥️ Tech Stack

### 🔷 Frontend
- **Next.js** – React framework for server-rendered applications
- **React** – UI component library
- **CSS Modules** – Scoped component styling
- **Firebase** – Authentication for secure user login

### 🔶 Backend
- **FastAPI** – High-performance Python web framework
- **IO Intelligence API** – For AI model integrations
- **PyPDF2** – PDF parsing and text extraction
- **Firebase** – Also used for user management

### 🧠 AI Models
- `Llama-3.2-90B-Vision-Instruct` – For OCR from images
- `Llama-4-Maverick-17B-128E-Instruct-FP8` – Summarization, flashcards, MCQs, translations

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js `v16+`
- Python `3.8+`
- IO Intelligence API key

### 📦 Installation

1. **Clone the repository**
```
git clone https://github.com/Agihtaws/READIO.git
cd readio 
```
2. **Install frontend dependencies**
```
npm install
```
3. **Setup .env.local in your frontend**
```
NEXT_PUBLIC_API_BASE_URL=https://api.intelligence.io.solutions
IO_API_KEY=your io api key
NEXT_PUBLIC_FIREBASE_API_KEY=your firebase api key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your firebase auth domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your firebase project id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your firebase storage bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your firebase messaging sender id
NEXT_PUBLIC_FIREBASE_APP_ID=your firebase app id
```
4. **Install backend dependencies**
```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install --upgrade iointel
```
5. **Setup .env in your backend**
```
IO_API_KEY=your io api key
```
6. **Start the backend server**
```
cd backend
python main.py
```
7. **Start the frontend development server**
```
npm run dev
```
 8. Open your browser and navigate to http://localhost:3000

## 📊 Usage Flow

- **Input Content**:  
  ⭐ Enter text directly, upload an image, or upload a PDF

- **Process Content**:  
  ⭐ Extract text from images/PDFs if needed

- **Generate Materials**:  
  ⭐ Click **"Generate Summary"** or **"Generate All Study Materials"**

- **Study with Tools**:  
  ⭐ Navigate between tabs to use different study materials:
  - 📘 Review the summary for a quick overview  
  - 🃏 Use flashcards for active recall practice  
  - ❓ Test yourself with MCQs  
  - 🌍 Translate content to other languages  
  - 💬 Ask questions in the chat for clarification  

---

## 🔒 Privacy & Security

- 🔐 **User Data**:  
  ⭐ Study materials are processed securely and not stored permanently

- 🧪 **Free Trial**:  
  ⭐ Non-registered users get **2 free uses per day**

- 🔑 **Authentication**:  
  ⭐ Secure user authentication with **Firebase**

- 🕵️ **Device Fingerprinting**:  
  ⭐ Uses **FingerprintJS** to track free trial usage
  
## 📁 Project Structure

 **readio/**  
&nbsp;&nbsp;&nbsp;&nbsp; **backend/**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `venv/` – Python virtual environment  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `.env` – Backend environment variables  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `main.py` – FastAPI server and endpoints  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `requirements.txt` – Python dependencies  

&nbsp;&nbsp;&nbsp;&nbsp; **frontend/**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `.next/` – Next.js build output (auto-generated)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `node_modules/` – Node.js packages  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `public/` – Static assets  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **src/**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **app/** – Pages and routes  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `about/` – About page  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `contact/` – Contact page  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `guide/` – User guide  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `login/` – Login page  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `privacy/` – Privacy policy  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `signup/` – Signup page  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `terms/` – Terms of service  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `page.tsx` – Main landing page  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **components/** – Reusable components  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Footer.tsx` – Footer UI  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Footer.module.css` – Footer styles  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Header.tsx` – Header UI  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Header.module.css` – Header styles  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `ProtectedRoute.tsx` – Route protection  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **contexts/**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `AuthContext.tsx` – Auth context  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **lib/**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `firebase.js` – Firebase config  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `usageTracker.js` – Free trial tracking  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `.env.local` – Frontend environment variables  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `.gitignore` – Files to ignore in Git  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `next-env.d.ts` – TypeScript env declarations  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `next.config.js` – Next.js config  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `package.json` – NPM config and dependencies  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `README.md` – Optional frontend readme  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `tsconfig.json` – TypeScript configuration  

## 📝 License

✨ This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## 🙏 Acknowledgments

✨ **IO Intelligence** – for advanced AI model integration  
✨ **Firebase** – for authentication services  
✨ **Next.js** – for the frontend framework  
✨ **FastAPI** – for the backend framework  


