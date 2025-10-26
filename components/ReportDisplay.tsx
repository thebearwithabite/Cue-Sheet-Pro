
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, task lists, etc.)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ReportDisplayProps {
  markdown: string;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ markdown }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-primary-dark mb-4">Generated Episode Report</h2>
      <div className="prose max-w-none"> {/* Tailwind prose plugin for basic markdown styling */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom renderer for code blocks to apply syntax highlighting
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={coldarkDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({children}) => <h1 className="text-3xl font-bold section-title">{children}</h1>,
            h2: ({children}) => <h2 className="text-2xl font-bold subsection-title">{children}</h2>,
            h3: ({children}) => <h3 className="text-xl font-semibold subsection-title">{children}</h3>,
            ul: ({children}) => <ul className="list-disc ml-6">{children}</ul>,
            li: ({children}) => <li className="mb-1">{children}</li>,
            strong: ({children}) => <strong className="text-primary-dark">{children}</strong>,
            p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ReportDisplay;
