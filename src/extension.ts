// src/extension.ts
import * as vscode from 'vscode'

let lastGhostText: string | undefined

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('partialCopilot.acceptNextWord', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    // Attempt to access inline suggestion API (not public, so fallback to heuristic)
    const doc = editor.document
    const pos = editor.selection.active

    const nextCharRange = new vscode.Range(pos, pos.translate(0, 80))
    const lineText = doc.getText(nextCharRange)

    const match = lineText.match(/^[^\s]+(\s|$)/) // Match next word until space
    if (!match) return

    const nextWord = match[0]

    await editor.edit(editBuilder => {
      editBuilder.insert(pos, nextWord)
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
