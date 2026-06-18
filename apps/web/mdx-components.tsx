import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // You can optionally define global Tailwind styles for your markdown elements here
  return {
    ...components,
  };
}