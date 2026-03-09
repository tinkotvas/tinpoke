import { useMemo, memo } from 'react';
import { Flex, Typography, Button, theme, Space } from 'antd';
import {
  CloseOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  DragOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import { useShallow } from 'zustand/react/shallow';
import { ROUTES } from '../data/routes.js';
import { KANTO_MAP } from '../data/pokemon.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useRouteOverlayStore } from '../stores/routeOverlayStore.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import { useFilterStore } from '../stores/filterStore.js';
import Sprite from './Sprite.jsx';

const { Text } = Typography;

const SPRITE_SIZE = 72;

const PokemonSprite = memo(function PokemonSprite({ id, name, isCaught, isShiny, onSelect }) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);

  const primaryColor = token.colorPrimary || '#1890ff';

  return (
    <div
      onClick={() => onSelect(id)}
      style={{
        position: 'relative',
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        cursor: 'pointer',
      }}
    >
      {!isCaught ? (
        <>
          {/* Layer 1: Colored glow behind */}
          <img
            src={`./sprites/${id}.png`}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: SPRITE_SIZE,
              height: SPRITE_SIZE,
              imageRendering: 'pixelated',
              filter: `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 3px ${primaryColor})`,
              zIndex: 0,
            }}
          />
          {/* Layer 2: Black silhouette on top */}
          <img
            src={`./sprites/${id}.png`}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: SPRITE_SIZE,
              height: SPRITE_SIZE,
              imageRendering: 'pixelated',
              filter: 'brightness(0)',
              zIndex: 1,
            }}
          />
        </>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <Sprite id={id} size={SPRITE_SIZE} isCaught={true} mode={mode} />
        </div>
      )}
      {isShiny && (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            fontSize: 12,
            zIndex: 3,
          }}
        >
          🌟
        </span>
      )}
    </div>
  );
});

const RouteOverlay = memo(function RouteOverlay({ onSelectPokemon }) {
  const { token } = theme.useToken();
  const setFilter = useFilterStore((s) => s.setFilter);

  const { selectedRouteIds, overlayBounds, overlayFilter, setOverlayBounds, toggleOverlayFilter, clearAllRoutes } =
    useRouteOverlayStore(useShallow((s) => ({
      selectedRouteIds: s.selectedRouteIds,
      overlayBounds: s.overlayBounds,
      overlayFilter: s.overlayFilter,
      setOverlayBounds: s.setOverlayBounds,
      toggleOverlayFilter: s.toggleOverlayFilter,
      clearAllRoutes: s.clearAllRoutes,
    })));

  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);

  // Get unique Pokemon from all selected routes
  const pokemonList = useMemo(() => {
    if (selectedRouteIds.size === 0) return [];

    // Collect all unique Pokemon IDs from selected routes
    const allIds = new Set();
    for (const routeId of selectedRouteIds) {
      const route = ROUTES.find((r) => r.id === routeId);
      if (route?.pokemon) {
        route.pokemon.forEach((id) => allIds.add(id));
      }
    }

    // Map to Pokemon data
    const list = [];
    for (const id of allIds) {
      const data = KANTO_MAP.get(id);
      if (data) {
        const isCaught = caught.has(id);
        // Filter based on overlayFilter setting
        if (overlayFilter === 'missing' && isCaught) continue;
        list.push({
          id,
          name: data[1],
          types: data[2],
          isCaught,
          isShiny: shiny?.has(id),
        });
      }
    }

    // Sort: uncaught first, then by dex number
    list.sort((a, b) => {
      if (a.isCaught !== b.isCaught) return a.isCaught ? 1 : -1;
      return a.id - b.id;
    });

    return list;
  }, [selectedRouteIds, caught, shiny, overlayFilter]);

  // Don't render if no routes selected
  if (selectedRouteIds.size === 0) return null;

  const headerText = overlayFilter === 'missing'
    ? `${selectedRouteIds.size} route${selectedRouteIds.size > 1 ? 's' : ''} - ${pokemonList.length} missing`
    : `${selectedRouteIds.size} route${selectedRouteIds.size > 1 ? 's' : ''} - ${pokemonList.length} total`;

  return (
    <Rnd
      position={{ x: overlayBounds.x, y: overlayBounds.y }}
      size={{ width: overlayBounds.width, height: overlayBounds.height }}
      onDragStop={(e, d) => {
        setOverlayBounds({
          ...overlayBounds,
          x: d.x,
          y: d.y,
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setOverlayBounds({
          x: position.x,
          y: position.y,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
      }}
      minWidth={150}
      minHeight={150}
      bounds="parent"
      dragHandleClassName="drag-handle"
    >
      <Flex
        vertical
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Minimal drag header */}
        <Flex
          align="center"
          justify="space-between"
          className="drag-handle"
          style={{
            padding: `2px ${token.paddingXXS}px`,
            cursor: 'move',
            flexShrink: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: `${token.borderRadiusSM}px ${token.borderRadiusSM}px 0 0`,
          }}
        >
          <Space size={4}>
            <DragOutlined style={{ color: token.colorTextSecondary, fontSize: 10 }} />

            <Button
              type="text"
              size="small"
              icon={overlayFilter === 'all' ? <UnorderedListOutlined /> : <FilterOutlined />}
              onClick={toggleOverlayFilter}
              style={{ fontSize: 10, padding: 0, minWidth: 20, height: 20 }}
            />

            <Text type="secondary" style={{ fontSize: 10 }}>
              {headerText}
            </Text>
          </Space>

          <Space size={2}>
            <Button
              type="text"
              size="small"
              icon={<EnvironmentOutlined />}
              onClick={() => setFilter('routes')}
              style={{ fontSize: 10, padding: 0, minWidth: 20, height: 20 }}
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={clearAllRoutes}
              style={{ fontSize: 10, padding: 0, minWidth: 20, height: 20 }}
            />
          </Space>
        </Flex>

        {/* Pokemon grid */}
        <Flex
          vertical
          style={{
            padding: token.paddingXXS,
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
          }}
        >
          <Flex
            wrap="wrap"
            gap={4}
            justify="center"
          >
            {pokemonList.map((pokemon) => (
              <PokemonSprite
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                isCaught={pokemon.isCaught}
                isShiny={pokemon.isShiny}
                onSelect={onSelectPokemon}
              />
            ))}
          </Flex>

          {pokemonList.length === 0 && (
            <Flex justify="center" style={{ padding: token.paddingSM }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                All caught! 🎉
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      {/* Bottom-right resize corner indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 14,
          height: 14,
          cursor: 'se-resize',
          pointerEvents: 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block' }}>
          <line x1="4" y1="13" x2="13" y2="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="13" x2="13" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="13" x2="13" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </Rnd>
  );
});

export default RouteOverlay;