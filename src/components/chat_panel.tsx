import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { workspaceAtom, Message } from "../app";

export default function ChatPanel() {
  const [{ workspaces, selectedWorkspace, selectedChat }, setWorkspace] = useAtom(workspaceAtom);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.metaKey) {
        event.preventDefault();
        setInput(input + "\n");
      } else if (event.key === "Enter" && event.metaKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [input]
  );

  const handleSubmit = () => {
    if (input.trim()) {
      const newId = messages.length + 1
      addMessage({ id: newId, text: input });
      setInput("");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  if (!selectedWorkspace || !selectedChat) {
    return null;
  }

  const workspace = workspaces[selectedWorkspace];
  if (!workspace) return null;

  const chat = workspace.chats[selectedChat];
  if (!chat) return null;

  const messages = chat.messages;
  const addMessage = (message: Message) => {
    setWorkspace((prevWorkspace) => {
      const newWorkspace = { ...prevWorkspace };
      const oldMessages = prevWorkspace.workspaces[selectedWorkspace].chats[selectedChat].messages;
      newWorkspace.workspaces[selectedWorkspace].chats[selectedChat].messages = [...oldMessages, message];
      return newWorkspace;
    })
  }


  return (
    <div className="flex flex-col flex-grow">
      <div className="overflow-auto space-y-4 flex-grow">
        {messages.map((message) => (
          <div key={message.id} className="text-zinc-50 p-2 last:border-b border-zinc-900" >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center p-4">
        <textarea
          ref={inputRef}
          className="flex-grow border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};
