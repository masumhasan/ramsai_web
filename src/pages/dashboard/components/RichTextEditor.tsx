import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Minus, 
  Eye, 
  Edit3, 
  Code,
  Sparkles
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or paste rich content here...'
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'html'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap or insert formatting tags at cursor position
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Refocus & set selection range after React update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL (e.g. https://getgocal.com):', 'https://');
    if (!url) return;
    insertFormatting(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 underline hover:text-emerald-300">`, '</a>', 'Link Text');
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Editor Header / Tab Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Rich Legal Content Editor</h4>
            <p className="text-xs text-slate-400">Supports HTML tags, links, headings & list formatting</p>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-white/10 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'edit'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Visual Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'html'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Raw Source
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Active in Edit & Source Mode) */}
      {activeTab !== 'preview' && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 bg-slate-900/60 px-4 py-2 text-slate-300">
          <button
            type="button"
            title="Heading 1 (H1)"
            onClick={() => insertFormatting('<h2>', '</h2>', 'Section Title')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 2 (H2)"
            onClick={() => insertFormatting('<h3>', '</h3>', 'Subheading Title')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3 (H3)"
            onClick={() => insertFormatting('<h4>', '</h4>', 'Sub-subheading')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            title="Bold Text"
            onClick={() => insertFormatting('<strong>', '</strong>', 'bold text')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic Text"
            onClick={() => insertFormatting('<em>', '</em>', 'italic text')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            title="Bullet List"
            onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n  <li>Second item</li>\n</ul>', 'First List Item')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n  <li>Second step</li>\n</ol>', 'Step One')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Blockquote Callout"
            onClick={() => insertFormatting('<blockquote>', '</blockquote>', 'Important notice or callout text...')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            title="Insert Hyperlink"
            onClick={handleInsertLink}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-emerald-400"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Horizontal Divider"
            onClick={() => insertFormatting('\n<hr />\n', '', '')}
            className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="ml-auto text-xs text-slate-500 font-mono">
            {value.length} chars | {value.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      )}

      {/* Editor Body */}
      <div className="p-4 bg-slate-950/40">
        {activeTab === 'preview' ? (
          <div className="min-h-[420px] max-h-[600px] overflow-y-auto rounded-xl border border-white/5 bg-slate-900/60 p-6 text-slate-200">
            <div 
              className="prose prose-invert max-w-none 
                prose-h1:text-2xl prose-h1:font-bold prose-h1:text-white prose-h1:mb-4
                prose-h2:text-xl prose-h2:font-semibold prose-h2:text-emerald-400 prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-lg prose-h3:font-medium prose-h3:text-teal-300 prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-4 prose-ul:text-slate-300
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:mb-4 prose-ol:text-slate-300
                prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-200
                prose-a:text-emerald-400 prose-a:underline hover:prose-a:text-emerald-300
                prose-hr:border-white/10 prose-hr:my-6"
              dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-500 italic">No content to preview.</p>' }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={16}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed"
          />
        )}
      </div>
    </div>
  );
};
