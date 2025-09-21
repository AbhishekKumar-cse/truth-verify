# Truth Lens: AI-Powered Misinformation Detection Platform

**Truth Lens** is a sophisticated, full-stack web application designed to combat the spread of misinformation. It empowers users with a powerful suite of tools to fact-check claims, analyze data trends, and stay informed with an AI-curated feed of fact-checked news. The entire platform is powered by Google's Gemini AI through the Genkit framework.

This project is built on a modern, server-component-first architecture using Next.js and leverages Firebase for backend services, including authentication and a real-time Firestore database.

## Key Features

- **AI Fact-Checking Engine**: Users can submit any claim and receive a detailed, AI-generated analysis which includes:
  - A concise **Verdict** (e.g., "Highly Misleading," "Factually Correct").
  - A numerical **Truth Score** (from 0-100) for a nuanced understanding.
  - A detailed **Explanation** outlining the reasoning behind the verdict.
  - A list of **Credible Sources** to support the AI's analysis.

- **AI-Curated News Feed**: The dashboard features a live feed of the latest news headlines, automatically fact-checked by the AI. Users can refresh this feed on-demand to get the most current analysis.

- **Secure User Authentication**: A complete and secure user management system built with Firebase Authentication, providing user registration, login, and persistent sessions.

- **Personalized User Dashboard**: A private, authenticated dashboard where users can submit new claims and view their results. It features:
  - **Interactive Data Visualizations**: A collection of charts (built with Recharts) that provide insights into misinformation trends, detection accuracy, and distribution across different categories.
  - A seamless interface to view newly generated reports.

- **Personal Report History**: A dedicated page (`/reports`) where users can browse a complete history of all the fact-check reports they have personally generated.

- **Detailed Report Views**: Users can click on any of their own reports or on a news feed item to navigate to a detailed, shareable page that displays the full analysis.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Framework**: [Genkit (by Google)](https://firebase.google.com/docs/genkit)
- **AI Model**: [Google Gemini](https://ai.google/gemini/)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- A Firebase project with Firestore and Authentication enabled.
- A Google AI (Gemini) API key.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/truth-lens.git
    cd truth-lens
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root of your project and add your Firebase project configuration keys and your Gemini API key:
    ```env
    # Firebase Client SDK Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:...

    # Firebase Admin SDK (for server-side operations)
    # Paste the entire contents of your service account JSON file here.
    FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}

    # Google AI (Gemini) API Key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or your configured port) to view it in the browser.
