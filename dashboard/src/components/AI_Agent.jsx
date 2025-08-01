import React, { useState, useRef, useEffect } from "react";

const AIAgent = ({ onAgentComplete, setGeneratedImage }) => {
  const [userPrompt, setUserPrompt] = useState("");
  //   const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSend = async () => {
    if (!userPrompt.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: userPrompt,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    const currentPrompt = userPrompt;
    setUserPrompt("");

    try {
      const res = await fetch("https://waitinglist-bvqo.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data && data.result) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content:
            "Here’s your agent, boss. Steve from the blockchain, printing money while flexin’ in his hoodie. Want to tweak anything?",
          image: data.result,
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, botMessage]);
        setGeneratedImage(data.result);
      } else {
        throw new Error("No image URL received from server");
      }
    } catch (err) {
      console.error("Image generation failed:", err);
      setError(err.message);
      const errorMessage = {
        id: Date.now() + 2,
        type: "bot",
        content: `Sorry, I couldn't generate that image. ${err.message}`,
        isError: true,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[85vh] w-full bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white flex flex-col overflow-hidden font-sans">
      {/* Header */}
      {/* <div className="text-center py-10 border-b border-gray-800 mt-[-60]">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">CF</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">CF Agent Maker</h1>
        <p className="text-sm text-gray-400 mt-1">
          Build your AI-powered trading companion
        </p>
      </div> */}

      {/* Chat Area */}
      <div className="flex-1 px-6 py-8 overflow-y-auto space-y-8" ref={chatContainerRef}>
        {/* First bot message */}
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src="/agents/cflogo.png"
              alt="CoinFantasy"
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div className="ml-3 bg-[#1c1c1c] text-sm text-white px-4 py-3 rounded-2xl max-w-[80%] shadow">
            Yo! Ready to cook up your AI Agent's identity? Let's design a visual
            that screams you. What kind of vibe are we going for?
          </div>
        </div>

        {/* Chat History */}
        {chatHistory.map((message) => (
          <div key={message.id}>
            {message.type === "user" ? (
              <div className="flex justify-end items-start">
                <div className="mr-3 bg-[#1f1f1f]  font-mono px-4 py-3 rounded-2xl shadow text-sm max-w-[80%] break-words">
                  {message.content}
                </div>
                <div className="w-6 h-6 bg-green-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-xs">U</span>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="w-6 h-6 bg-lime-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src="/agents/cflogo.png"
                    alt="CoinFantasy"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div className="ml-3 bg-[#1c1c1c] text-sm text-white px-4 py-3 rounded-2xl max-w-[80%] shadow">
                  <div className={message.isError ? "text-red-400" : ""}>
                    {message.content}
                  </div>
                  {message.image && (
                    <div className="mt-3">
                      <img
                        src={message.image}
                        alt="Generated AI Agent"
                        className="w-40 h-40 rounded-xl object-cover border border-gray-700 transition-opacity duration-500 opacity-0"
                        onLoad={(e) =>
                          e.currentTarget.classList.add("opacity-100")
                        }
                        onError={() =>
                          setError("Failed to load the generated image")
                        }
                      />
                      <p className="mt-2 text-sm text-gray-300">
                        Here’s your agent avatar. Want to tweak anything? Edit
                        the prompt above.{" "}
                        <button
                          onClick={() =>
                            typeof onAgentComplete === "function" &&
                            onAgentComplete()
                          }
                          className="text-lime-300 hover:underline focus:outline-none"
                        >
                          Activate Agent.
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex items-start">
            <div className="w-6 h-6 bg-lime-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-xs">CF</span>
            </div>
            <div className="ml-3 bg-[#1c1c1c] text-sm text-white px-4 py-3 rounded-2xl max-w-[80%] shadow">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-lime-300 border-t-transparent rounded-full"></div>
                <span>
                  Here’s your agent, boss. Steve from the blockchain, printing
                  money while flexin’ in his hoodie. Want to tweak anything?
                </span>
              </div>
              <div className="mt-3 w-40 h-40 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center opacity-70 border border-gray-700 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="w-full px-6 pb-6">
        <div className="flex items-center bg-[#1a1a1a]/60 backdrop-blur-md rounded-full px-4 py-3 border border-gray-700 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 10-5.656-5.656L6.343 9.343a6 6 0 108.485 8.485L21 11"
            />
          </svg>

          <input
            type="text"
            placeholder="Confused by trade? Ask away."
            className="flex-1 bg-transparent outline-none text-sm text-white px-3 placeholder-gray-500"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || !userPrompt.trim()}
            className="w-8 h-8 flex items-center justify-center bg-lime-300 text-black rounded-full hover:bg-lime-200 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>

        {error && <div className="mt-2 text-xs text-red-400 px-4">{error}</div>}
      </div>
    </div>
  );
};

export default AIAgent;
