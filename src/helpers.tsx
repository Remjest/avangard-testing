import { ReactNode } from "react";

export const parseToHTML = (text: string | undefined): ReactNode => {
    if (!text) return null;

    interface Node {
        type: 'text' | 'bold' | 'italic' | 'br' | 'link';
        content?: string;
        children?: Node[];
        source?: string;
    }

    const root: Node = { type: 'text', children: [] };
    const stack: Node[] = [root];
    let buffer = '';

    const flushText = () => {
        if (buffer.trim() !== '' || buffer.includes(' ')) {
            stack[stack.length - 1].children!.push({
                type: 'text',
                content: buffer,
            });
            buffer = '';
        }
    };

    for (let i = 0; i < text.length;) {
        if (text.startsWith('/bold/', i)) {
            flushText();
            const node: Node = { type: 'bold', children: [] };
            stack[stack.length - 1].children!.push(node);
            stack.push(node);
            i += 6;
        } else if (text.startsWith('/italic/', i)) {
            flushText();
            const node: Node = { type: 'italic', children: [] };
            stack[stack.length - 1].children!.push(node);
            stack.push(node);
            i += 8;
        } else if (text.startsWith('//bold//', i)) {
            flushText();
            if (stack[stack.length - 1].type === 'bold') stack.pop();
            else console.warn('Несоответствие тегов bold');
            i += 8;
        } else if (text.startsWith('//italic//', i)) {
            flushText();
            if (stack[stack.length - 1].type === 'italic') stack.pop();
            else console.warn('Несоответствие тегов italic');
            i += 10;
        } else if (text.startsWith('/n/', i)) {
            flushText();
            stack[stack.length - 1].children!.push({ type: 'br' });
            i += 3;

        // ✅ Новый тег /link source='...'/...//link//
        } else if (text.startsWith('/link', i)) {
            flushText();

            // ищем source='...'
            const linkMatch = text.slice(i).match(/^\/link\s+source=['"]([^'"]+)['"]\s*\//);
            if (linkMatch) {
                const source = linkMatch[1];
                const linkNode: Node = { type: 'link', source, children: [] };
                stack[stack.length - 1].children!.push(linkNode);
                stack.push(linkNode);
                i += linkMatch[0].length;
            } else {
                console.warn('Неверный формат тега link');
                i += 5;
            }
        } else if (text.startsWith('//link//', i)) {
            flushText();
            if (stack[stack.length - 1].type === 'link') stack.pop();
            else console.warn('Несоответствие тегов link');
            i += 8;

        } else {
            buffer += text[i];
            i++;
        }
    }

    flushText();

    // if (stack.length > 1) {
    //     console.warn('Не все теги закрыты');
    // }

    const renderNode = (node: Node, key = 0): ReactNode => {
        switch (node.type) {
            case 'text':
                return node.content;
            case 'bold':
                return (
                    <span key={key} className="bold">
                        {node.children?.map(renderNode)}
                    </span>
                );
            case 'italic':
                return (
                    <span key={key} className="italic">
                        {node.children?.map(renderNode)}
                    </span>
                );
            case 'br':
                return <br key={key} />;
            case 'link':
                return (
                    <a
                        key={key}
                        href={node.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                    >
                        {node.children?.map(renderNode)}
                    </a>
                );
            default:
                return null;
        }
    };

    return <>{root.children?.map(renderNode)}</>;
};
