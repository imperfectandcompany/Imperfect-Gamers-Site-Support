// src/contentRenderer.ts
import { JSX } from 'preact/jsx-runtime';
import { ContentElement, HeaderElement, ParagraphElement, ImageElement, ListElement, CodeBlockElement, CustomComponentElement, InteractiveElement, ErrorElement } from './contentTypes';

export function renderContent(elements: ContentElement[]): (JSX.Element | null)[] {
    return elements.map((element, index) => {
        switch (element.type) {
            case 'header':
                return renderHeader(element as HeaderElement, index);
            case 'paragraph':
                return <p key={index} dangerouslySetInnerHTML={{ __html: element.content }} />;
            case 'image':
                return <img key={index} src={(element as ImageElement).url} alt={(element as ImageElement).alt} />;
            case 'list':
                return renderList(element as ListElement, index);
            case 'codeBlock':
                return renderCodeBlock(element as CodeBlockElement, index);
            case 'custom':
                return renderCustomComponent(element as CustomComponentElement, index);
            case 'interactive':
                return renderInteractiveElement(element as InteractiveElement, index);
            case 'error':
                return renderErrorElement(element as ErrorElement, index);
            default:
                return null;
        }
    });
}

function renderHeader(element: HeaderElement, index: number): JSX.Element {
    const Tag = `h${element.level}` as keyof JSX.IntrinsicElements;
    return <Tag key={index} dangerouslySetInnerHTML={{ __html: element.content }} />;
}

function renderList(element: ListElement, index: number): JSX.Element {
    return element.ordered ? (
        <ol key={index}>
            {element.items.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
        </ol>
    ) : (
        <ul key={index}>
            {element.items.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
        </ul>
    );
}

function renderCodeBlock(element: CodeBlockElement, index: number): JSX.Element {
    return (
        <pre key={index}>
            <code className={`language-${element.language}`} dangerouslySetInnerHTML={{ __html: element.content }} />
        </pre>
    );
}

function renderCustomComponent(element: CustomComponentElement, index: number): JSX.Element {
    // You can define how to render your custom components here
    return (
        <div key={index} className={`custom-component custom-${element.directive}`}>
            {element.content.map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
        </div>
    );
}

function renderInteractiveElement(element: InteractiveElement, index: number): JSX.Element {
    // You can define how to render your interactive components here
    return (
        <div key={index} className={`interactive-element`}>
            {element.content.map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
        </div>
    );
}

function renderErrorElement(element: ErrorElement, index: number): JSX.Element {
    return (
        <div key={index} className="error-element">
            <strong>Error:</strong> {element.message}
            <pre>{element.content}</pre>
        </div>
    );
}
