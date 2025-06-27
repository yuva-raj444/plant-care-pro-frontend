# 🌿 PlantCare Pro — AI Plant Disease Diagnosis

**PlantCare Pro** is a web app that diagnoses plant diseases from photos using **Google Gemini 2.0 Flash Lite API**.

Upload a photo of your plant and get instant, AI-powered analysis with treatment and prevention tips.

---

## 🚀 Features

✅ Upload plant images from your device  
✅ Uses Gemini AI for accurate diagnosis  
✅ Displays:
- Disease name
- Confidence level
- Severity
- Description
- Treatment plan
- Prevention tips

✅ Built with:
- Next.js (React framework)
- Tailwind CSS for UI
- Typescript
- Vercel for deployment

---

## 🖼 How It Works

1. User uploads a plant photo
2. Frontend converts the photo to Base64
3. Sends Base64 image to the backend (`/api/diagnose`)
4. Backend calls Gemini API with the photo
5. Gemini responds with a diagnosis in JSON
6. Frontend displays the result beautifully!

---

## 💻 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/plantcare-pro.git
cd plantcare-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env.local`

Create a file named `.env.local` in the root folder:

```
GEMINI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxx
```

✅ Replace with your actual Gemini API key.

---

### 4. Run the App

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```


## 📂 Project Structure

```
src/
  pages/
    index.tsx          // Main UI
    _app.tsx           // Next.js app wrapper
    api/
      diagnose.ts      // Backend API route to call Gemini
  styles/
    globals.css
```

