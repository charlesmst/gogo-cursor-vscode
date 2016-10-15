'use strict';

import * as vscode from 'vscode';
import {GoGoCursor} from './go-go-cursor';
export function activate(context: vscode.ExtensionContext) {
    let goGoCursor = new GoGoCursor();
    for (let i = 1; i <= 9; i++) {
        let goToPosition = vscode.commands.registerTextEditorCommand('extension.gogo-cursor.goToPosition' + i, (textEditor, textEditorEdit) => {
            goGoCursor.createOrUpdate(textEditor, i)
        });
        context.subscriptions.push(goToPosition);
    }
    context.subscriptions.push(vscode.commands.registerCommand('extension.gogo-cursor.saveAndNext', () => goGoCursor.saveAndNext(vscode.window.activeTextEditor)));

    context.subscriptions.push(vscode.commands.registerCommand('extension.gogo-cursor.clearAll', () => goGoCursor.clearAll()));
    context.subscriptions.push(vscode.commands.registerCommand('extension.gogo-cursor.showCurrent',() => goGoCursor.showCurrent()));
    vscode.workspace.onDidChangeTextDocument((textChanges) => {
        goGoCursor.applyTextChanges(textChanges);
    })

}

export function deactivate() {

}