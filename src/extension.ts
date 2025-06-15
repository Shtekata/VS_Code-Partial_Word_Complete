import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('partialWord.insertNextWord', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const position = editor.selection.active
    const line = editor.document.lineAt(position.line).text

    const currentText = line.slice(0, position.character)
    const restText = line.slice(position.character)

    // Match the first word from the remaining text
    const match = restText.match(/^(\S+)(\s|$)/)
    const nextWord = match?.[1]
    if (!nextWord) return

    editor
      .edit(editBuilder => {
        editBuilder.insert(position, nextWord)
      })
      .then(() => {
        const newPos = position.translate(0, nextWord.length)
        editor.selection = new vscode.Selection(newPos, newPos)
      })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
