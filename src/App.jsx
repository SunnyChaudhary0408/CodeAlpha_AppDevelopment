import { useState } from "react";
import FlashcardQuizApp from "./flashcard-quiz-app-dark";
import RandomQuoteGenerator from "./random-quote-generator";
import FitnessTrackerApp from "./fitness-tracker-app";

function App() {
  const [active, setActive] = useState("flashcards");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: 12, background: "#1B1B1B" }}>
        <button onClick={() => setActive("flashcards")}>Flashcards</button>
        <button onClick={() => setActive("quotes")}>Quotes</button>
        <button onClick={() => setActive("fitness")}>Fitness</button>
      </div>

      {active === "flashcards" && <FlashcardQuizApp />}
      {active === "quotes" && <RandomQuoteGenerator />}
      {active === "fitness" && <FitnessTrackerApp />}
    </div>
  );
}

export default App;