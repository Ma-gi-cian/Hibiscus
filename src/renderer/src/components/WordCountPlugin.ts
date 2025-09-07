import { ViewPlugin, ViewUpdate, EditorView,type PluginValue } from "@codemirror/view";

class WordCountPlugin implements PluginValue {
    private wordCount: number = 0;
    private statusElement: HTMLElement;

    constructor(view: EditorView) {
        this.statusElement = document.createElement('div');
        this.statusElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 10px;
        background: black;
        color: white;
        padding: 5px 5px;
        border-radius: 4px;
        font-size: 12px;
        `;

        document.body.appendChild(this.statusElement);
        this.updateWordCount(view);
    }

    update(update: ViewUpdate) {
        if(update.docChanged) {
            this.updateWordCount(update.view);
        }
    }

    private updateWordCount(view: EditorView) {
        const text = view.state.doc.toString();
        this.wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        this.statusElement.textContent = `Words: ${this.wordCount}`

        console.log(`${this.wordCount}`)
    }
}

const wordCountPlugin = ViewPlugin.fromClass(WordCountPlugin);
export default wordCountPlugin;