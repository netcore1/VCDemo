// 'vscode'模块包括VS Code插件API
// 导入下面代码使用的必备的插件类型
import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import * as vscode from 'vscode';

export default class WordCounter {
  private statusBarItem: StatusBarItem;
  public updateWordCount() {
    // 创建所需的状态栏元素
    if (!this.statusBarItem) {
      this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    }
    // 得到当前的文本编辑器
    let editor = window.activeTextEditor;
    if (!editor) {
      this.statusBarItem.hide();
      return;
    }
    let doc = editor.document;
    // 只有当是Markdown文件的时候才更新状态
    // if (doc.languageId === "markdown") {
    let wordCount = this.getCount(doc);
    // 更新状态栏
    this.statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
    this.statusBarItem.show();
    // } else {
    //     this.statusBarItem.hide();
    // }
  }
  public getCount(doc: TextDocument): number {
    let docContent = doc.getText();
    // 去除多余的空格以方便与分割
    docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
    docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    let wordCount = 0;
    if (docContent != '') {
      wordCount = docContent.split(' ').length;
    }
    return wordCount;
  }
  public async getFiles() {
    console.log('getFiles');
    try {
      // findFiles('∕*.js', '∕node_modules∕**', 10)
      let res = await vscode.workspace.findFiles('**/*.js');
      console.log('res 1', res);
      /*
      .then(
        // all good
        (result: vscode.Uri[]) => {
          console.log("res", result);
          let file = result[0];
          vscode.workspace.openTextDocument(file);
          vscode.commands.executeCommand("edit.findAndReplace");
        },
        // rejected
        (reason: any) => {
          // output error
          vscode.window.showErrorMessage(reason);
        }
      );*/

      res = await vscode.workspace.findFiles('**/*.js', '**​/utils/**'); //, 20
      console.log('res 2', res);

      // res = await vscode.workspace.findFiles('**​/*.js')
      // console.log('res 3 **​/*.js', res)
      // res = await vscode.workspace.findFiles('**​/*.*')
      // console.log('res 4 **​/*.*', res)
      //, '**​/node_modules/**,dist,.vsco'
      vscode.workspace.findFiles(`{**/*.ts,**/*.vue,**/*.js}`).then((files: vscode.Uri[]) => {
        // const filePathes = files.map(uri => uri.fsPath)
        // console.log(`[${EXTENSION_NAME}] target : ${filePathes.length} files`)
        console.log('files:', files.length);
        // for (let i = 0; i < files.length; i++) {
        //   console.log('path:', files[i].fsPath)
        // }
      });
    } catch (err) {
      console.log('err', err);
    }
  }
  dispose() {
    this.statusBarItem.dispose();
  }
}
