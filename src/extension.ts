import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('partialWord.insertNextWord', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const position = editor.selection.active
    const lineText = editor.document.lineAt(position.line).text

    const suffix = lineText.slice(position.character)

    // Try to insert next word from ghost suggestion
    const match = suffix.match(/^(\w+)/)
    if (!match) {
      vscode.commands.executeCommand('cursorRight')
      return
    }

    const nextWord = match[1]
    await editor.edit(editBuilder => {
      editBuilder.insert(position, nextWord)
    })

    const newPos = position.translate(0, nextWord.length)
    editor.selection = new vscode.Selection(newPos, newPos)
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
