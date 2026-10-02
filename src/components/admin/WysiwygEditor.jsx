import React from 'react';

const WysiwygEditor = ({ value, onChange, placeholder, id, label = 'Contenu' }) => {
  return (
    <textarea
      id={id}
      aria-label={id ? undefined : label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Entrez votre contenu ici...'}
      className="input-field min-h-[200px]"
      style={{
        fontSize: 14,
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        resize: 'vertical'
      }}
    />
  );
};

export default WysiwygEditor;
