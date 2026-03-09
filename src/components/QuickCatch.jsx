import { memo, useState, useMemo, useRef, useCallback, useEffect, forwardRef } from 'react';
import { FloatButton, Input, Flex, Typography, theme, Dropdown, Switch } from 'antd';

import { useShallow } from 'zustand/react/shallow';
import { VirtuosoGrid } from 'react-virtuoso';
import { KANTO } from '../data/pokemon.js';
import { ROUTES } from '../data/routes.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useRouteOverlayStore } from '../stores/routeOverlayStore.js';
import { useControlsVisibilityStore } from '../stores/controlsVisibilityStore.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import { useZoneSortStore } from '../stores/zoneSortStore.js';
import { useSound } from '../hooks/useSound.js';

const { Text } = Typography;

const SPRITE_SIZE = 70;
const CARD_WIDTH = SPRITE_SIZE + 16;

// VirtuosoGrid wrapper components
const GridList = forwardRef(function GridList({ style, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
});

const GridItem = memo(function GridItem({ children, ...props }) {
  return (
    <div
      {...props}
      style={{
        flex: `1 0 ${CARD_WIDTH}px`,
        maxWidth: CARD_WIDTH,
      }}
    >
      {children}
    </div>
  );
});

const PokemonMiniCard = memo(function PokemonMiniCard({
  pokemon,
  isCaught,
  isShiny,
  isInRoute,
  onToggle
}) {
  const { token } = theme.useToken();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(pokemon.id);
  }, [pokemon.id, onToggle]);

  // Compute filter for silhouette effect
  const filter = isCaught ? 'none' : 'brightness(0) opacity(0.4)';

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      onClick={handleClick}
      style={{
        width: SPRITE_SIZE + 16,
        padding: token.paddingXXS,
        cursor: 'pointer',
        borderRadius: token.borderRadiusSM,
        background: isInRoute && !isCaught
          ? 'rgba(24, 144, 255, 0.15)'
          : 'transparent',
        border: isInRoute && !isCaught
          ? `1px solid ${token.colorPrimary}`
          : '1px solid transparent',
        transition: 'all 0.2s ease',
        opacity: isCaught ? 0.6 : 1,
      }}
    >
      <div style={{ position: 'relative', width: SPRITE_SIZE, height: SPRITE_SIZE }}>
        {isCaught && isShiny && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              fontSize: 10,
              zIndex: 2,
            }}
          >
            🌟
          </span>
        )}
        <img
          src={`./sprites/${pokemon.id}.png`}
          alt={pokemon.name}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
          style={{
            imageRendering: 'pixelated',
            filter,
            transition: 'filter 0.2s ease',
          }}
        />
        {isCaught && (
          <span
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              fontSize: 12,
            }}
          >
            ✓
          </span>
        )}
      </div>
      <Text
        style={{
          fontSize: 9,
          maxWidth: SPRITE_SIZE + 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {pokemon.name}
      </Text>
    </Flex>
  );
});

const QuickCatch = memo(function QuickCatch() {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef(null);

  const { playCatch, playUncatch } = useSound();

  const { caught, shiny, toggle } = useCaughtStore(useShallow((s) => ({
    caught: s.caught,
    shiny: s.shiny,
    toggle: s.toggle,
  })));

  const selectedRouteIds = useRouteOverlayStore((s) => s.selectedRouteIds);
  const showControls = useControlsVisibilityStore((s) => s.showControls);
  const { zoneOrder, giftOnly } = useZoneSortStore(useShallow((s) => ({
    zoneOrder: s.zoneOrder,
    giftOnly: s.giftOnly,
  })));

  const { showCaughtInQuickCatch, setShowCaughtInQuickCatch } = useSettingsStore(useShallow((s) => ({
    showCaughtInQuickCatch: s.showCaughtInQuickCatch,
    setShowCaughtInQuickCatch: s.setShowCaughtInQuickCatch,
  })));

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  // Get Pokemon from selected routes
  const routePokemonIds = useMemo(() => {
    if (selectedRouteIds.size === 0) return new Set();
    const ids = new Set();
    for (const routeId of selectedRouteIds) {
      const route = ROUTES.find((r) => r.id === routeId);
      if (route?.pokemon) {
        route.pokemon.forEach((id) => ids.add(id));
      }
    }
    return ids;
  }, [selectedRouteIds]);

  // Build and sort Pokemon list
  const pokemonList = useMemo(() => {
    const q = search.toLowerCase();

    // Filter by search
    let filtered = KANTO.filter(([id, name]) => {
      if (!q) return true;
      return name.toLowerCase().includes(q) || String(id).padStart(3, '0').includes(q);
    });

    // Map to objects with metadata
    let list = filtered.map(([id, name, types]) => {
      const isCaught = caught.has(id);
      const isShiny = shiny?.has(id) || false;
      const isInRoute = routePokemonIds.has(id);

      return {
        id,
        name,
        types,
        isCaught,
        isShiny,
        isInRoute,
      };
    });

    // Filter out caught Pokemon if setting is disabled
    if (!showCaughtInQuickCatch) {
      list = list.filter((p) => !p.isCaught);
    }

    list.sort((a, b) => {
      if (a.isCaught !== b.isCaught) return a.isCaught ? 1 : -1;
      if (a.isInRoute !== b.isInRoute) return a.isInRoute ? -1 : 1;
      const aGift = giftOnly.has(a.id);
      const bGift = giftOnly.has(b.id);
      if (aGift !== bGift) return aGift ? 1 : -1;
      const aPos = zoneOrder.get(a.id) ?? Infinity;
      const bPos = zoneOrder.get(b.id) ?? Infinity;
      if (aPos !== bPos) return aPos - bPos;
      return a.id - b.id;
    });

    return list;
  }, [search, caught, shiny, routePokemonIds, showCaughtInQuickCatch, zoneOrder, giftOnly]);

  // Count missing in routes
  const missingInRoutesCount = useMemo(() => {
    if (routePokemonIds.size === 0) return 0;
    let count = 0;
    for (const id of routePokemonIds) {
      if (!caught.has(id)) count++;
    }
    return count;
  }, [routePokemonIds, caught]);

  // Handle toggle with sound
  const handleToggle = useCallback((id) => {
    const wasCaught = useCaughtStore.getState().caught.has(id);
    toggle(id);
    if (wasCaught) {
      playUncatch();
    } else {
      playCatch();
    }
  }, [toggle, playCatch, playUncatch]);

  // Handle Enter key - catch first matching Pokemon
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && pokemonList.length > 0) {
      const firstPokemon = pokemonList[0];
      handleToggle(firstPokemon.id);
      setSearch('');
    }
  }, [pokemonList, handleToggle]);

  // Clear search when closing
  const handleOpenChange = useCallback((newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearch('');
    }
  }, []);

  // Don't show if controls are hidden
  const visible = showControls || open;

  // Dropdown content with event stopping
  const dropdownContent = (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Flex
        vertical
        gap={token.paddingXS}
        style={{
          width: 280,
          maxHeight: 400,
          padding: token.paddingSM,
          background: token.colorBgElevated,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Flex justify="space-between" align="center">
          {routePokemonIds.size > 0 ? (
            <Text type="secondary" style={{ fontSize: 11 }}>
              {missingInRoutesCount} missing in {selectedRouteIds.size} selected route{selectedRouteIds.size > 1 ? 's' : ''}
            </Text>
          ) : (
            <span />
          )}
          <Flex align="center" gap={4}>
            <Text type="secondary" style={{ fontSize: 10 }}>Show caught</Text>
            <Switch
              size="small"
              checked={showCaughtInQuickCatch}
              onChange={(checked) => setShowCaughtInQuickCatch(checked)}
            />
          </Flex>
        </Flex>
        <Input.Search
          ref={searchInputRef}
          placeholder="Search Pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          allowClear
          size="small"
        />

        {pokemonList.length > 0 ? (
          <VirtuosoGrid
            style={{ height: 320 }}
            data={pokemonList}
            itemContent={(index, pokemon) => (
              <PokemonMiniCard
                pokemon={pokemon}
                isCaught={pokemon.isCaught}
                isShiny={pokemon.isShiny}
                isInRoute={pokemon.isInRoute}
                onToggle={handleToggle}
              />
            )}
            components={{
              List: GridList,
              Item: GridItem,
            }}
          />
        ) : (
          <Text type="secondary" style={{ textAlign: 'center', padding: token.paddingSM }}>
            No Pokemon found
          </Text>
        )}
      </Flex>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      trigger={['click']}
      placement="topRight"
      destroyOnHidden={false}
      popupRender={() => dropdownContent}
      transitionName=""
    >
      <FloatButton
        icon={<img src="./poke-ball.png" alt="" width={30} height={30} />}
        tooltip="Quick Catch"
        style={{
          position: 'absolute',
          bottom: 52,
          right: 12,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: visible ? 'auto' : 'none',
          zIndex: 100,
          padding: 0,
        }}
      />
    </Dropdown>
  );
});

export default QuickCatch;