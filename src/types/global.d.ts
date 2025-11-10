declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.otf';
declare module '*.ttf';
declare module '*.woff';
declare module '*.woff2';
