// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './ui/SidebarProvider';
import { AutoDocAgent } from './lib/agent';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "autodoc-agent-gemini" is now active!');

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('autodoc.start', async (topic: string) => {
			if (!topic) {
				vscode.window.showErrorMessage('Please provide a topic/text.');
				return;
			}

			// Validate API Key
			const config = vscode.workspace.getConfiguration('autodoc');
			const apiKey = config.get<string>('gemini.apiKey');
			if (!apiKey) {
				const setKey = 'Set API Key';
				const selection = await vscode.window.showErrorMessage('Gemini API Key is missing.', setKey);
				if (selection === setKey) {
					vscode.commands.executeCommand('workbench.action.openSettings', 'autodoc.gemini.apiKey');
				}
				sidebarProvider.error('API Key missing. Please set it in Settings.');
				return;
			}

			// Run Agent
			const agent = new AutoDocAgent((msg) => {
				console.log(`[Agent] ${msg}`);
				sidebarProvider.log(msg);
			});

			try {
				await agent.run(topic);
				sidebarProvider.finish();
			} catch (e: any) {
				sidebarProvider.error(e.message || String(e));
			}
		})
	);
}

export function deactivate() { }
