import { memo, useEffect, useState } from 'react';
import { theme } from 'antd';

const confettiColors = ['#FF4444', '#FFD700', '#2E8B3A', '#4169E1', '#FF69B4', '#00CED1'];

function createConfettiPieces(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    size: 6 + Math.random() * 6,
    rotation: Math.random() * 360,
    isCircle: Math.random() > 0.5,
  }));
}

const ConfettiPiece = memo(function ConfettiPiece({ piece }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${piece.left}%`,
        top: '-20px',
        width: piece.size,
        height: piece.isCircle ? piece.size : piece.size * 0.6,
        background: piece.color,
        borderRadius: piece.isCircle ? '50%' : '2px',
        transform: `rotate(${piece.rotation}deg)`,
        animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
      }}
    />
  );
});

export default function Confetti({ show }) {
  const { token } = theme.useToken();
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (show) {
      setPieces(createConfettiPieces(50));
      const timer = setTimeout(() => setPieces([]), 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show && pieces.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
}