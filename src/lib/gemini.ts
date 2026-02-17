import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import * as vscode from 'vscode';

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        const config = vscode.workspace.getConfiguration('autodoc');
        const apiKey = config.get<string>('gemini.apiKey');
        const modelName = config.get<string>('gemini.model') || 'gemini-2.0-flash-exp';

        if (!apiKey) {
            throw new Error('API Key is not set in settings (autodoc.gemini.apiKey).');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    public async generateContent(prompt: string): Promise<string> {
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}
