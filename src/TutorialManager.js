import React, { useState } from 'react';

/**
 * TutorialManager
 *
 * チュートリアル進捗管理用の汎用Reactコンポーネント
 *
 * Props:
 * - statusKeys: string[] (管理するチュートリアルキー一覧)
 * - labels: { [key: string]: string } (表示ラベル)
 * - initialStatus: { [key: string]: boolean } (初期状態)
 * - onStatusChange: function(key, value) (状態変更時コールバック)
 */

const TutorialManager = ({ statusKeys = [], labels = {}, initialStatus = {}, onStatusChange }) => {
  const [tutorialStatus, setTutorialStatus] = useState(() => {
    const status = {};
    statusKeys.forEach((key) => {
      status[key] = initialStatus[key] || false;
    });
    return status;
  });

  const handleToggle = (key) => {
    const newStatus = { ...tutorialStatus, [key]: !tutorialStatus[key] };
    setTutorialStatus(newStatus);
    if (onStatusChange) onStatusChange(key, newStatus[key], newStatus);
  };

  const handleReset = () => {
    const resetStatus = {};
    statusKeys.forEach((key) => {
      resetStatus[key] = false;
    });
    setTutorialStatus(resetStatus);
    if (onStatusChange) onStatusChange(null, null, resetStatus);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px #0002',
        padding: 16,
        border: '1px solid #2563eb40',
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      <h2 style={{ fontWeight: 'bold', color: '#2563eb', marginBottom: 12 }}>チュートリアル管理</h2>
      <div style={{ marginBottom: 16 }}>
        {statusKeys.map((key) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span>{labels[key] || key}</span>
            <button
              type="button"
              style={{
                width: 48,
                height: 24,
                borderRadius: 12,
                background: tutorialStatus[key] ? '#2563eb' : '#ccc',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => handleToggle(key)}
              aria-pressed={tutorialStatus[key]}
            >
              <span
                style={{
                  position: 'absolute',
                  left: tutorialStatus[key] ? 28 : 4,
                  top: 4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 4px #0001',
                  transition: 'left 0.2s',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 2,
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: tutorialStatus[key] ? '#2563eb' : '#888',
                }}
              >
                {tutorialStatus[key] ? '完了' : '未完了'}
              </span>
            </button>
          </div>
        ))}
      </div>
      <button
        style={{
          marginTop: 8,
          padding: '8px 16px',
          background: '#fbe9e7',
          color: '#d32f2f',
          borderRadius: 6,
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        onClick={handleReset}
      >
        すべてリセット
      </button>
    </div>
  );
};

export default TutorialManager;
