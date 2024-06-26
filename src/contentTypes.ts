// src/contentTypes.ts

export interface HeaderElement {
  type: 'header';
  level: number;
  content: string;
}

export interface ParagraphElement {
  type: 'paragraph';
  content: string;
}

export interface ImageElement {
  type: 'image';
  url: string;
  alt: string;
}

export interface ListElement {
  type: 'list';
  ordered: boolean;
  items: string[];
  indent?: number; // for nested lists
}

export interface CodeBlockElement {
  type: 'codeBlock';
  language: string;
  content: string;
}

export interface CustomComponentElement {
  type: 'custom';
  directive: string;
  args: string;
  content: string[];
}

export interface InteractiveElement {
  type: 'interactive';
  args: string;
  content: string[];
}

export interface ErrorElement {
  type: 'error';
  message: string;
  content: string;
}

export type ContentElement =
  | HeaderElement
  | ParagraphElement
  | ImageElement
  | ListElement
  | CodeBlockElement
  | CustomComponentElement
  | InteractiveElement
  | ErrorElement;
