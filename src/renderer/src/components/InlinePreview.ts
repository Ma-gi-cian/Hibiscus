import { EditorView, Decoration, type DecorationSet, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { type SyntaxNode } from '@lezer/common';
import MarkdownWidget, { type MarkdownWidgetType} from './MarkdownWidget';

interface NodeTypeMapping {
    [key: string] : {
        type: MarkdownWidgetType;
        level?: number;
    };
}

const NODE_TYPE_MAPPING : NodeTypeMapping = {
    'ATXHeading1' : {type: 'heading', level: 1},
    'ATXHeading2' : { type: 'heading', level: 2},
    'ATXHeading3' : {type: 'heading', level: 3},
    'StrongEmphasis' : {type : 'bold'},
    'Emphasis' : { type : 'italic' },
    'InlineCode' : {type: 'code'},
    'Link' : {type: 'link'},
    'ListItem' : { type : 'list' },
    'Blockquote' : { type : 'blockquote' }
};

class InlinePreview {
    decorations: DecorationSet = Decoration.none;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) : void {
        if(update.docChanged || update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view);
        }
    }

    buildDecorations(view: EditorView) : DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        const doc = view.state.doc;

        syntaxTree(view.state).iterate({
            enter: (node: SyntaxNode) => {
                const nodeText = doc.sliceString(node.from, node.to);
                const mapping = NODE_TYPE_MAPPING[node.name];

                if(mapping) {
                    const widget = Decoration.replace({
                        widget: new MarkdownWidget(nodeText, mapping.type, mapping.level)
                    });

                    builder.add(node.from, node.to, widget);
                }
            }
        });

        return builder.finish();
    }
}

const InlinePreviewPlugin = ViewPlugin.fromClass(InlinePreview, { decorations: (view: InlinePreview) => view.decorations});

export default InlinePreviewPlugin;
