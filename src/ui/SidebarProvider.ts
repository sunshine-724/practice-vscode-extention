import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'autodoc-sidebar';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'start':
                    vscode.commands.executeCommand('autodoc.start', data.text);
                    break;
            }
        });
    }

    public log(message: string) {
        if (this._view) {
            this._view.webview.postMessage({ type: 'log', value: message });
        }
    }

    public finish() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'finished' });
        }
    }

    public error(message: string) {
        if (this._view) {
            this._view.webview.postMessage({ type: 'error', value: message });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'Sidebar.js'));

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-react-sidebar' 'unsafe-eval' vscode-resource: https:;">
                <title>Auto-Doc Agent</title>
			</head>
			<body>
				<div id="root"></div>
				<script nonce="react-sidebar" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
