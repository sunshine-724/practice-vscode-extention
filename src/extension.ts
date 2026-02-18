import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
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
			let apiKey = config.get<string>('gemini.apiKey');

			// Check .env if not in settings
			if (!apiKey && vscode.workspace.workspaceFolders) {
				const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
				const envPath = path.join(workspaceRoot, '.env');
				if (fs.existsSync(envPath)) {
					// We don't need to parse it fully here, just check existence or let the agent handle the error if key is missing/invalid inside.
					// But for better UX, let's peek.
					const envContent = fs.readFileSync(envPath, 'utf8');
					if (envContent.includes('GEMINI_API_KEY=')) {
						apiKey = 'found-in-env';
					}
				}
			}

			if (!apiKey) {
				const setKey = 'Set API Key';
				const selection = await vscode.window.showErrorMessage('Gemini API Key is missing (Settings or .env).', setKey);
				if (selection === setKey) {
					vscode.commands.executeCommand('workbench.action.openSettings', 'autodoc.gemini.apiKey');
				}
				sidebarProvider.error('API Key missing. Please set GEMINI_API_KEY in .env or Settings.');
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
