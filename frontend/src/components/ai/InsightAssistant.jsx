import { useState } from "react";

function InsightAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "👋 Hello! I'm InsightIQ Assistant.\n\nI can help you understand your dataset, explain AI insights, AutoML results, and predictions.",
    },
  ]);

  const [question, setQuestion] = useState("");

  const handleSend = () => {
    if (!question.trim()) return;

    setMessages([
      ...messages,
      {
        sender: "user",
        text: question,
      },
    ]);

    setQuestion("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        🤖 InsightIQ Assistant
      </h2>

      <div className="h-96 overflow-y-auto border rounded-xl p-4 bg-gray-50">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`mb-4 flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>

          </div>

        ))}

      </div>

      <div className="flex mt-5 gap-3">

        <input
          type="text"
          placeholder="Ask anything about your dataset..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700"
        >
          Send
        </button>

      </div>

<div className="mt-5">

      <p className="font-semibold mb-3">
        Suggested Questions
      </p>

      <div className="flex flex-wrap gap-3">

        {[
          "Summarize my dataset",
          "Which column has missing values?",
          "Is my dataset good for ML?",
          "Which model performed best?",
          "Explain the prediction results",
        ].map((q) => (
          <button
            key={q}
            onClick={() => setQuestion(q)}
            className="px-4 py-2 bg-gray-100 rounded-full hover:bg-blue-100"
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