import { useState, useRef, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { X, Send, User, ChevronLeft, Building2, Calculator, Image as ImageIcon, Ruler, Home, Wrench, PhoneCall, MessageCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function getSessionId() {
  let id = sessionStorage.getItem("chat_session_id");
  if (!id) {
    id = "session_" + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("chat_session_id", id);
  }
  return id;
}

const EXPRESSIONS = [
  { id: "welcome", image: "/CHAT-MODEL-WELCOME.png", messages: ["Hi 👋", "Hello!", "Namaskar 🙏", "Welcome!", "Hey there!"] },
  { id: "happy", image: "/CHAT-MODEL-HAPPY.png", messages: ["How are you doing today?", "Looking for your dream home?", "Excited to help you today!"] },
  { id: "talk", image: "/CHAT-MODEL-TALK.png", messages: ["Wanna talk to me about constructing your dream home?", "Let's build your dream together."] }
];

const TypingText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

// Types for the chatbot state machine
type FlowState = 
  | "welcome"
  | "main_menu"
  | "construct_form"
  | "cost_form"
  | "projects"
  | "architecture"
  | "interior"
  | "renovation"
  | "expert"
  | "free_chat";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(getSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [botExpression, setBotExpression] = useState<"idle" | "thinking" | "happy">("idle");
  const [input, setInput] = useState("");
  
  const [flowState, setFlowState] = useState<FlowState>("welcome");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string | React.ReactNode }[]>([]);
  
  // Guided forms state
  const [constructStep, setConstructStep] = useState(0);
  const [constructData, setConstructData] = useState<any>({});
  
  const [costStep, setCostStep] = useState(0);
  const [costData, setCostData] = useState<any>({});
  
  // Mutations
  const submitLead = trpc.chat.submitLead.useMutation();
  const submitCostRequest = trpc.chat.submitCostRequest.useMutation();
  const freeChat = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      addMessage("assistant", data.response);
      setBotExpression("happy");
      setTimeout(() => setBotExpression("idle"), 3000);
    }
  });
  const { data: projects } = trpc.chat.getProjects.useQuery(undefined, { enabled: flowState === "projects" });

  const getChatWindowBotImage = () => {
    switch (botExpression) {
      case "thinking": return "/CHAT-MODEL-TALK.png";
      case "happy": return "/CHAT-MODEL-HAPPY.png";
      default: return "/CHAT-MODEL-WELCOME.png";
    }
  };

  const addMessage = (role: "user" | "assistant", content: string | React.ReactNode) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, constructStep, costStep, flowState, freeChat.isPending]);

  // Initial Welcome Flow
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startWelcomeFlow();
    }
  }, [isOpen]);

  const startWelcomeFlow = () => {
    setMessages([
      { role: "assistant", content: (
        <div className="space-y-2">
          <p>🙏 Namaste!</p>
          <p>Welcome to Rupali Construction.</p>
          <p>I'm Rupali.</p>
          <p>I'll help you estimate your project, understand construction costs, explore our completed projects and connect you with our experts.</p>
          <p>How may I help you today?</p>
        </div>
      )}
    ]);
    setFlowState("welcome");
  };

  const handleGreetingClick = (greeting: string) => {
    addMessage("user", greeting);
    setTimeout(() => {
      addMessage("assistant", (
        <div className="space-y-2">
          <p>Hello!</p>
          <p>Welcome to Rupali Construction.</p>
          <p>How can I help you today?</p>
        </div>
      ));
      setFlowState("main_menu");
    }, 500);
  };

  const showMainMenu = () => {
    setFlowState("main_menu");
  };

  const handleMenuSelect = (option: string, nextState: FlowState | "redirect_projects") => {
    addMessage("user", option);
    
    if (nextState === "redirect_projects") {
      setTimeout(() => {
        addMessage("assistant", "Taking you to our portfolio...");
        setTimeout(() => {
          window.location.href = "/projects";
        }, 1000);
      }, 500);
      return;
    }

    setTimeout(() => {
      setFlowState(nextState as FlowState);
      if (nextState === "construct_form") {
        setConstructStep(1);
        setConstructData({});
      } else if (nextState === "cost_form") {
        setCostStep(1);
        setCostData({});
      } else if (nextState === "free_chat") {
        addMessage("assistant", "Sure, what would you like to know?");
      } else if (nextState === "expert") {
        addMessage("assistant", "Our experts are ready to assist you. Choose how you'd like to connect:");
      } else if (nextState === "projects") {
        addMessage("assistant", "Here are some of our featured projects:");
      } else {
        // architecture, interior, renovation simple collection
        addMessage("assistant", `I can help you with ${option}. Please provide your contact details so our expert can reach out to you.`);
        setConstructStep(8); // jump to contact collection
        setConstructData({ enquiryType: nextState });
        setFlowState("construct_form");
      }
    }, 500);
  };

  const handleConstructAnswer = (field: string, value: string, nextStep: number) => {
    setConstructData(prev => ({ ...prev, [field]: value }));
    addMessage("user", value);
    setTimeout(() => setConstructStep(nextStep), 300);
  };

  const submitConstructForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      ...constructData,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      preferredCallTime: formData.get("time") as string,
    };
    
    addMessage("user", "Submitted contact details");
    
    try {
      const res = await submitLead.mutateAsync(data);
      addMessage("assistant", (
        <div className="space-y-2">
          <p>🎉 Thank you!</p>
          <p>Our consultant will contact you shortly.</p>
          <p>Your enquiry ID: <strong>{res.referenceId}</strong></p>
        </div>
      ));
      setFlowState("main_menu");
    } catch (err) {
      addMessage("assistant", "Sorry, there was an error submitting your request. Please try again.");
    }
  };

  // Cost Form Logic
  const handleCostAnswer = (field: string, value: any, nextStep: number) => {
    setCostData(prev => ({ ...prev, [field]: value }));
    addMessage("user", value.toString());
    setTimeout(() => setCostStep(nextStep), 300);
  };

  const calculateCost = () => {
    // Simple mock calculation based on quality
    let rate = 1800; // standard
    if (costData.quality === "Basic") rate = 1200;
    if (costData.quality === "Premium") rate = 2500;
    if (costData.quality === "Luxury") rate = 3500;
    
    const size = parseInt(costData.plotSize) || 1000;
    const floors = parseInt(costData.floors) || 1;
    const totalArea = size * floors;
    const estimatedCost = totalArea * rate;
    
    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    
    return {
      area: totalArea,
      cost: formatter.format(estimatedCost),
      rate
    };
  };

  const submitCostForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const estimate = calculateCost();
    
    const data = {
      ...costData,
      estimatedCost: estimate.cost,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    };
    
    addMessage("user", "Requested detailed quote");
    
    try {
      const res = await submitCostRequest.mutateAsync(data);
      addMessage("assistant", `Thank you! Your reference ID is ${res.referenceId}. Our team will contact you with a detailed quotation soon.`);
      setFlowState("main_menu");
    } catch (err) {
      addMessage("assistant", "Sorry, there was an error. Please try again.");
    }
  };

  // Free chat
  const handleSendFreeChat = () => {
    if (!input.trim() || freeChat.isPending) return;
    addMessage("user", input.trim());
    setBotExpression("thinking");
    freeChat.mutate({ sessionId, message: input.trim() });
    setInput("");
  };

  // --- Floating Assistant State ---
  const [hasMounted, setHasMounted] = useState(false);
  const [exprIndex, setExprIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    EXPRESSIONS.forEach(exp => {
      const img = new Image();
      img.src = exp.image;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
      setCurrentMessage(EXPRESSIONS[0].messages[Math.floor(Math.random() * EXPRESSIONS[0].messages.length)]);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasMounted || isHovered || isOpen) return;
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        const nextIndex = (exprIndex + 1) % EXPRESSIONS.length;
        setExprIndex(nextIndex);
        setCurrentMessage(EXPRESSIONS[nextIndex].messages[Math.floor(Math.random() * EXPRESSIONS[nextIndex].messages.length)]);
        setIsChanging(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasMounted, isHovered, exprIndex, isOpen]);

  return (
    <>
      <div className="fixed bottom-0 -left-2 md:left-6 z-50 flex flex-col items-start pointer-events-none">
        <AnimatePresence>
          {hasMounted && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="relative flex flex-col items-center pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                {!isChanging && (
                  <motion.div
                    key={currentMessage}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-8 md:bottom-12 left-[60%] md:left-[90%] w-max max-w-[240px] md:max-w-[550px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center p-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] cursor-pointer hover:bg-black/50 transition-colors z-10 overflow-hidden"
                    onClick={() => setIsOpen(true)}
                  >
                    <div className="pl-2 md:pl-4 pr-1 md:pr-3 flex items-center gap-1.5 md:gap-3 overflow-hidden">
                      <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-[var(--rc-orange)] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.603 0c-.085 4.542-2.146 7.61-5.59 9.38 3.514 1.792 5.518 4.908 5.617 9.421.1-4.48 2.213-7.531 5.753-9.284-3.527-1.742-5.63-4.9-5.78-9.517zM5.19 15.698c-.046 2.443-1.155 4.095-3.007 5.048 1.89.964 2.969 2.641 3.023 5.07.053-2.41 1.19-4.053 3.095-4.996-1.898-.938-3.029-2.637-3.11-5.122z"/></svg>
                      <span className="text-gray-200 text-[9px] md:text-[13px] font-medium leading-tight max-w-[80px] md:max-w-none md:whitespace-nowrap pr-1">
                        <TypingText text={currentMessage} />
                      </span>
                    </div>
                    <button className="flex-shrink-0 bg-[#0A2647] text-white px-2.5 md:px-5 py-1.5 md:py-2.5 rounded-full text-[9px] md:text-xs font-bold tracking-wide md:tracking-widest uppercase flex items-center gap-1 md:gap-2 shadow-inner border border-white/5 hover:bg-[var(--rc-orange)] hover:border-transparent transition-all duration-300">
                      Let's Talk
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9, y: -10 }}
                className="relative w-32 md:w-48 h-auto flex items-end justify-center drop-shadow-2xl z-0 cursor-pointer"
                animate={isHovered ? {} : { y: [0, -6, 0], scale: [1, 1.01, 1] }}
                transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              >
                <motion.img 
                  key={EXPRESSIONS[exprIndex].image}
                  src={EXPRESSIONS[exprIndex].image}
                  alt="AI Assistant"
                  className="w-full h-auto object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: isChanging ? 0 : 1, scale: isChanging ? 0.95 : 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 md:bottom-28 left-0 md:left-6 z-50 w-full md:w-[420px] h-[100dvh] md:h-[650px] max-h-[calc(100vh-140px)] bg-[#F8F9FC] md:rounded-2xl shadow-2xl border border-[var(--rc-border)] flex flex-col overflow-hidden origin-bottom-left"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#0B2D5C] flex items-center justify-between shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 bg-white/10 rounded-full overflow-hidden border border-white/20">
                   <img src={getChatWindowBotImage()} alt="Rupali" className="w-full h-full object-cover translate-y-2 scale-110" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-white">👩‍💼 Rupali</p>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  </div>
                  <p className="text-xs text-white/80 font-medium tracking-wide">Your Construction Partner</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {flowState !== "welcome" && flowState !== "main_menu" && (
                  <button onClick={showMainMenu} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" title="Main Menu">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-[var(--rc-orange)] rounded-full" : "bg-white rounded-full shadow-sm border border-gray-100"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <img src="/CHAT-MODEL-WELCOME.png" alt="Rupali" className="w-full h-full object-cover translate-y-1 scale-110 rounded-full" />}
                  </div>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-[#0B2D5C] text-white rounded-tr-sm" : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {freeChat.isPending && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                    <img src="/CHAT-MODEL-TALK.png" alt="Rupali" className="w-full h-full object-cover translate-y-1 scale-110 rounded-full" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 flex items-center h-[44px]">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Controls based on Flow State */}
              <div className="pl-10 space-y-2 mt-4 pb-4">
                
                {flowState === "welcome" && (
                  <div className="flex flex-wrap gap-2">
                    {["👋 Hi", "😊 Hello", "🙏 Namaste", "👋 Good Morning", "🌇 Good Evening"].map(g => (
                      <button key={g} onClick={() => handleGreetingClick(g)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-[var(--rc-orange)] hover:text-[var(--rc-orange)] transition-colors shadow-sm">{g}</button>
                    ))}
                  </div>
                )}

                {flowState === "main_menu" && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { icon: <Home className="w-4 h-4 md:w-4 md:h-4"/>, text: "I want to Construct", next: "construct_form" },
                      { icon: <Calculator className="w-4 h-4 md:w-4 md:h-4"/>, text: "Know Cost", next: "cost_form" },
                      { icon: <ImageIcon className="w-4 h-4 md:w-4 md:h-4"/>, text: "View Projects", next: "redirect_projects" },
                      { icon: <Ruler className="w-4 h-4 md:w-4 md:h-4"/>, text: "Architecture", next: "architecture" },
                      { icon: <Building2 className="w-4 h-4 md:w-4 md:h-4"/>, text: "Interior Design", next: "interior" },
                      { icon: <Wrench className="w-4 h-4 md:w-4 md:h-4"/>, text: "Renovation", next: "renovation" },
                      { icon: <PhoneCall className="w-4 h-4 md:w-4 md:h-4"/>, text: "Talk to Expert", next: "expert" },
                      { icon: <Info className="w-4 h-4 md:w-4 md:h-4"/>, text: "Other Questions", next: "free_chat" },
                    ].map(opt => (
                      <button 
                        key={opt.text} 
                        onClick={() => handleMenuSelect(opt.text, opt.next as FlowState)}
                        className="flex flex-col items-center justify-center gap-1.5 p-2 md:p-3 bg-white border border-gray-200 rounded-xl hover:border-[var(--rc-blue)] hover:shadow-md transition-all text-center text-[10px] md:text-sm font-medium text-gray-700 hover:text-[var(--rc-blue)]"
                      >
                        <div className="bg-blue-50 p-1.5 md:p-1.5 rounded-lg text-[var(--rc-blue)]">{opt.icon}</div>
                        <span className="leading-tight">{opt.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Flow 1: Construct Property Form */}
                {flowState === "construct_form" && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {constructStep} of 8</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5,6,7,8].map(s => (
                          <div key={s} className={`h-1.5 w-4 rounded-full ${s <= constructStep ? 'bg-[var(--rc-orange)]' : 'bg-gray-100'}`} />
                        ))}
                      </div>
                    </div>

                    {constructStep === 1 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Where is your project located?</p>
                        <div className="grid gap-2">
                          <input type="text" placeholder="State" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" id="state" />
                          <input type="text" placeholder="City" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" id="city" />
                          <input type="text" placeholder="Area / Locality" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" id="area" />
                          <button onClick={() => {
                            const state = (document.getElementById('state') as HTMLInputElement).value;
                            const city = (document.getElementById('city') as HTMLInputElement).value;
                            const area = (document.getElementById('area') as HTMLInputElement).value;
                            if(city && area) handleConstructAnswer('location', `${city}, ${area}, ${state}`, 2);
                          }} className="bg-[var(--rc-blue)] text-white p-2 rounded-lg text-sm font-medium hover:bg-[var(--rc-orange)] transition-colors mt-2">Next</button>
                        </div>
                      </div>
                    )}
                    {constructStep === 2 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">What type of project is this?</p>
                        <div className="flex flex-wrap gap-2">
                          {["Residential", "Commercial", "Villa", "Apartment", "Farm House", "Office", "Warehouse", "Others"].map(opt => (
                            <button key={opt} onClick={() => handleConstructAnswer('projectType', opt, opt === 'Residential' ? 3 : 4)} className="px-4 py-2 border rounded-lg text-sm hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {constructStep === 3 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Which type of residential property?</p>
                        <div className="flex flex-wrap gap-2">
                          {["Independent House", "Duplex", "Triplex", "Bungalow", "Apartment", "Others"].map(opt => (
                            <button key={opt} onClick={() => handleConstructAnswer('residentialType', opt, 4)} className="px-4 py-2 border rounded-lg text-sm hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {constructStep === 4 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Approximate Plot Size</p>
                        <div className="flex flex-wrap gap-2">
                          {["Under 1000 sq ft", "1000–1500 sq ft", "1500–2500 sq ft", "2500–5000 sq ft", "5000+ sq ft", "Not Sure"].map(opt => (
                            <button key={opt} onClick={() => handleConstructAnswer('plotSize', opt, 5)} className="px-4 py-2 border rounded-lg text-sm hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {constructStep === 5 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Construction Stage</p>
                        <div className="grid gap-2">
                          {["Need Architecture Design", "Need Construction", "Need Both (Turnkey)", "Already Have Plan", "Need Consultation"].map(opt => (
                            <button key={opt} onClick={() => handleConstructAnswer('constructionStage', opt, 6)} className="px-4 py-2 border rounded-lg text-sm text-left hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {constructStep === 6 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Estimated Budget</p>
                        <div className="flex flex-wrap gap-2">
                          {["Under ₹25 Lakh", "₹25–50 Lakh", "₹50 Lakh–1 Cr", "₹1–2 Cr", "₹2 Cr+", "Not Sure"].map(opt => (
                            <button key={opt} onClick={() => handleConstructAnswer('budget', opt, 7)} className="px-4 py-2 border rounded-lg text-sm hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {constructStep === 7 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Expected Start Time</p>
                        <div className="grid gap-2">
                          {["Immediately", "Within 1 Month", "Within 3 Months", "Within 6 Months", "Just Exploring"].map(opt => (
                            <button key={opt} onClick={() => handleConstructAnswer('timeline', opt, 8)} className="px-4 py-2 border rounded-lg text-sm text-left hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {constructStep === 8 && (
                      <form onSubmit={submitConstructForm} className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Please provide your contact details</p>
                        <input required name="name" type="text" placeholder="Full Name" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                        <input required name="phone" type="tel" placeholder="Phone Number" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" pattern="[0-9]{10}" title="10 digit mobile number" />
                        <input required name="email" type="email" placeholder="Email Address" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                        <select name="time" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)] bg-white">
                          <option value="Anytime">Preferred Time to Call: Anytime</option>
                          <option value="Morning">Morning (9 AM - 12 PM)</option>
                          <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="Evening">Evening (4 PM - 7 PM)</option>
                        </select>
                        <button type="submit" disabled={submitLead.isPending} className="w-full bg-[var(--rc-orange)] text-white p-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#e05a10] transition-colors disabled:opacity-50">
                          {submitLead.isPending ? "Submitting..." : "Submit Enquiry"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Flow 2: Cost Estimator Form */}
                {flowState === "cost_form" && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimator</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <div key={s} className={`h-1.5 w-4 rounded-full ${s <= costStep ? 'bg-[var(--rc-orange)]' : 'bg-gray-100'}`} />
                        ))}
                      </div>
                    </div>

                    {costStep === 1 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">City</p>
                        <input type="text" id="cost_city" placeholder="e.g. Gurgaon, Delhi" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                        <button onClick={() => {
                          const val = (document.getElementById('cost_city') as HTMLInputElement).value;
                          if(val) handleCostAnswer('city', val, 2);
                        }} className="w-full bg-[var(--rc-blue)] text-white p-2 rounded-lg text-sm font-medium hover:bg-opacity-90">Next</button>
                      </div>
                    )}
                    {costStep === 2 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Property Type</p>
                        <div className="grid gap-2">
                          {["Residential House", "Commercial Building", "Villa"].map(opt => (
                            <button key={opt} onClick={() => handleCostAnswer('propertyType', opt, 3)} className="px-4 py-2 border rounded-lg text-sm hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors text-left">{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {costStep === 3 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Plot Size & Floors</p>
                        <input type="number" id="cost_size" placeholder="Plot Size (sq ft)" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                        <input type="number" id="cost_floors" placeholder="Number of Floors" defaultValue="1" min="1" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                        <button onClick={() => {
                          const size = (document.getElementById('cost_size') as HTMLInputElement).value;
                          const floors = (document.getElementById('cost_floors') as HTMLInputElement).value;
                          if(size && floors) {
                            setCostData(prev => ({...prev, plotSize: size, floors: parseInt(floors)}));
                            addMessage("user", `${size} sq ft, ${floors} floors`);
                            setTimeout(() => setCostStep(4), 300);
                          }
                        }} className="w-full bg-[var(--rc-blue)] text-white p-2 rounded-lg text-sm font-medium hover:bg-opacity-90">Next</button>
                      </div>
                    )}
                    {costStep === 4 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Construction Quality</p>
                        <div className="grid gap-2">
                          {[
                            { name: "Basic", desc: "Standard materials, simple finishes" },
                            { name: "Standard", desc: "Good quality materials, modern finishes" },
                            { name: "Premium", desc: "Branded materials, excellent finishes" },
                            { name: "Luxury", desc: "Imported materials, bespoke finishes" }
                          ].map(opt => (
                            <button key={opt.name} onClick={() => {
                              setCostData(prev => ({...prev, quality: opt.name}));
                              addMessage("user", opt.name);
                              setTimeout(() => setCostStep(5), 300);
                            }} className="p-3 border rounded-lg text-left hover:border-[var(--rc-blue)] hover:bg-blue-50 transition-colors">
                              <p className="text-sm font-bold text-[var(--rc-blue)]">{opt.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {costStep === 5 && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Estimated Cost</p>
                          <p className="text-2xl font-bold text-[var(--rc-blue)]">{calculateCost().cost}</p>
                          <p className="text-xs text-gray-500 mt-2">Total built-up area: {calculateCost().area} sq ft</p>
                          <p className="text-xs text-gray-400">(*Approximate estimate based on current market rates)</p>
                        </div>
                        <p className="text-sm font-medium text-center text-gray-700">Would you like an accurate, detailed quotation?</p>
                        <form onSubmit={submitCostForm} className="space-y-3">
                          <input required name="name" type="text" placeholder="Full Name" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                          <input required name="phone" type="tel" placeholder="Phone Number" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" pattern="[0-9]{10}" />
                          <input required name="email" type="email" placeholder="Email Address" className="border p-2 rounded-lg text-sm w-full outline-none focus:border-[var(--rc-blue)]" />
                          <button type="submit" disabled={submitCostRequest.isPending} className="w-full bg-[var(--rc-orange)] text-white p-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#e05a10] transition-colors disabled:opacity-50">
                            {submitCostRequest.isPending ? "Sending..." : "Get Detailed Quote"}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Flow 3: View Projects */}
                {flowState === "projects" && (
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-4">
                    {projects?.map(project => (
                      <div key={project.id} className="min-w-[240px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 snap-center shrink-0">
                        <div className="h-32 bg-gray-200 relative">
                           {project.images && <img src={JSON.parse(project.images)[0]} alt={project.name} className="w-full h-full object-cover" />}
                           <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">{project.type}</div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-sm text-[var(--rc-dark)]">{project.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{project.location}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs font-medium text-[var(--rc-orange)]">{project.area}</span>
                            <a href={`/projects/${project.slug}`} className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-md font-bold hover:bg-[var(--rc-blue)] hover:text-white transition-colors uppercase">View</a>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!projects?.length && <p className="text-sm text-gray-500">Loading projects...</p>}
                  </div>
                )}

                {/* Flow 7: Talk to Expert */}
                {flowState === "expert" && (
                  <div className="grid gap-2">
                    <a href="tel:+919311830088" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-[var(--rc-blue)] hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-full text-[var(--rc-blue)]"><PhoneCall className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-bold text-[var(--rc-dark)]">Call Now</p>
                          <p className="text-xs text-gray-500">Speak directly to our consultant</p>
                        </div>
                      </div>
                    </a>
                    <a href="https://wa.me/919311830088" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-50 p-2 rounded-full text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--rc-dark)]">WhatsApp</p>
                          <p className="text-xs text-gray-500">Chat with our team instantly</p>
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area (Only for free chat) */}
            {flowState === "free_chat" && (
              <div className="p-3 border-t border-[var(--rc-border)] bg-white z-10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleSendFreeChat() }}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 text-sm bg-gray-50 rounded-full border border-gray-200 focus:border-[var(--rc-blue)]/50 focus:ring-2 focus:ring-[var(--rc-blue)]/20 focus:outline-none transition-all"
                  />
                  <button
                    onClick={handleSendFreeChat}
                    disabled={freeChat.isPending || !input.trim()}
                    className="w-11 h-11 rounded-full bg-[var(--rc-blue)] flex items-center justify-center shadow-md hover:bg-[var(--rc-orange)] hover:scale-105 transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-white ml-0.5" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Disclaimer for other flows */}
            {flowState !== "free_chat" && (
              <div className="p-3 bg-white border-t border-gray-100 text-center text-[10px] text-gray-400">
                Rupali Construction Consultant • Replied instantly
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
