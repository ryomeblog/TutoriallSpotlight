import React, { useEffect, useRef, useState } from 'react';

/**
 * TutorialSpotlight
 *
 * Webアプリ上でスポットライト付きチュートリアルを表示するReactコンポーネント
 *
 * Props:
 * - steps: Array<{ key, label, desc, targetRef, panelSide, panelWidth, panelHeight, panelInitialPos, dummyGraphComponent }>
 * - step: number (現在のステップ)
 * - visible: boolean (表示/非表示)
 * - onNext: function (次へ)
 * - onClose: function (閉じる)
 * - children: ReactNode (アプリ本体)
 */
const TutorialSpotlight = ({ steps, step, onNext, onClose, children, visible }) => {
  const [targetRect, setTargetRect] = useState(null);
  const [cloneNode, setCloneNode] = useState(null);
  const [panelPos, setPanelPos] = useState({
    top: window.innerHeight / 2 - 70,
    left: window.innerWidth / 2 - 160,
  });
  const [panelDims, setPanelDims] = useState({ width: 320, height: 140 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanelMoved, setIsPanelMoved] = useState(false);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  // ステップ切り替え時に該当要素までスクロール
  useEffect(() => {
    if (!visible) return;
    const target = steps[step]?.targetRef?.current;
    if (target) {
      const rect = target.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      const targetTop = rect.top + scrollY - window.innerHeight / 2 + rect.height / 2;
      const targetLeft = rect.left + scrollX - window.innerWidth / 2 + rect.width / 2;
      window.scrollTo({
        top: Math.max(targetTop, 0),
        left: Math.max(targetLeft, 0),
        behavior: 'smooth',
      });
    }
  }, [step, steps, visible]);

  // クローン作成
  useEffect(() => {
    if (!visible) return;
    const target = steps[step]?.targetRef?.current;
    if (target) {
      if (target.hasAttribute('data-spotlight-no-clone')) {
        setTargetRect(target.getBoundingClientRect());
        setCloneNode(null);
      } else {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        const clone = target.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.zIndex = 10001;
        clone.style.pointerEvents = 'none';
        clone.style.boxShadow = '0 0 0 4px #2563eb80, 0 8px 32px #0002';
        clone.style.background = '#fff';
        clone.style.borderRadius = '12px';
        setCloneNode(clone);
        target.style.pointerEvents = 'none';
      }
    } else {
      setTargetRect(null);
    }
    return () => {
      const target = steps[step]?.targetRef?.current;
      if (target) target.style.pointerEvents = '';
      setCloneNode(null);
    };
  }, [step, steps, visible]);

  // パネル位置リセット
  useEffect(() => {
    setDragging(false);
    setIsPanelMoved(false);
  }, [step]);

  // パネル位置・大きさ計算
  useEffect(() => {
    const panelWidth = steps[step]?.panelWidth || 320;
    const panelHeight = steps[step]?.panelHeight || 140;
    const side = steps[step]?.panelSide;
    const panelInitialPos = steps[step]?.panelInitialPos;

    if (!isPanelMoved) {
      let top, left;
      if (
        panelInitialPos &&
        typeof panelInitialPos.top === 'number' &&
        typeof panelInitialPos.left === 'number'
      ) {
        top = panelInitialPos.top;
        left = panelInitialPos.left;
      } else if (targetRect) {
        if (side === 'right') {
          top = targetRect.top;
          left = targetRect.left + targetRect.width + 16;
        } else if (side === 'left') {
          top = targetRect.top;
          left = targetRect.left - panelWidth - 16;
        } else if (side === 'top') {
          top = targetRect.top - panelHeight - 16;
          left = targetRect.left + targetRect.width / 2 - panelWidth / 2;
        } else if (side === 'bottom') {
          top = targetRect.top + targetRect.height + 16;
          left = targetRect.left + targetRect.width / 2 - panelWidth / 2;
        } else {
          // 自動調整
          if (targetRect.left + targetRect.width + panelWidth + 16 < window.innerWidth) {
            top = targetRect.top;
            left = targetRect.left + targetRect.width + 16;
          } else if (targetRect.left - panelWidth - 16 > 0) {
            top = targetRect.top;
            left = targetRect.left - panelWidth - 16;
          } else if (targetRect.top + targetRect.height + panelHeight + 16 < window.innerHeight) {
            top = targetRect.top + targetRect.height + 16;
            left = targetRect.left + targetRect.width / 2 - panelWidth / 2;
          } else {
            top = targetRect.top - panelHeight - 16;
            left = targetRect.left + targetRect.width / 2 - panelWidth / 2;
          }
        }
        if (left + panelWidth > window.innerWidth) left = window.innerWidth - panelWidth - 16;
        if (left < 16) left = 16;
        if (top + panelHeight > window.innerHeight) top = window.innerHeight - panelHeight - 16;
        if (top < 16) top = 16;
      } else {
        top = window.innerHeight / 2 - panelHeight / 2;
        left = window.innerWidth / 2 - panelWidth / 2;
      }
      setPanelPos({ top, left });
      setPanelDims({ width: panelWidth, height: panelHeight });
    }
    if (isPanelMoved) {
      setPanelDims({ width: panelWidth, height: panelHeight });
    }
  }, [targetRect, step, steps, isPanelMoved]);

  // ドラッグ操作
  const handleMouseDown = (e) => {
    setDragging(true);
    setIsPanelMoved(true);
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    e.preventDefault();
  };
  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      let newLeft = e.clientX - dragOffset.x;
      let newTop = e.clientY - dragOffset.y;
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + panelDims.width > window.innerWidth)
        newLeft = window.innerWidth - panelDims.width;
      if (newTop + panelDims.height > window.innerHeight)
        newTop = window.innerHeight - panelDims.height;
      setPanelPos({ left: newLeft, top: newTop });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset, panelDims]);

  // クローンをbody直下に配置
  useEffect(() => {
    if (!visible || !cloneNode) return;
    document.body.appendChild(cloneNode);
    return () => {
      if (cloneNode && cloneNode.parentNode) cloneNode.parentNode.removeChild(cloneNode);
    };
  }, [cloneNode, visible]);

  if (!visible) return children;

  const DummyGraph = steps[step]?.dummyGraphComponent;

  return (
    <>
      {/* 暗い背景 */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
          pointerEvents: 'auto',
        }}
      />
      {/* パネル */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: panelPos.top,
          left: panelPos.left,
          width: panelDims.width,
          height: panelDims.height,
          zIndex: dragging ? 10003 : 10002,
          transition: 'all 0.2s',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 16px #0002',
            padding: 16,
            border: '1px solid #2563eb40',
            position: 'relative',
            height: '100%',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              color: '#2563eb',
              marginBottom: 4,
              cursor: 'move',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
          >
            {steps[step].label}
          </div>
          <div style={{ color: '#444', fontSize: 14, marginBottom: 12 }}>{steps[step].desc}</div>
          {DummyGraph && (
            <div style={{ marginBottom: 8 }}>
              <DummyGraph />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={onNext}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 6,
                border: 'none',
                padding: '8px 0',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              {step === steps.length - 1 ? '完了' : '次へ'}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
            {steps.map((s, idx) => (
              <span
                key={s.key}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: idx === step ? '#2563eb' : '#ccc',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
          <button
            style={{
              position: 'absolute',
              top: 8,
              right: 12,
              color: '#aaa',
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
            }}
            onClick={onClose}
            aria-label="チュートリアルを閉じる"
          >
            ×
          </button>
        </div>
      </div>
      {/* childrenはz-index:0で下に */}
      <div style={{ zIndex: 0, position: 'relative' }}>{children}</div>
    </>
  );
};

export default TutorialSpotlight;
