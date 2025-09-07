import { WidgetType } from "@codemirror/view";

export type MarkdownWidgetType = 
  | 'heading' 
  | 'bold' 
  | 'italic' 
  | 'code' 
  | 'link' 
  | 'list' 
  | 'blockquote';

export interface MarkdownWidgetProps {
    content: string;
    type: MarkdownWidgetType;
    level?: number;
}

interface HeadingStyle {
    fontSize: string;
    marginTop: string;
    marginBottom: string;
    borderBottom?: string;
    fontWeight?: string;
}

class MarkdownWidget extends WidgetType {
    private content: string;
    private type: MarkdownWidgetType;
    private level: number;

    constructor(content: string, type: MarkdownWidgetType, level: number = 1) {
        super();
        this.content = content;
        this.type = type;
        this.level = level;
    }

    toDOM(): HTMLElement {
        const span = document.createElement('span');
        span.className = `cm-md-${this.type}`;

        switch (this.type) {
            case 'heading':
                this.renderHeading(span);
                break;
            case 'bold': 
                this.renderBold(span);
                break;
            case 'italic': 
                this.renderItalic(span);
                break;
            case 'code': 
                this.renderCode(span);
                break;
            case 'link':
                this.renderLink(span);
                break;
            case 'list':
                this.renderList(span);
                break;
            case 'blockquote':
                this.renderBlockquote(span);
                break;
            default:
                span.textContent = this.content;
        }
        
        return span;
    }

    private renderHeading(element: HTMLElement): void {
        // Create a more sophisticated heading hierarchy
        const headingStyles: Record<number, HeadingStyle> = {
            1: { fontSize: '2.5em', marginTop: '2em', marginBottom: '1em', borderBottom: '3px solid #e1e8ed' },
            2: { fontSize: '2em', marginTop: '1.5em', marginBottom: '0.8em', borderBottom: '2px solid #e1e8ed' },
            3: { fontSize: '1.6em', marginTop: '1.2em', marginBottom: '0.6em', borderBottom: '1px solid #e1e8ed' },
            4: { fontSize: '1.3em', marginTop: '1em', marginBottom: '0.5em' },
            5: { fontSize: '1.1em', marginTop: '0.8em', marginBottom: '0.4em' },
            6: { fontSize: '1em', marginTop: '0.6em', marginBottom: '0.3em', fontWeight: '600' }
        };

        const style = headingStyles[this.level] || headingStyles[6];
        
        Object.assign(element.style, {
            fontSize: style.fontSize,
            fontWeight: this.level <= 3 ? 'bold' : (style.fontWeight || 'bold'),
            color: '#2c3e50',
            marginTop: style.marginTop,
            marginBottom: style.marginBottom,
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
        });

        if (style.borderBottom) {
            element.style.borderBottom = style.borderBottom;
            element.style.paddingBottom = '0.3em';
        }
        
        element.style.color = 'blue'
        element.textContent = this.content;
    }

    private renderBold(element: HTMLElement): void {
        Object.assign(element.style, {
            fontWeight: '700',
            color: '#2c3e50'
        });
        element.textContent = this.content;
    }

    private renderItalic(element: HTMLElement): void {
        Object.assign(element.style, {
            fontStyle: 'italic',
            color: '#34495e'
        });
        element.textContent = this.content;
    }

    private renderCode(element: HTMLElement): void {
        Object.assign(element.style, {
            backgroundColor: '#f8f9fa',
            color: '#e74c3c',
            padding: '0.2em 0.4em',
            borderRadius: '4px',
            fontFamily: '"Fira Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '0.875em',
            border: '1px solid #e1e8ed',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        });
        element.textContent = this.content;
    }

    private renderLink(element: HTMLElement): void {
        const linkMatch = this.content.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
            const link = document.createElement('a');
            link.href = linkMatch[2];
            link.textContent = linkMatch[1];
            
            Object.assign(link.style, {
                color: '#3498db',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'all 0.2s ease',
                padding: '0.1em 0'
            });

            // Add hover effect
            link.addEventListener('mouseenter', () => {
                link.style.borderBottom = '1px solid #3498db';
                link.style.color = '#2980b9';
            });

            link.addEventListener('mouseleave', () => {
                link.style.borderBottom = '1px solid transparent';
                link.style.color = '#3498db';
            });

            element.appendChild(link);
        }
    }

   private renderList(element: HTMLElement): void {
        // Determine if this is an ordered or unordered list item
        const isOrdered = /^\d+\./.test(this.content);
        const isUnordered = /^[-*+]\s/.test(this.content);
        
        if (isOrdered) {
            // Handle ordered list items inline
            const match = this.content.match(/^(\d+)\.\s*(.*)/);
            if (match) {
                const [, number, text] = match;
                this.renderOrderedListItem(element, number, text);
            }
        } else if (isUnordered) {
            // Handle unordered list items inline
            const text = this.content.replace(/^[-*+]\s*/, '');
            this.renderUnorderedListItem(element, text);
        }
    }

    private renderOrderedListItem(element: HTMLElement, number: string, text: string): void {
        // Style the element itself as inline
        Object.assign(element.style, {
            color: '#2c3e50',
            paddingLeft: '1em'
        });

        // Create styled number
        const numberSpan = document.createElement('span');
        numberSpan.textContent = `${number}.`;
        Object.assign(numberSpan.style, {
            fontWeight: '600',
            color: '#3498db',
            marginRight: '0.5em'
        });

        // Create text span
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        Object.assign(textSpan.style, {
            color: '#2c3e50'
        });

        element.appendChild(numberSpan);
        element.appendChild(textSpan);
    }

    private renderUnorderedListItem(element: HTMLElement, text: string): void {
        // Style the element itself as inline
        Object.assign(element.style, {
            color: '#2c3e50',
            paddingLeft: '1em'
        });

        // Create styled bullet
        const bulletSpan = document.createElement('span');
        bulletSpan.textContent = '● ';
        Object.assign(bulletSpan.style, {
            color: '#3498db',
            fontSize: '0.9em',
            marginRight: '0.3em'
        });

        // Create text span
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        Object.assign(textSpan.style, {
            color: '#2c3e50'
        });

        element.appendChild(bulletSpan);
        element.appendChild(textSpan);
    }


    private renderBlockquote(element: HTMLElement): void {
        Object.assign(element.style, {
            borderLeft: '4px solid #3498db',
            padding: '1em 1.5em',
            margin: '1.5em 0',
            backgroundColor: '#f8f9fa',
            fontStyle: 'italic',
            color: '#555',
            borderRadius: '0 4px 4px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'relative'
        });

        // Add a subtle quote mark
        const quoteIcon = document.createElement('span');
        quoteIcon.textContent = '"';
        Object.assign(quoteIcon.style, {
            position: 'absolute',
            left: '0.5em',
            top: '0.2em',
            fontSize: '2em',
            color: '#3498db',
            opacity: '0.3',
            fontFamily: 'serif'
        });

        element.appendChild(quoteIcon);
        
        const textElement = document.createElement('div');
        textElement.textContent = this.content.replace(/^>\s*/, '');
        Object.assign(textElement.style, {
            marginLeft: '1em'
        });
        
        element.appendChild(textElement);
    }

    // Additional utility method for better typography
    private applyTypography(element: HTMLElement): void {
        Object.assign(element.style, {
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            wordSpacing: '0.05em'
        });
    }
}

export default MarkdownWidget;