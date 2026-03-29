
import { Bot, Send, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ChatUI() {
  // Mock messages for demonstration
  const messages = [
    {
      id: 1,
      role: "ai",
      content: "Hello! How can I help you today?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      role: "user",
      content: "Can you help me with my project?",
      timestamp: "10:31 AM",
    },
    {
      id: 3,
      role: "ai",
      content:
        "Of course! I'd be happy to help you with your project. Could you tell me more about what you're working on and what specific assistance you need?",
      timestamp: "10:31 AM",
    },
    {
      id: 4,
      role: "user",
      content: "I'm building a mobile app and need some design advice",
      timestamp: "10:32 AM",
    },
    {
      id: 5,
      role: "ai",
      content:
        "Great! Mobile app design is exciting. Here are some key principles to consider:\n\n• Keep the interface simple and intuitive\n• Use consistent spacing and typography\n• Ensure touch targets are at least 44px\n• Consider thumb-friendly navigation\n\nWhat type of app are you building?",
      timestamp: "10:33 AM",
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-500 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-gray-900">AI Assistant</h1>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className={message.role === "user" ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}>
                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              <Card
                className={`p-3 ${
                  message.role === "user" ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </Card>
              <span className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-blue-500 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <Card className="p-3 bg-white border-gray-200">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </Card>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button size="icon" className="bg-blue-500 hover:bg-blue-600 flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
