import { useCallback, memo, useMemo } from 'react';
import { Typography, Flex, theme, Tooltip, message } from 'antd';
import { TYPE_HEX_COLORS } from '../data/pokemon.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import Sprite from './Sprite.jsx';
import TypeTag from './TypeTag.jsx';

const { Text } = Typography;

const PokemonMiniCard = memo(function PokemonMiniCard({
  id,
  name,
  types,
  isCaught,
  isShiny,
  onClick,
  onSelect,
  size = 'card',
}) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);

  const isMini = size === 'mini';
  const spriteSize = isMini ? 44 : 80;

  // Type accent color is custom per Pokemon type - not from theme
  const typeAccentColor = useMemo(() => {
    const primaryType = types[0];
    return TYPE_HEX_COLORS[primaryType] || '#888888';
  }, [types]);

  const handleShinyClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.(id, 'shiny');
  }, [id, onClick]);

  const handleCardClick = useCallback((e) => {
    if (e.shiftKey) {
      e.stopPropagation();
      e.preventDefault();
      if (isCaught) {
        onClick?.(id, 'shiny');
      } else {
        onClick?.(id, 'caught');
        message.success({
          content: `${name} caught!`,
          duration: 2,
        });
      }
    } else {
      onSelect?.(id);
    }
  }, [id, isCaught, name, onClick, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.shiftKey) {
        if (isCaught) {
          onClick?.(id, 'shiny');
        } else {
          onClick?.(id, 'caught');
          message.success({
            content: `${name} caught!`,
            duration: 2,
          });
        }
      } else {
        onSelect?.(id);
      }
    }
  }, [id, isCaught, name, onClick, onSelect]);

  const formattedNumber = String(id).padStart(3, '0');

  // Dynamic border color based on caught state
  const caughtBorderColor = isCaught
    ? `${token.colorPrimary}50`
    : token.colorBorder;
  
  // Memoize card style to avoid recreation on every render
  const cardStyle = useMemo(() => ({
    flex: isMini ? '1 1 80px' : undefined,
    maxWidth: isMini ? 120 : undefined,
    background: isCaught
      ? `linear-gradient(145deg, ${token.colorPrimary}15, ${token.colorPrimary}08)`
      : token.colorBgContainer,
    borderTop: `1px solid ${caughtBorderColor}`,
    borderRight: `1px solid ${caughtBorderColor}`,
    borderBottom: `1px solid ${caughtBorderColor}`,
    borderLeft: `4px solid ${typeAccentColor}`,
    borderRadius: token.borderRadius,
    padding: isMini
      ? `${token.paddingSM}px ${token.paddingXS}px`
      : `${token.paddingMD}px ${token.paddingSM}px ${token.paddingSM + 2}px`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  }), [isMini, isCaught, token, caughtBorderColor, typeAccentColor]);

  return (
    <Flex
      vertical
      align="center"
      role="button"
      tabIndex={0}
      aria-label={`${name}, #${formattedNumber}. ${isCaught ? 'Caught' : 'Not caught'}. ${isShiny ? 'Shiny.' : ''} Click to open details. Shift+click to toggle caught/shiny.`}
      className={`pokemon-card ${isShiny ? 'shiny-pokemon' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      style={cardStyle}
    >
      {isShiny && (
        <span className="shiny-indicator">🌟</span>
      )}

      {isCaught && !isShiny && (
        <Flex
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            top: isMini ? 5 : 4,
            right: isMini ? 5 : 4,
            width: isMini ? 14 : 5,
            height: isMini ? 14 : 5,
            borderRadius: '50%',
            background: token.colorPrimary,
            boxShadow: `0 0 4px ${token.colorPrimary}`,
          }}
        >
          {isMini && (
            <span style={{ fontSize: 8, color: token.colorTextLightSolid }}>✓</span>
          )}
        </Flex>
      )}

      {isCaught && (
        <Tooltip title="Toggle shiny status" mouseEnterDelay={0.5}>
          <Flex
            align="center"
            justify="center"
            onClick={handleShinyClick}
            className="shiny-toggle-btn"
            style={{
              position: 'absolute',
              bottom: isMini ? 38 : 8,
              right: isMini ? 4 : 6,
              width: isMini ? 22 : 28,
              height: isMini ? 22 : 28,
              borderRadius: '50%',
              background: isShiny ? '#FFD700' : token.colorBgElevated,
              border: `1px solid ${isShiny ? '#FFD700' : token.colorBorder}`,
              cursor: 'pointer',
              fontSize: isMini ? 11 : 14,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 3,
            }}
          >
            🌟
          </Flex>
        </Tooltip>
      )}

      <Text
        type="secondary"
        style={{
          letterSpacing: 1,
          display: 'block',
          marginBottom: isMini ? 0 : token.paddingXS,
          color: isCaught ? token.colorPrimaryActive : undefined,
        }}
      >
        #{formattedNumber}
      </Text>

      <Sprite
        id={id}
        size={spriteSize}
        isCaught={isCaught}
        mode={mode}
      />

      <Text
        strong
        style={{
          display: 'block',
          marginTop: isMini ? token.paddingXXS : token.paddingXS,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: isMini ? 0 : `0 ${token.paddingXXS}px`,
          maxWidth: '100%',
          color: isCaught ? token.colorText : token.colorTextQuaternary,
        }}
      >
        {name}
      </Text>

      <Flex gap={isMini ? 2 : 4} justify="center" style={{ marginTop: isMini ? token.paddingXXS : token.paddingXS }} wrap="wrap">
        {types.map((t) => (
          <TypeTag key={t} type={t} size={isMini ? 'mini' : 'default'} />
        ))}
      </Flex>

      {isMini && isCaught && (
        <Text
          style={{
            marginTop: token.paddingXXS,
            color: isShiny ? '#FFD700' : token.colorTextTertiary,
          }}
        >
          {isShiny ? '🌟' : 'shift+🌟'}
        </Text>
      )}
    </Flex>
  );
});

export default PokemonMiniCard;
