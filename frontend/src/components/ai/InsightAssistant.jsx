import { useState } from "react";
import api from "../../services/api";

function InsightAssistant({ selectedDatasetId }) {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text:
        "👋 Hello! I'm InsightIQ Assistant.\n\n" +
        "Ask me about your dataset, data quality, AutoML results, or predictions.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post(
        "/assistant/chat",
        {
          question: userQuestion,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          sender: "assistant",
          text: response.data.answer,
        },
      ]);
    } catch (error) {
      console.error("Assistant error:", error);

      setMessages((previous) => [
        ...previous,
        {
          sender: "assistant",
          text:
            "❌ I couldn't process your question. " +
            "Please make sure your dataset has been analyzed.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setQuestion(question);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        🤖 InsightIQ Assistant
      </h2>

      {/* Chat messages */}
      <div className="h-96 overflow-y-auto border rounded-xl p-4 bg-gray-50">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border shadow-sm"
              }`}
            >
              {message.text}
            </div>

          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border shadow-sm px-4 py-3 rounded-2xl">
              🤖 Thinking...
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="flex mt-5 gap-3">

        <input
          type="text"
          placeholder="Ask anything about your dataset..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

      {/* Suggested questions */}
      <div className="mt-5">

        <p className="font-semibold mb-3">
          Suggested Questions
        </p>

        <div className="flex flex-wrap gap-3">

          {[
            "How many rows are in my dataset?",
            "How many columns are there?",
            "What is the target column?",
            "What type of ML problem is this?",
            "Summarize my dataset",
          ].map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestedQuestion(q)}
              className="px-4 py-2 bg-gray-100 rounded-full hover:bg-blue-100 transition"
            >
              {q}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}

export default InsightAssistant;