import { ReactNode } from "react";

export const parseToHTML = (text: string | undefined): ReactNode => {
    if (!text) return null;

    interface Node {
        type: 'text' | 'bold' | 'italic' | 'br';
        content?: string;
        children?: Node[];
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
            const boldNode: Node = { type: 'bold', children: [] };
            stack[stack.length - 1].children!.push(boldNode);
            stack.push(boldNode);
            i += 6;
        } else if (text.startsWith('/italic/', i)) {
            flushText();
            const italicNode: Node = { type: 'italic', children: [] };
            stack[stack.length - 1].children!.push(italicNode);
            stack.push(italicNode);
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
        } else {
            buffer += text[i];
            i++;
        }
    }

    flushText();

    if (stack.length > 1) {
        console.warn('Не все теги закрыты');
    }

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
            default:
                return null;
            }
    };

    return <>{root.children?.map(renderNode)}</>;
};
