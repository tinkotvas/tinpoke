import { useMemo, useCallback, memo } from 'react';
import { Collapse, Flex, Typography, Tag, theme, Tooltip, Checkbox } from 'antd';
import { KANTO, KANTO_MAP } from '../data/pokemon.js';
import { ROUTES, SPECIAL } from '../data/routes.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import { useFilterStore } from '../stores/filterStore.js';
import { useRouteOverlayStore } from '../stores/routeOverlayStore.js';
import Sprite from './Sprite.jsx';

const { Text, Title } = Typography;

const PokemonChip = memo(function PokemonChip({ id, name, types, isCaught, isShiny, onClick }) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);

  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  return (
    <Flex
      vertical
      align="center"
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        padding: token.paddingXS,
        borderRadius: token.borderRadiusSM,
        transition: `all ${token.motionDurationFast}`,
        background: isCaught ? `${token.colorPrimary}08` : 'transparent',
      }}
    >
      <Sprite id={id} size={32} isCaught={isCaught} mode={mode} style={{ position: 'relative' }} />
      {isShiny && (
        <span style={{ position: 'absolute', top: -2, right: -2, fontSize: 10 }}>🌟</span>
      )}
      <Text
        style={{
          fontSize: 10,
          maxWidth: 60,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: isCaught ? token.colorText : token.colorTextQuaternary,
          marginTop: 2,
        }}
      >
        {name}
      </Text>
    </Flex>
  );
});

const RoutePanel = memo(function RoutePanel({ route, onSelectPokemon }) {
  const { token } = theme.useToken();
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);

  const pokemonData = useMemo(() => {
    return route.pokemon.map((id) => {
      const data = KANTO_MAP.get(id);
      return data ? { id, name: data[1], types: data[2] } : null;
    }).filter(Boolean);
  }, [route.pokemon]);

  const caughtCount = useMemo(() => {
    return pokemonData.filter((p) => caught.has(p.id)).length;
  }, [pokemonData, caught]);

  if (pokemonData.length === 0) {
    return (
      <Text type="secondary" style={{ fontStyle: 'italic', padding: token.paddingSM }}>
        No wild Pokémon in this area
      </Text>
    );
  }

  return (
    <Flex wrap="wrap" gap={token.paddingXXS}>
      {pokemonData.map((pokemon) => (
        <PokemonChip
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          types={pokemon.types}
          isCaught={caught.has(pokemon.id)}
          isShiny={shiny?.has(pokemon.id)}
          onClick={onSelectPokemon}
        />
      ))}
    </Flex>
  );
});

const SpecialPokemonCard = memo(function SpecialPokemonCard({ id, location, hint, onSelectPokemon, version, price, give, receive }) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);

  const pokemonData = useMemo(() => {
    const data = KANTO_MAP.get(id);
    return data ? { id, name: data[1], types: data[2] } : null;
  }, [id]);

  const handleClick = useCallback(() => {
    onSelectPokemon?.(id);
  }, [id, onSelectPokemon]);

  if (!pokemonData) return null;

  const isCaught = caught.has(id);
  const isShiny = shiny?.has(id);

  return (
    <Flex
      vertical
      style={{
        background: isCaught ? `${token.colorPrimary}08` : token.colorBgContainer,
        border: `1px solid ${isCaught ? `${token.colorPrimary}40` : token.colorBorder}`,
        borderRadius: token.borderRadius,
        padding: token.paddingSM,
        minWidth: 200,
        flex: '1 1 200px',
      }}
    >
      <Flex align="center" gap={token.paddingSM}>
        <Flex
          justify="center"
          align="center"
          onClick={handleClick}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <Sprite id={id} size={40} isCaught={isCaught} mode={mode} />
          {isShiny && (
            <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 12 }}>🌟</span>
          )}
        </Flex>
        <Flex vertical>
          <Flex align="center" gap={token.paddingXXS}>
            <Text strong style={{ color: isCaught ? token.colorText : token.colorTextQuaternary }}>
              {pokemonData.name}
            </Text>
            {isCaught && (
              <Text style={{ color: token.colorPrimary, fontSize: token.fontSizeSM }}>✓</Text>
            )}
          </Flex>
          {version !== undefined && (
            <Text
              style={{
                fontSize: token.fontSizeXS,
                fontWeight: token.fontWeightStrong,
                color: version === 1 ? '#FF4444' : '#2E8B3A',
              }}
            >
              {version === 0 ? 'Both' : version === 1 ? 'FireRed' : 'LeafGreen'} only
            </Text>
          )}
          {price !== undefined && (
            <Text type="secondary" style={{ fontSize: token.fontSizeXS }}>
              ₽{price.toLocaleString()}
            </Text>
          )}
        </Flex>
      </Flex>
      {location && (
        <Text type="secondary" style={{ fontSize: token.fontSizeXS, marginTop: token.paddingXS }}>
          📍 {location}
        </Text>
      )}
      {hint && (
        <Text type="secondary" style={{ fontSize: token.fontSizeXS, fontStyle: 'italic' }}>
          💡 {hint}
        </Text>
      )}
      {give && receive && (
        <Flex align="center" gap={token.paddingXXS} style={{ marginTop: token.paddingXS }}>
          <Tag>{give}</Tag>
          <Text type="secondary">→</Text>
          <Tag color="blue">{receive}</Tag>
        </Flex>
      )}
    </Flex>
  );
});

const SpecialSection = memo(function SpecialSection({ title, items, onSelectPokemon }) {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={token.paddingSM}>
      <Title level={5} style={{ margin: 0, color: token.colorText }}>
        {title}
      </Title>
      <Flex wrap="wrap" gap={token.paddingSM}>
        {items.map((item, index) => (
          <SpecialPokemonCard
            key={`${item.id || item.pokemon?.join('-')}-${index}`}
            id={item.id || item.pokemon?.[0]}
            location={item.location}
            hint={item.hint}
            version={item.version}
            price={item.price}
            give={item.give}
            receive={item.receive}
            onSelectPokemon={onSelectPokemon}
          />
        ))}
      </Flex>
    </Flex>
  );
});

const GiftCard = memo(function GiftCard({ gift, onSelectPokemon }) {
  const { token } = theme.useToken();
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);

  const pokemonList = useMemo(() => {
    return gift.pokemon.map((id) => {
      const data = KANTO_MAP.get(id);
      return data ? { id, name: data[1], types: data[2] } : null;
    }).filter(Boolean);
  }, [gift.pokemon]);

  return (
    <Flex
      vertical
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        padding: token.paddingSM,
        minWidth: 200,
        flex: '1 1 200px',
      }}
    >
      <Flex wrap="wrap" gap={token.paddingXXS}>
        {pokemonList.map((pokemon) => (
          <PokemonChip
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            isCaught={caught.has(pokemon.id)}
            isShiny={shiny?.has(pokemon.id)}
            onClick={onSelectPokemon}
          />
        ))}
      </Flex>
      <Text type="secondary" style={{ fontSize: token.fontSizeXS, marginTop: token.paddingXS }}>
        📍 {gift.location}
      </Text>
      <Text type="secondary" style={{ fontSize: token.fontSizeXS, fontStyle: 'italic' }}>
        💡 {gift.hint}
      </Text>
    </Flex>
  );
});

const GiftsSection = memo(function GiftsSection({ gifts, onSelectPokemon }) {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={token.paddingSM}>
      <Title level={5} style={{ margin: 0, color: token.colorText }}>
        Gift Pokémon
      </Title>
      <Flex wrap="wrap" gap={token.paddingSM}>
        {gifts.map((gift, index) => (
          <GiftCard
            key={`gift-${index}`}
            gift={gift}
            onSelectPokemon={onSelectPokemon}
          />
        ))}
      </Flex>
    </Flex>
  );
});

const MewCard = memo(function MewCard({ onSelectPokemon }) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  const isCaught = caught.has(151);
  const isShiny = shiny?.has(151);

  return (
    <Flex
      vertical
      align="center"
      style={{
        background: isCaught ? `${token.colorPrimary}08` : token.colorBgContainer,
        border: `1px solid ${isCaught ? `${token.colorPrimary}40` : token.colorBorder}`,
        borderRadius: token.borderRadius,
        padding: token.paddingMD,
        maxWidth: 300,
      }}
    >
      <Flex
        justify="center"
        align="center"
        onClick={() => onSelectPokemon?.(151)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <Sprite id={151} size={48} isCaught={isCaught} mode={mode} />
        {isShiny && (
          <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 14 }}>🌟</span>
        )}
      </Flex>
      <Text strong style={{ marginTop: token.paddingXS }}>
        Mew
      </Text>
      <Text
        type="secondary"
        style={{
          fontSize: token.fontSizeXS,
          textAlign: 'center',
          marginTop: token.paddingXS,
          fontStyle: 'italic',
        }}
      >
        {SPECIAL.mew.note}
      </Text>
    </Flex>
  );
});

export default function RouteChecklist({ onSelectPokemon }) {
  const { token } = theme.useToken();
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  
  // Get persisted expansion state from filter store
  const expandedRoutes = useFilterStore((s) => s.expandedRoutes);
  const setExpandedRoutes = useFilterStore((s) => s.setExpandedRoutes);
  const expandedSpecial = useFilterStore((s) => s.expandedSpecial);
  const setExpandedSpecial = useFilterStore((s) => s.setExpandedSpecial);
  
  // Route overlay selection state
  const selectedRouteIds = useRouteOverlayStore((s) => s.selectedRouteIds);
  const toggleRoute = useRouteOverlayStore((s) => s.toggleRoute);

  const handleRoutesExpand = useCallback((keys) => {
    setExpandedRoutes(keys);
  }, [setExpandedRoutes]);

  const handleSpecialExpand = useCallback((keys) => {
    setExpandedSpecial(keys);
  }, [setExpandedSpecial]);

  const handleRouteCheckboxChange = useCallback((e, routeId) => {
    e.stopPropagation();
    toggleRoute(routeId);
  }, [toggleRoute]);

  const routeItems = useMemo(() => {
    return ROUTES.map((route) => {
      const pokemonData = route.pokemon.map((id) => {
        const data = KANTO_MAP.get(id);
        return data ? { id } : null;
      }).filter(Boolean);
      const caughtCount = pokemonData.filter((p) => caught.has(p.id)).length;
      const isSelected = selectedRouteIds.has(route.id);

      return {
        key: route.id,
        label: (
          <Flex justify="space-between" align="center" style={{ width: '100%', paddingRight: token.paddingSM }}>
            <Flex align="center" gap={token.paddingXS}>
              <Checkbox
                checked={isSelected}
                onClick={(e) => handleRouteCheckboxChange(e, route.id)}
              />
              <Text strong style={{ color: isSelected ? token.colorPrimary : undefined }}>
                {route.name}
              </Text>
            </Flex>
            <Tag color={caughtCount === pokemonData.length ? 'success' : 'default'}>
              {caughtCount}/{pokemonData.length}
            </Tag>
          </Flex>
        ),
        children: (
          <RoutePanel
            route={route}
            onSelectPokemon={onSelectPokemon}
          />
        ),
      };
    });
  }, [caught, onSelectPokemon, token, selectedRouteIds, handleRouteCheckboxChange]);

  const specialItems = useMemo(() => [
    {
      key: 'legendaries',
      label: <Text strong>Legendary Pokémon</Text>,
      children: (
        <SpecialSection
          title="Legendary Pokémon"
          items={SPECIAL.legendaries}
          onSelectPokemon={onSelectPokemon}
        />
      ),
    },
    {
      key: 'gifts',
      label: <Text strong>Gift Pokémon</Text>,
      children: (
        <GiftsSection
          gifts={SPECIAL.gifts}
          onSelectPokemon={onSelectPokemon}
        />
      ),
    },
    {
      key: 'gamecorner',
      label: <Text strong>Game Corner</Text>,
      children: (
        <SpecialSection
          title="Game Corner (Celadon City)"
          items={SPECIAL.gameCorner}
          onSelectPokemon={onSelectPokemon}
        />
      ),
    },
    {
      key: 'trades',
      label: <Text strong>In-Game Trades</Text>,
      children: (
        <SpecialSection
          title="In-Game Trades"
          items={SPECIAL.trades}
          onSelectPokemon={onSelectPokemon}
        />
      ),
    },
    {
      key: 'mew',
      label: <Text strong>Event Pokémon</Text>,
      children: (
        <Flex vertical gap={token.paddingSM}>
          <Title level={5} style={{ margin: 0, color: token.colorText }}>
            Event-Only Pokémon
          </Title>
          <MewCard onSelectPokemon={onSelectPokemon} />
        </Flex>
      ),
    },
  ], [onSelectPokemon, token]);

  // Split routes into 3 columns
  const routesPerColumn = Math.ceil(routeItems.length / 3);
  const column1 = routeItems.slice(0, routesPerColumn);
  const column2 = routeItems.slice(routesPerColumn, routesPerColumn * 2);
  const column3 = routeItems.slice(routesPerColumn * 2);

  // Get expanded keys for each column
  const column1Keys = column1.map(item => item.key);
  const column2Keys = column2.map(item => item.key);
  const column3Keys = column3.map(item => item.key);

  const expandedColumn1 = expandedRoutes.filter(key => column1Keys.includes(key));
  const expandedColumn2 = expandedRoutes.filter(key => column2Keys.includes(key));
  const expandedColumn3 = expandedRoutes.filter(key => column3Keys.includes(key));

  return (
    <Flex vertical gap={token.paddingLG} style={{ padding: token.paddingMD }}>
      {/* Routes & Areas in 3 Columns */}
      <Flex vertical gap={token.paddingSM}>
        <Title level={4} style={{ margin: 0, color: token.colorText }}>
          Routes & Areas
        </Title>
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
          Pokémon by location
        </Text>
      </Flex>

      <Flex gap={token.paddingMD} align="flex-start">
        <Flex vertical style={{ flex: 1 }}>
          <Collapse
            items={column1}
            activeKey={expandedColumn1}
            onChange={(keys) => {
              // Merge with other columns' expanded keys
              const newExpanded = [
                ...expandedRoutes.filter(key => !column1Keys.includes(key)),
                ...keys
              ];
              handleRoutesExpand(newExpanded);
            }}
            ghost
            style={{ background: 'transparent' }}
          />
        </Flex>
        <Flex vertical style={{ flex: 1 }}>
          <Collapse
            items={column2}
            activeKey={expandedColumn2}
            onChange={(keys) => {
              const newExpanded = [
                ...expandedRoutes.filter(key => !column2Keys.includes(key)),
                ...keys
              ];
              handleRoutesExpand(newExpanded);
            }}
            ghost
            style={{ background: 'transparent' }}
          />
        </Flex>
        <Flex vertical style={{ flex: 1 }}>
          <Collapse
            items={column3}
            activeKey={expandedColumn3}
            onChange={(keys) => {
              const newExpanded = [
                ...expandedRoutes.filter(key => !column3Keys.includes(key)),
                ...keys
              ];
              handleRoutesExpand(newExpanded);
            }}
            ghost
            style={{ background: 'transparent' }}
          />
        </Flex>
      </Flex>

      {/* Special Pokémon Section */}
      <Flex vertical gap={token.paddingSM} style={{ marginTop: token.paddingMD }}>
        <Title level={4} style={{ margin: 0, color: token.colorText }}>
          Special Pokémon
        </Title>
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
          Legendaries, gifts, trades & more
        </Text>
      </Flex>

      <Collapse
        items={specialItems}
        activeKey={expandedSpecial}
        onChange={handleSpecialExpand}
        ghost
        style={{ background: 'transparent' }}
      />
    </Flex>
  );
}