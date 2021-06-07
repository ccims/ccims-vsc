import * as vscode from "vscode";
import { CCIMSCommands } from "./commands/CCIMSCommands";
import { IssueListProvider } from "./issue-list/IssueListProvider";
import { IssueViewProvider } from "./issue-view/IssueViewProvider";

/**
 * cached extension uri
 */
let _extensionUri: vscode.Uri

/**
 * Called when the extension is activated
 * @param context the context when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
	console.log("activate");
	_extensionUri = context.extensionUri;

	const commands = new CCIMSCommands(context);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			IssueViewProvider.viewType,
			new IssueViewProvider(context.extensionUri, commands)
		)
	);
	
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			"ccims.issueList",
			new IssueListProvider(commands)
		)
	);
}

/**
 * Gets a resource URI for a resource file
 * @param resourcePath the path, starting in the res director
 * @returns the URI which represents the resource
 */
export function getResourceUri(resourcePath: string): vscode.Uri {
	return vscode.Uri.joinPath(_extensionUri, "res", resourcePath);
}
