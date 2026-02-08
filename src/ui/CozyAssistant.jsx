/**
 * CozyAssistant — A warm, friendly voice-style AI assistant
 * Helps users manage tasks through natural language commands
 */
import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import audio from '../audio/AudioEngine';

// Cozy response templates
const RESPONSES = {
    greetings: [
        "Hi there, sunshine! ☀️ How can I help you today?",
        "Hello, friend! 🌸 Ready to get things done together?",
        "Hey! 🌿 I'm here to help. What's on your mind?",
    ],
    taskAdded: [
        "All done! I've added it for you 🌟",
        "Got it! Your task is ready and waiting ✨",
        "Added! You're doing great organizing things 🌸",
        "Done! That's one step closer to your goals 💫",
    ],
    taskCompleted: [
        "Wonderful! Marked as done! 🎉 You're amazing!",
        "Yay! Another one checked off! ✨ Keep it up!",
        "Done and dusted! 🌟 You're on a roll!",
        "Completed! 🎊 Look at you being so productive!",
    ],
    taskDeleted: [
        "Removed it for you! 🍃 Fresh start!",
        "Gone! 🌸 Your list is looking cleaner now.",
        "Deleted! ✨ Sometimes less is more.",
    ],
    clearedCompleted: [
        "All completed tasks are cleared! 🌿 Nice and tidy!",
        "Cleaned up! 🧹 Your list is fresh and ready!",
    ],
    notFound: [
        "Hmm, I couldn't find that task 🤔 Could you try again?",
        "I looked everywhere but couldn't find it 🔍 Maybe try different words?",
    ],
    listTasks: [
        "Here's what you've got going on 📋",
        "Let me show you your tasks 🌟",
    ],
    noTasks: [
        "Your list is empty! 🎉 Time to relax or add something new?",
        "All clear! ✨ No tasks at the moment. Enjoy the peace!",
    ],
    encouragement: [
        "You've got this! 💪 One step at a time.",
        "Remember, every small step counts! 🌱",
        "Take your time, there's no rush 🌸",
    ],
    unclear: [
        "I'm not quite sure what you mean 🤔 Could you rephrase that?",
        "Hmm, I didn't catch that 💭 Try saying it differently?",
    ],
    help: `Here's what I can do for you 🌿:
• "Add a task to [description]" - Creates a new task
• "Mark [task] as done" - Completes a task  
• "Delete [task]" - Removes a task
• "What do I need to do?" - Shows your tasks
• "Delete all completed" - Clears done tasks
• "Help" - Shows this message`,
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Parse time from natural language (e.g., "at 7 pm", "at 14:00")
function parseTime(text) {
    const timeMatch = text.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const min = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3]?.toLowerCase();
        if (period === 'pm' && hour < 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    }
    return null;
}

// Parse priority from text
function parsePriority(text) {
    if (/\b(urgent|important|high priority|asap)\b/i.test(text)) return 'high';
    if (/\b(low priority|whenever|optional)\b/i.test(text)) return 'low';
    return 'normal';
}

// Clean task text from time/priority phrases
function cleanTaskText(text) {
    return text
        .replace(/at\s+\d{1,2}(?::\d{2})?\s*(am|pm)?/gi, '')
        .replace(/\b(urgent|important|high priority|asap|low priority|whenever|optional)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export default function CozyAssistant({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { type: 'assistant', text: pick(RESPONSES.greetings) }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const addTask = useStore((s) => s.addTask);
    const deleteTask = useStore((s) => s.deleteTask);
    const toggleComplete = useStore((s) => s.toggleComplete);
    const getTaskByTitle = useStore((s) => s.getTaskByTitle);
    const clearCompleted = useStore((s) => s.clearCompleted);
    const getAllTasks = useStore((s) => s.getAllTasks);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (type, text) => {
        setMessages(prev => [...prev, { type, text }]);
    };

    const processCommand = (text) => {
        const lower = text.toLowerCase().trim();

        // Help command
        if (/^(help|what can you do|commands)/i.test(lower)) {
            return { response: RESPONSES.help };
        }

        // Add task
        if (/^(add|create|new|make)\s+(a\s+)?(task|todo|item)?/i.test(lower)) {
            let taskText = text.replace(/^(add|create|new|make)\s+(a\s+)?(task|todo|item)?\s*(to|called|named|:)?\s*/i, '');
            const time = parseTime(taskText);
            const priority = parsePriority(taskText);
            taskText = cleanTaskText(taskText);

            if (!taskText) {
                return { response: "What would you like the task to say? 🤔" };
            }

            addTask(taskText, { time, priority });
            const timeNote = time ? ` (scheduled for ${time})` : '';
            return { response: `${pick(RESPONSES.taskAdded)}${timeNote}` };
        }

        // Complete/Mark as done
        if (/^(mark|complete|finish|done|check)/i.test(lower)) {
            const taskName = text.replace(/^(mark|complete|finish|done|check)\s+(the\s+)?(task\s+)?/i, '')
                .replace(/\s*(as\s+)?(done|complete|finished)$/i, '')
                .trim();
            const task = getTaskByTitle(taskName);
            if (task) {
                if (task.status !== 'done') {
                    toggleComplete(task.id);
                }
                return { response: pick(RESPONSES.taskCompleted) };
            }
            return { response: pick(RESPONSES.notFound) };
        }

        // Delete task
        if (/^(delete|remove|trash)/i.test(lower)) {
            // Check for "delete all completed"
            if (/all\s*(completed|done|finished)/i.test(lower)) {
                clearCompleted();
                return { response: pick(RESPONSES.clearedCompleted) };
            }

            const taskName = text.replace(/^(delete|remove|trash)\s+(the\s+)?(task\s+)?/i, '').trim();
            const task = getTaskByTitle(taskName);
            if (task) {
                deleteTask(task.id);
                return { response: pick(RESPONSES.taskDeleted) };
            }
            return { response: pick(RESPONSES.notFound) };
        }

        // List tasks
        if (/^(what|show|list|get|see)\s*(do i\s*)?(have|need|tasks|todos|my tasks|to do)/i.test(lower) ||
            /^(what's on my list|my tasks)/i.test(lower)) {
            const tasks = getAllTasks();
            if (tasks.length === 0) {
                return { response: pick(RESPONSES.noTasks) };
            }
            const todoTasks = tasks.filter(t => t.status === 'todo');
            const doingTasks = tasks.filter(t => t.status === 'doing');
            const doneTasks = tasks.filter(t => t.status === 'done');

            let response = pick(RESPONSES.listTasks) + '\n\n';
            if (todoTasks.length > 0) {
                response += `📋 To Do (${todoTasks.length}):\n${todoTasks.map(t => `  • ${t.text}`).join('\n')}\n\n`;
            }
            if (doingTasks.length > 0) {
                response += `🔨 In Progress (${doingTasks.length}):\n${doingTasks.map(t => `  • ${t.text}`).join('\n')}\n\n`;
            }
            if (doneTasks.length > 0) {
                response += `✅ Done (${doneTasks.length}):\n${doneTasks.map(t => `  • ${t.text}`).join('\n')}`;
            }
            return { response: response.trim() };
        }

        // Clear completed
        if (/^(clear|clean|remove)\s*(all\s*)?(completed|done|finished)/i.test(lower)) {
            clearCompleted();
            return { response: pick(RESPONSES.clearedCompleted) };
        }

        // Greetings
        if (/^(hi|hello|hey|good morning|good evening|howdy)/i.test(lower)) {
            return { response: pick(RESPONSES.greetings) };
        }

        // Encouragement triggers
        if (/^(i'm stressed|overwhelmed|too much|can't do this|help me)/i.test(lower)) {
            return { response: pick(RESPONSES.encouragement) };
        }

        // Unknown command
        return { response: pick(RESPONSES.unclear) + '\n\nType "help" to see what I can do! 💡' };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        audio.init();
        addMessage('user', input);

        const result = processCommand(input);
        setTimeout(() => {
            addMessage('assistant', result.response);
            audio.playSfxPop();
        }, 300);

        setInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="cozy-assistant-overlay" onClick={onClose}>
            <div className="cozy-assistant" onClick={e => e.stopPropagation()}>
                <div className="cozy-assistant-header">
                    <div className="cozy-assistant-title">
                        <span className="cozy-assistant-avatar">🌿</span>
                        <span>Cozy Assistant</span>
                    </div>
                    <button className="cozy-assistant-close" onClick={onClose}>✕</button>
                </div>

                <div className="cozy-assistant-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`cozy-message ${msg.type}`}>
                            {msg.type === 'assistant' && <span className="cozy-message-avatar">🌱</span>}
                            <div className="cozy-message-text">{msg.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form className="cozy-assistant-input" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ask me anything... 💭"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="btn btn-primary">Send 💫</button>
                </form>
            </div>
        </div>
    );
}
