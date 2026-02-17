import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

const Sidebar = () => {
    const [topic, setTopic] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'log':
                    setLogs((prev: string[]) => [...prev, message.value]);
                    break;
                case 'finished':
                    setIsGenerating(false);
                    setLogs((prev: string[]) => [...prev, '✅ Process finished.']);
                    break;
                case 'error':
                    setIsGenerating(false);
                    setLogs((prev: string[]) => [...prev, `❌ Error: ${message.value}`]);
                    break;
            }
        };
        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleGenerate = () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setLogs(['🚀 Starting Auto-Doc Generation...']);
        vscode.postMessage({
            command: 'start',
            text: topic
        });
    };

    return (
        <div style={{ padding: '10px', fontFamily: 'var(--vscode-font-family)' }}>
            <h2 style={{ fontSize: '1.2em', marginBottom: '15px' }}>
                🤖 Auto-Doc Agent
                <span style={{ fontSize: '0.6em', display: 'block', color: 'var(--vscode-descriptionForeground)' }}>powered by Gemini</span>
            </h2>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Topic</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Calculate Fibonacci"
                    disabled={isGenerating}
                    style={{
                        width: '100%',
                        padding: '8px',
                        background: 'var(--vscode-input-background)',
                        color: 'var(--vscode-input-foreground)',
                        border: '1px solid var(--vscode-input-border)',
                        boxSizing: 'border-box'
                    }}
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: isGenerating ? 'var(--vscode-button-secondaryBackground)' : 'var(--vscode-button-background)',
                    color: 'var(--vscode-button-foreground)',
                    border: 'none',
                    cursor: isGenerating ? 'wait' : 'pointer',
                    fontWeight: 'bold'
                }}
            >
                {isGenerating ? 'Generating...' : 'Start Generation'}
            </button>

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '1em', borderBottom: '1px solid var(--vscode-panel-border)', paddingBottom: '5px' }}>
                    Process Logs
                </h3>
                <div style={{
                    height: '200px',
                    overflowY: 'auto',
                    background: 'var(--vscode-editor-background)',
                    border: '1px solid var(--vscode-widget-border)',
                    padding: '5px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                    whiteSpace: 'pre-wrap'
                }}>
                    {logs.map((log, i) => (
                        <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Sidebar />);
