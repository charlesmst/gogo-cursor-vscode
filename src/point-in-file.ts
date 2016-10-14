import * as vscode from 'vscode';

export class PointInFile {
    textEditor: vscode.TextEditor;
    anchorPoint: vscode.Position;
}