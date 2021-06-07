import * as vscode from "vscode";
import { CCIMSCommands } from "../commands/CCIMSCommands";
import { getCCIMSApi } from "../data/CCIMSApi";
import { getIssueIcon } from "../data/IconProvider";
import { Issue } from "../generated/graphql";
import { getComponentId } from "../settings";

/**
 * View used to display a tree of all Issues
 */
export class IssueListProvider implements vscode.TreeDataProvider<Issue> {

	private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined | null | void> 
		= new vscode.EventEmitter<Issue | undefined | null | void>();

	/**
	 * Creates a new IssueListProvider
	 * @param commands commands used to listen for refresh command
	 */
	public constructor(commands: CCIMSCommands) {
		commands.reloadIssueListCommand.addListener(() => this.refresh());
	}

	public onDidChangeTreeData?: vscode.Event<void | Issue | null | undefined> | undefined = this._onDidChangeTreeData.event;

	/**
	 * Can be called to refresh the list
	 */
	private refresh(): void {
	  	this._onDidChangeTreeData.fire();
	}

	public getTreeItem(element: Issue): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return {
			id: element.id!,
			label: element.title,
			iconPath: getIssueIcon(element)
		}
	}

	public async getChildren(element?: Issue): Promise<undefined | Issue[]> {
		if (element != undefined) {
			//TODO: maybe add artifacts etc. here
			return new Promise(resolve => resolve(undefined));
		} else {
			const api = await getCCIMSApi();
			const componentId = await getComponentId();
			if (componentId != null) {
				return await api.getIssues(componentId);
			} else {
				return undefined;
			}
		}
	}

}