import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('partialWord.insertNextWord', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const suggestController = (vscode as any).window?.activeInlineCompletion
    const suggestion = suggestController?.insertText
    if (!suggestion) return

    // Extract next word from suggestion
    const match = suggestion.match(/^(\S+)(\s|$)/)
    const nextWord = match?.[1]
    if (!nextWord) return

    const position = editor.selection.active

    await editor.edit(editBuilder => {
      editBuilder.insert(position, nextWord)
    })

    const newPosition = position.translate(0, nextWord.length)
    editor.selection = new vscode.Selection(newPosition, newPosition)
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
