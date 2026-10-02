import React from 'react';

const WysiwygEditor = ({ value, onChange, placeholder, id, label = 'Contenu' }) => {
  return (
    <textarea
      id={id}
      aria-label={id ? undefined : label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Entrez votre contenu ici...'}
      className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      style={{
        fontSize: 14,
        backgroundColor: '#f8f9fa',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        resize: 'vertical'
      }}
    />
  );
};

export default WysiwygEditor;
