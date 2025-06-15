import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('partialWord.insertNextWord', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const cursor = editor.selection.active
    const line = editor.document.lineAt(cursor.line).text

    const before = line.slice(0, cursor.character)
    const after = line.slice(cursor.character)

    // We guess the inline suggestion based on what's visible as ghost text
    // but Copilot's ghost text is not part of the document, so we can't see it
    // => fallback: grab the whole visible line and compute difference manually
    const visibleSuggestion = after

    if (!visibleSuggestion) return

    // Find the next "word-like" portion of the visible suggestion
    const match = visibleSuggestion.match(/^(\w+)(\W|$)/) // word followed by non-word
    const nextWord = match?.[1]
    if (!nextWord) return

    await editor.edit(editBuilder => {
      editBuilder.insert(cursor, nextWord)
    })

    const newPos = cursor.translate(0, nextWord.length)
    editor.selection = new vscode.Selection(newPos, newPos)
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
