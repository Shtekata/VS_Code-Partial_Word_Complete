import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('partialWord.insertNextWord', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const pos = editor.selection.active
    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      editor.document.uri,
      pos
    )
    if (!completions || completions.items.length === 0) {
      await vscode.commands.executeCommand('cursorRight')
      return
    }

    const label = completions.items[0].label.toString()
    const next = label.split(/\s+/)[0]
    if (!next) {
      await vscode.commands.executeCommand('cursorRight')
      return
    }

    await editor.edit(edit => {
      edit.insert(pos, next)
    })

    await vscode.commands.executeCommand('hideSuggestWidget')
  })

  context.subscriptions.push(disposable)
}
export function deactivate() {}
