'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    for(let i = 1; i <= 9;i++){      
        let goToPosition = vscode.commands.registerTextEditorCommand('extension.gogo-cursor.goToPosition'+i, (textEditor, textEditorEdit) => {                    
            createOrUpdate(textEditor,i)            
        });
        context.subscriptions.push(goToPosition);
    }   
   
    context.subscriptions.push(vscode.commands.registerCommand('extension.gogo-cursor.clearAll', clearAll));
    context.subscriptions.push(vscode.commands.registerCommand('extension.gogo-cursor.showCurrent', showCurrent));

    vscode.window.onDidChangeActiveTextEditor((textEditor)=>{
       
    });

}

export function deactivate() {

}

let currentSavepoint = 1;
let savePoints:PointInFile[] = []

function createOrUpdate(textEditor:vscode.TextEditor, clickNumber:number){
    
    if(currentSavepoint != clickNumber){
        let oldPosition =currentSavepoint;
        currentSavepoint = clickNumber;
        savePoint(textEditor,oldPosition);
        if(typeof savePoints[clickNumber] !== "undefined" && savePoints[clickNumber] !== null){
            goToPoint(currentSavepoint)
        }
    }
}
function goToPoint(savePointNumber:number){
    vscode.window.showTextDocument(savePoints[savePointNumber].textEditor.document);
    savePoints[savePointNumber].textEditor.selection = new vscode.Selection(savePoints[savePointNumber].anchorPoint,savePoints[savePointNumber].anchorPoint);
}
function savePoint(textEditor:vscode.TextEditor, anchorPosition:number){    
    savePoints[anchorPosition] =  new PointInFile();
    savePoints[anchorPosition].anchorPoint = textEditor.selection.active;
    savePoints[anchorPosition].textEditor = textEditor;    
}
function clearAll(){
    savePoints = [];
    currentSavepoint = 1;
}
function showCurrent(){
    vscode.window.showInformationMessage("GoGo: Your current cursor savepoint is "+currentSavepoint)
}
class PointInFile{
    textEditor:vscode.TextEditor;
    anchorPoint:vscode.Position;
}