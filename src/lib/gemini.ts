import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        // 1. Try to load from .env in workspace root
        let apiKey = process.env.GEMINI_API_KEY;

        if (vscode.workspace.workspaceFolders) {
            const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const envPath = path.join(workspaceRoot, '.env');
            if (fs.existsSync(envPath)) {
                const envConfig = dotenv.parse(fs.readFileSync(envPath));
                if (envConfig.GEMINI_API_KEY) {
                    apiKey = envConfig.GEMINI_API_KEY;
                }
            }
        }

        // 2. Fallback to VS Code Settings
        const config = vscode.workspace.getConfiguration('autodoc');
        if (!apiKey) {
            apiKey = config.get<string>('gemini.apiKey');
        }

        const modelName = config.get<string>('gemini.model') || 'gemini-3-flash-preview';

        if (!apiKey) {
            throw new Error('API Key is not set. Please set GEMINI_API_KEY in .env or autodoc.gemini.apiKey in settings.');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    public async generateContent(prompt: string): Promise<string> {
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}
