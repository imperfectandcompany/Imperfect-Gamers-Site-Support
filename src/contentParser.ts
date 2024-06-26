import { ContentElement, HeaderElement, ParagraphElement, ImageElement, ListElement, CodeBlockElement } from './contentTypes';

export function parseContent(rawContent: string): ContentElement[] {
    const elements: ContentElement[] = [];
    const lines = rawContent.split('\n');

    let currentList: ListElement | null = null;
    let currentCodeBlock: CodeBlockElement | null = null;

    const handleInlineFormatting = (text: string): string => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/``(.*?)``/g, '<code>$1</code>') // Inline Code
            .replace(/\^\^(.*?)\^\^/g, '<mark>$1</mark>'); // Highlight
    };

    lines.forEach(line => {
        line = handleInlineFormatting(line);

        if (line.startsWith('#')) {
            const level = line.match(/#+/g)![0].length;
            elements.push({ type: 'header', level, content: line.replace(/#+/g, '').trim() } as HeaderElement);
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }
            if (currentCodeBlock) {
                elements.push(currentCodeBlock);
                currentCodeBlock = null;
            }
        } else if (line.startsWith('![')) {
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                elements.push({ type: 'image', alt: match[1], url: match[2] } as ImageElement);
            }
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }
            if (currentCodeBlock) {
                elements.push(currentCodeBlock);
                currentCodeBlock = null;
            }
        } else if (line.startsWith('```')) {
            if (currentCodeBlock) {
                elements.push(currentCodeBlock);
                currentCodeBlock = null;
            } else {
                const language = line.slice(3).trim();
                currentCodeBlock = { type: 'codeBlock', language, content: '' };
            }
        } else if (currentCodeBlock) {
            if (line === '```') {
                elements.push(currentCodeBlock);
                currentCodeBlock = null;
            } else {
                currentCodeBlock.content += line + '\n';
            }
        } else if (line.startsWith('[') && line.endsWith(']')) {
            const items = line.slice(1, -1).split(',').map(item => item.trim());
            elements.push({ type: 'list', ordered: false, items } as ListElement);
        } else if (line.match(/^\d+\. /)) {
            if (!currentList || !currentList.ordered) {
                if (currentList) {
                    elements.push(currentList);
                }
                currentList = { type: 'list', ordered: true, items: [] };
            }
            currentList.items.push(line.replace(/^\d+\.\s*/, ''));
            // Modify how lists are detected and parsed in parseContent function
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
    if (!currentList || currentList.type !== 'list') {
        if (currentList) {
            elements.push(currentList);
        }
        currentList = { type: 'list', ordered: false, items: [] };
    }
    currentList.items.push(line.replace(/^\* |\-\s*/, ''));
        }
        else {
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }
            if (line.trim() !== '') {
                elements.push({ type: 'paragraph', content: line.trim() } as ParagraphElement);
            }
        }
    });

    if (currentList) {
        elements.push(currentList);
    }
    if (currentCodeBlock) {
        elements.push(currentCodeBlock);
    }

    return elements;
}