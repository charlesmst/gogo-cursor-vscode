import * as vscode from 'vscode';
import { PointInFile } from './point-in-file';

export class GoGoCursor {
    currentSavepoint = 1;
    savePoints: PointInFile[] = []

    private _statusBarItem: vscode.StatusBarItem;
    constructor() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }
        // Get the current text editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        this.updateCurrent();
        this._statusBarItem.show();

    }
    updateCurrent() {
        this._statusBarItem.text = "GoGo Savepoint:" + this.currentSavepoint;
    }
    createOrUpdate(textEditor: vscode.TextEditor, clickNumber: number) {

        if (this.currentSavepoint != clickNumber) {
            let oldPosition = this.currentSavepoint;
            this.currentSavepoint = clickNumber;
            this.savePoint(textEditor, oldPosition);
            if (typeof this.savePoints[clickNumber] !== "undefined" && this.savePoints[clickNumber] !== null) {
                this.goToPoint(this.currentSavepoint)
            }
        }
        this.updateCurrent();

    }
    goToPoint(savePointNumber: number) {
        let p:PromiseLike<any> = Promise.resolve();
        if (vscode.window.activeTextEditor !== this.savePoints[savePointNumber].textEditor)
            p = vscode.window.showTextDocument(this.savePoints[savePointNumber].textEditor.document)
        p.then(x => {

            this.savePoints[savePointNumber].textEditor.selection = new vscode.Selection(this.savePoints[savePointNumber].anchorPoint, this.savePoints[savePointNumber].anchorPoint);
            //Go to the end of line
            vscode.commands.executeCommand('cursorMove', {
                'to': 'wrappedLineEnd',
            })
            vscode.window.activeTextEditor.revealRange(new vscode.Range(this.savePoints[savePointNumber].anchorPoint, this.savePoints[savePointNumber].anchorPoint), vscode.TextEditorRevealType.InCenterIfOutsideViewport)
            this.currentSavepoint = savePointNumber

        });
    }
    savePoint(textEditor: vscode.TextEditor, anchorPosition: number) {
        this.savePoints[anchorPosition] = new PointInFile();
        this.savePoints[anchorPosition].anchorPoint = textEditor.selection.active;
        this.savePoints[anchorPosition].textEditor = textEditor;
    }
    clearAll() {
        this.savePoints = [];
        this.currentSavepoint = 1;
        this.updateCurrent();
    }
    showCurrent() {
        vscode.window.showInformationMessage("GoGo: Your current cursor savepoint is " + this.currentSavepoint)
    }
    saveAndNext(currentTextEditor: vscode.TextEditor) {
        let next = this.currentSavepoint + 1;
        if (next > 9)
            next = 1;
        this.savePoint(currentTextEditor, this.currentSavepoint);
        this.currentSavepoint = next;

        this.updateCurrent();
    }
    applyTextChanges(changes: vscode.TextDocumentChangeEvent) {
        const textEditor = vscode.window.activeTextEditor;
        const textDocument = changes.document;
        changes.contentChanges.forEach(change => {
            console.log(change)
            //Check if changes happened in a savepoint editor
            let savePointsChanged = this.savePoints
                .filter((point, i) => point && point.textEditor.document === textDocument)
                .filter(point => change.range.start.line < point.anchorPoint.line)
            let lines = change.text.split("\n");
            let lineDiference = Math.max(lines.length - 1, 0);

            savePointsChanged.forEach(point => {
                point.anchorPoint = point.anchorPoint.with(point.anchorPoint.line + lineDiference + (change.range.start.line - change.range.end.line))
            })
        })


    }
}