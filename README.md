# 🚨 Disaster Lens

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2.svg?style=flat&logo=google)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC.svg?style=flat&logo=tailwindcss)

> **AI-Powered Rapid Damage Assessment & Safety Guide**

**Disaster Lens** is a life-saving web application that uses **Google's Gemini 2.5 Flash** multimodal model to analyze images of disaster scenes in real-time. It provides immediate structural assessments, hazard detection, and actionable safety instructions to aid first responders and civilians.

---

## ⚡ Key Features

*   **📸 Multi-Image Analysis**: Upload multiple photos of a scene (Flood, Fire, Earthquake, etc.) for comprehensive context.
*   **🧠 Intelligent Hazard Detection**: Automatically identifies dangers like gas leaks, live wires, structural instability, and flood depths.
*   **🚑 Rescue Priority Scoring**: Categorizes situations from **Low** to **Critical** to help prioritize resources.
*   **🛡️ Actionable Safety Steps**: Generates instant, step-by-step survival guides based on the specific visual evidence.
*   **📦 Resource Recommendations**: Suggests necessary equipment (medical kits, pumps, rescue gear) tailored to the scene.

---

## 🚀 How It Works

1.  **Upload**: User uploads images of the affected area.
2.  **Context**: (Optional) Select a specific disaster type (e.g., Cyclone, Building Collapse) and add notes.
3.  **Analyze**: The app sends data to **Gemini 2.5 Flash**, which processes visual and textual data simultaneously.
4.  **Result**: Receive a structured JSON response rendered into a clean, easy-to-read UI with severity badges and safety checklists.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19 (TypeScript)
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
*   **SDK**: `@google/genai`
*   **Icons**: Custom SVG Component Library

---

## 💻 Installation & Setup

1.  **Clone the repository**
    ```bash
    gh repo clone shah-shazid-askary/Disaster_Lens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_google_ai_studio_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm start
    ```

---

## 🤖 AI Model Details

This project leverages **Gemini 2.5 Flash** for its balance of speed and multimodal reasoning capabilities.

*   **Input**: Images (Base64) + Context Prompts.
*   **Output**: Structured JSON enforcing a strict schema for consistent UI rendering.
*   **Parameters**: Low temperature (0.4) for factual, deterministic safety advice.

---

## ⚠️ Disclaimer

*Disaster Lens is an AI-assisted tool intended for informational purposes. Always follow official government emergency instructions and consult professional first responders in real-world crisis situations.*

---

Made with ❤️ and 🤖 to help save lives.
