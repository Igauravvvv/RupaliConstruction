import { useState, useRef, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

function getSessionId() {
  let id = sessionStorage.getItem("chat_session_id");
  if (!id) {
    id = "session_" + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("chat_session_id", id);
  }
  return id;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm the Rupali Construction AI assistant. How can I help you with your construction project today?" },
  ]);
  const [sessionId] = useState(getSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly through our contact page." },
      ]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    chatMutation.mutate({ sessionId, message: userMessage });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-[var(--rc-dark)] rotate-90"
            : "bg-[var(--rc-orange)] hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-2xl border border-[var(--rc-border)] flex flex-col overflow-hidden">
          <div className="px-5 py-4 bg-[var(--rc-blue)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Rupali Assistant</p>
              <p className="text-xs text-white/60">AI-powered construction guide</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-[var(--rc-orange)]"
                      : "bg-[var(--rc-blue)]/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-[var(--rc-blue)]" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--rc-orange)] text-white rounded-br-sm"
                      : "bg-[var(--rc-gray)] text-[var(--rc-dark)] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[var(--rc-blue)]/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-[var(--rc-blue)]" />
                </div>
                <div className="bg-[var(--rc-gray)] px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--rc-blue)]/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[var(--rc-blue)]/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[var(--rc-blue)]/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[var(--rc-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about construction..."
                className="flex-1 px-4 py-2.5 text-sm bg-[var(--rc-gray)] rounded-full border border-transparent focus:border-[var(--rc-blue)]/30 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={chatMutation.isPending || !input.trim()}
                className="w-10 h-10 rounded-full bg-[var(--rc-blue)] flex items-center justify-center hover:bg-[var(--rc-orange)] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
