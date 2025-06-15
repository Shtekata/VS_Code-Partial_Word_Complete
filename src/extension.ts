import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('partialWord.insertNextWord', () => {
    vscode.window.showInformationMessage('Right Arrow key triggered!')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
