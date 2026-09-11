import { useRef, useState } from 'react';
import { formatFileSize } from '../utils/format.js';

const ACCEPT = '.pdf,.doc,.docx,.png,.jpg,.jpeg';
const MAX_MB = 25;

export function FileUploader({ file, onSelect, onRemove, pages }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState('');

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (!picked) return;
    if (picked.size > MAX_MB * 1024 * 1024) {
      setSizeError(`THAT FILE DIDN'T WORK — max size is ${MAX_MB} MB.`);
      return;
    }
    setSizeError('');
    onSelect(picked);
  }

  if (file) {
    const ext = (file.name.split('.').pop() || '').toUpperCase().slice(0, 4);
    return (
      <div className="file-chip">
        <div className="file-icon">{ext || 'FILE'}</div>
        <div className="file-info">
          <div className="file-name">{file.name}</div>
          <div className="file-meta">
            {formatFileSize(file.size)}
            {pages ? ` · ${pages} page${pages > 1 ? 's' : ''}` : ''}
          </div>
        </div>
        <button type="button" className="btn btn-sm btn-danger" onClick={onRemove}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
      >
        <div className="dz-icon" aria-hidden>
          ⬆
        </div>
        <div className="dz-title">DROP YOUR PDF HERE</div>
        <div className="dz-sub">or</div>
        <span className="btn btn-primary btn-sm">BROWSE FILES</span>
        <div className="dz-meta">PDF preferred (auto page-count) · DOC/image also accepted · Max {MAX_MB} MB</div>
      </div>
      {sizeError && <p className="error-text">{sizeError}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
