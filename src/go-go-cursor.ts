import * as vscode from 'vscode';
import { PointInFile } from './point-in-file';

export class GoGoCursor {
    currentSavepoint = 1;
    savePoints: PointInFile[] = []

    createOrUpdate(textEditor: vscode.TextEditor, clickNumber: number) {

        if (this.currentSavepoint != clickNumber) {
            let oldPosition = this.currentSavepoint;
            this.currentSavepoint = clickNumber;
            this.savePoint(textEditor, oldPosition);
            if (typeof this.savePoints[clickNumber] !== "undefined" && this.savePoints[clickNumber] !== null) {
                this.goToPoint(this.currentSavepoint)
            }
        }
    }
    goToPoint(savePointNumber: number) {
        vscode.window.showTextDocument(this.savePoints[savePointNumber].textEditor.document);
        this.savePoints[savePointNumber].textEditor.selection = new vscode.Selection(this.savePoints[savePointNumber].anchorPoint, this.savePoints[savePointNumber].anchorPoint);
    }
    savePoint(textEditor: vscode.TextEditor, anchorPosition: number) {
        this.savePoints[anchorPosition] = new PointInFile();
        this.savePoints[anchorPosition].anchorPoint = textEditor.selection.active;
        this.savePoints[anchorPosition].textEditor = textEditor;
    }
    clearAll() {
        this.savePoints = [];
        this.currentSavepoint = 1;
    }
    showCurrent() {
        vscode.window.showInformationMessage("GoGo: Your current cursor savepoint is " + this.currentSavepoint)
    }
    applyTextChanges(changes: vscode.TextDocumentChangeEvent) {
        const textEditor = vscode.window.activeTextEditor;
        const textDocument = changes.document;
        changes.contentChanges.forEach(change=>{
            console.log(change)
            //Check if changes happened in a savepoint editor
            let savePointsChanged = this.savePoints
                    .filter(point => point && point.textEditor.document === textDocument )
                    .filter(point => point.anchorPoint.isAfterOrEqual(change.range.start) )
        
            let lines = change.text.split("\n");
            // savePointsChanged.forEach(point =>{
            //     let lineDiference = lines.length;
            //     let characterDiference = point.anchorPoint.line === change.range.start 
            // })
            // savePointsChanged.map(point =>{
            //     const offsetStart = textDocument.offsetAt(change.range.start);
            //     const offsetEnd = textDocument.offsetAt(contentChange.range.end);

            // })
        })
       
                
    }
}