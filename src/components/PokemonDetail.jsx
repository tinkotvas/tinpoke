import { useMemo, useCallback, memo } from 'react';
import { Drawer, Flex, Typography, Tag, Button, Progress, Table, theme, Divider, Tooltip, Popconfirm } from 'antd';
import { CheckOutlined, StarFilled, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import { KANTO_MAP } from '../data/pokemon.js';
import { EVOLUTIONS } from '../data/evolutions.js';
import { LOCATIONS } from '../data/locations.js';
import { STATS, STAT_LABELS } from '../data/stats.js';
import { formatCaughtDate } from '../utils/pokemon.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import Sprite from './Sprite.jsx';
import TypeTag from './TypeTag.jsx';

const { Title, Text } = Typography;

// Stat colors are semantic (red=bad, green=good) - not from theme
function getStatColor(value) {
  if (value < 50) return '#ff4d4f';
  if (value < 80) return '#fa8c16';
  if (value < 100) return '#52c41a';
  return '#1890ff';
}

// Version colors are game-specific - not from theme
const VERSION_COLORS = {
  firered: '#FF4444',
  leafgreen: '#2E8B3A',
};

const EvolutionStage = memo(function EvolutionStage({ 
  id, 
  name, 
  types, 
  isCaught, 
  isShiny, 
  method, 
  onClick,
  isCurrent,
}) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);

  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  return (
    <Flex vertical align="center" gap={token.paddingXXS}>
      {method && (
        <Text type="tertiary" style={{ textAlign: 'center', maxWidth: 80 }}>
          {method}
        </Text>
      )}
      <Flex
        vertical
        align="center"
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          padding: token.paddingXS,
          borderRadius: token.borderRadius,
          border: isCurrent ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
          background: isCurrent ? `${token.colorPrimary}10` : 'transparent',
          opacity: isCurrent ? 1 : 0.9,
        }}
      >
        <Sprite id={id} size={48} isCaught={isCaught} mode={mode} />
        <Text
          strong={isCurrent}
          style={{
            color: isCaught ? token.colorText : token.colorTextQuaternary,
            marginTop: 2,
          }}
        >
          {name}
        </Text>
        <Flex gap={2}>
          {types.map((t) => (
            <TypeTag key={t} type={t} size="small" tooltip={false} />
          ))}
        </Flex>
        {isCaught && (
          <Text style={{ color: isShiny ? '#FFD700' : token.colorPrimary }}>
            {isShiny ? '🌟' : '✓'}
          </Text>
        )}
      </Flex>
    </Flex>
  );
});

const ArrowRight = memo(function ArrowRight() {
  return <Text type="quaternary">→</Text>;
});

const EvolutionChain = memo(function EvolutionChain({ 
  pokemonId, 
  onSelectPokemon 
}) {
  const { token } = theme.useToken();
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  
  const family = useMemo(() => {
    for (const entry of EVOLUTIONS) {
      const [baseOrIds] = entry;
      
      if (Array.isArray(baseOrIds[0])) {
        // Branching: [[baseId, [evoId, 'method'], ...]]
        const baseId = baseOrIds[0];
        const evolutions = baseOrIds.slice(1);
        const allIds = [baseId, ...evolutions.map(([id]) => id)];
        if (allIds.includes(pokemonId)) {
          return { type: 'branching', baseId, evolutions };
        }
      } else {
        // Linear: [[id1, id2, id3], ['method1', 'method2']]
        const ids = baseOrIds;
        const methods = entry[1] || [];
        if (ids.includes(pokemonId)) {
          return { type: 'linear', ids, methods };
        }
      }
    }
    return null;
  }, [pokemonId]);

  if (!family) {
    return (
      <Text type="secondary" style={{ fontStyle: 'italic' }}>
        No evolution chain
      </Text>
    );
  }

  const getPokemonData = (id) => {
    const data = KANTO_MAP.get(id);
    return data || [id, 'Unknown', []];
  };

  if (family.type === 'linear') {
    const { ids, methods } = family;
    return (
      <Flex align="flex-start" gap={token.paddingXS} wrap="wrap">
        {ids.map((id, index) => {
          const [_, name, types] = getPokemonData(id);
          return (
            <Flex key={id} align="center" gap={token.paddingXS}>
              <EvolutionStage
                id={id}
                name={name}
                types={types}
                isCaught={caught.has(id)}
                isShiny={shiny?.has(id)}
                onClick={onSelectPokemon}
                isCurrent={id === pokemonId}
              />
              {index < ids.length - 1 && methods[index] && (
                <Flex vertical align="center">
                  <ArrowRight />
                  <Text style={{ fontSize: 10, color: token.colorTextQuaternary }}>
                    {methods[index]}
                  </Text>
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>
    );
  }

  if (family.type === 'branching') {
    const { baseId, evolutions } = family;
    const [baseName, baseTypes] = getPokemonData(baseId).slice(1);
    
    return (
      <Flex align="flex-start" gap={token.paddingXS} wrap="wrap">
        <EvolutionStage
          id={baseId}
          name={baseName}
          types={baseTypes}
          isCaught={caught.has(baseId)}
          isShiny={shiny?.has(baseId)}
          onClick={onSelectPokemon}
          isCurrent={baseId === pokemonId}
        />
        <Flex vertical gap={token.paddingXS}>
          {evolutions.map(([evoId, method]) => {
            const [_, evoName, evoTypes] = getPokemonData(evoId);
            return (
              <Flex key={evoId} align="center" gap={token.paddingXS}>
                <Flex vertical align="center">
                  <ArrowRight />
                  <Text style={{ fontSize: 10, color: token.colorTextQuaternary, maxWidth: 60, textAlign: 'center' }}>
                    {method}
                  </Text>
                </Flex>
                <EvolutionStage
                  id={evoId}
                  name={evoName}
                  types={evoTypes}
                  isCaught={caught.has(evoId)}
                  isShiny={shiny?.has(evoId)}
                  onClick={onSelectPokemon}
                  isCurrent={evoId === pokemonId}
                />
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    );
  }

  return null;
});

const LocationTable = memo(function LocationTable({ pokemonId }) {
  const { token } = theme.useToken();
  
  const locations = useMemo(() => {
    return LOCATIONS[pokemonId] || [];
  }, [pokemonId]);

  if (locations.length === 0) {
    return <Text type="secondary">No location data available</Text>;
  }

  const columns = [
    {
      title: 'Location',
      dataIndex: 0,
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Method',
      dataIndex: 1,
      key: 'method',
      width: 100,
      render: (method) => (
        <Tag
          variant="filled"
          style={{
            fontSize: token.fontSizeXS,
            borderRadius: token.borderRadiusSM,
          }}
        >
          {method}
        </Tag>
      ),
    },
    {
      title: 'Ver',
      dataIndex: 2,
      key: 'version',
      width: 50,
      render: (version) => {
        if (version === 0) return null;
        return (
          <Text
            style={{
              fontSize: token.fontSizeXS,
              fontWeight: token.fontWeightStrong,
              color: version === 1 ? '#FF4444' : '#2E8B3A',
            }}
          >
            {version === 1 ? 'FR' : 'LG'}
          </Text>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={locations}
      columns={columns}
      size="small"
      pagination={false}
      rowKey={(record) => `${record[0]}-${record[1]}`}
      style={{ marginTop: token.paddingSM }}
    />
  );
});

const StatBars = memo(function StatBars({ pokemonId }) {
  const { token } = theme.useToken();
  
  const stats = useMemo(() => {
    return STATS[pokemonId] || [];
  }, [pokemonId]);

  if (stats.length === 0) {
    return <Text type="secondary">No stat data available</Text>;
  }

  const maxStat = 255;

  return (
    <Flex vertical gap={token.paddingXS}>
      {stats.map((value, index) => (
        <Flex key={STAT_LABELS[index]} align="center" gap={token.paddingSM}>
          <Text
            style={{
              width: 50,
              fontSize: token.fontSizeSM,
              color: token.colorTextSecondary,
            }}
          >
            {STAT_LABELS[index]}
          </Text>
          <Progress
            percent={(value / maxStat) * 100}
            format={() => (
              <Text style={{ color: getStatColor(value), fontWeight: token.fontWeightStrong }}>
                {value}
              </Text>
            )}
            strokeColor={getStatColor(value)}
            railColor={token.colorBorder}
            size="small"
            style={{ flex: 1, minWidth: 100 }}
          />
        </Flex>
      ))}
    </Flex>
  );
});

export default function PokemonDetail({
  pokemonId,
  onClose,
  onSelect,
}) {
  const { token } = theme.useToken();
  const mode = useSettingsStore((s) => s.theme);
  
  // Read from store directly
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  const getCaughtTime = useCaughtStore((s) => s.getCaughtTime);
  const toggle = useCaughtStore((s) => s.toggle);
  const toggleShiny = useCaughtStore((s) => s.toggleShiny);

  const pokemon = useMemo(() => {
    if (!pokemonId) return null;
    return KANTO_MAP.get(pokemonId);
  }, [pokemonId]);

  const caughtTime = useMemo(() => {
    if (!pokemonId || !caught.has(pokemonId)) return null;
    return getCaughtTime(pokemonId);
  }, [pokemonId, caught, getCaughtTime]);

  const isCaught = pokemonId ? caught.has(pokemonId) : false;
  const isShiny = pokemonId ? shiny?.has(pokemonId) : false;

  const handleToggleCaught = useCallback(() => {
    if (pokemonId) {
      toggle(pokemonId);
    }
  }, [pokemonId, toggle]);

  const handleToggleShiny = useCallback(() => {
    if (pokemonId && caught.has(pokemonId)) {
      toggleShiny(pokemonId);
    }
  }, [pokemonId, caught, toggleShiny]);

  const handleSelectPokemon = useCallback((id) => {
    onSelect?.(id);
  }, [onSelect]);

  if (!pokemon) return null;

  const [id, name, types] = pokemon;
  const formattedNumber = String(id).padStart(3, '0');

  const drawerWidth = Math.min(520, typeof window !== 'undefined' ? window.innerWidth - 40 : 480);

  return (
    <Drawer
      open={!!pokemonId}
      onClose={onClose}
      placement="right"
      styles={{
        wrapper: {
          width: drawerWidth,
        },
        body: { padding: token.paddingMD },
        header: { display: 'none' },
      }}
    >
      <Flex vertical gap={token.paddingMD}>
        {/* Close button */}
        <Flex justify="flex-end">
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{ color: token.colorTextSecondary }}
          />
        </Flex>

        {/* Header with sprite, name, types */}
        <Flex vertical align="center" gap={token.paddingSM}>
          <Sprite id={id} size={96} isCaught={isCaught} mode={mode} />

          <Flex align="baseline" gap={token.paddingXS}>
            <Text type="secondary" style={{ letterSpacing: 1 }}>
              #{formattedNumber}
            </Text>
            <Title level={3} style={{ margin: 0 }}>
              {name}
            </Title>
          </Flex>

          <Flex gap={token.paddingXXS}>
            {types.map((t) => (
              <TypeTag key={t} type={t} size="default" tooltip={false} />
            ))}
          </Flex>

          {/* Caught/Shiny toggle buttons */}
          <Flex gap={token.paddingSM}>
            {isCaught ? (
              <Popconfirm
                title={isShiny 
                  ? `Release shiny ${name}? This will also remove its shiny status.`
                  : `Release ${name}? Caught date will be lost.`
                }
                onConfirm={handleToggleCaught}
                okText="Release"
                cancelText="Cancel"
                getPopupContainer={() => document.body}
              >
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                >
                  Caught
                </Button>
              </Popconfirm>
            ) : (
              <Button
                type="default"
                onClick={handleToggleCaught}
              >
                Mark Caught
              </Button>
            )}
            {isCaught && (
              <Tooltip title={isShiny ? 'Remove shiny' : 'Mark as shiny'}>
                <Button
                  style={{
                    background: isShiny ? '#FFD700' : undefined,
                    borderColor: isShiny ? '#FFD700' : undefined,
                    color: isShiny ? '#000' : undefined,
                  }}
                  icon={<StarFilled />}
                  onClick={handleToggleShiny}
                >
                  {isShiny ? 'Shiny 🌟' : 'Shiny'}
                </Button>
              </Tooltip>
            )}
          </Flex>

          {/* Caught date */}
          {isCaught && (
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              {caughtTime ? `Caught on ${formatCaughtDate(caughtTime)}` : 'Caught (date unknown)'}
            </Text>
          )}

          {/* Serebii Link */}
          <Button
            type="text"
            icon={<LinkOutlined />}
            href={`https://www.serebii.net/pokedex-rs/${formattedNumber}.shtml`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Serebii
          </Button>
        </Flex>

        <Divider style={{ margin: 0 }} />

        {/* Evolution chain */}
        <Flex vertical gap={token.paddingXS}>
          <Text strong style={{ letterSpacing: 1, fontSize: token.fontSizeSM }}>
            EVOLUTION
          </Text>
          <EvolutionChain
            pokemonId={pokemonId}
            onSelectPokemon={handleSelectPokemon}
          />
        </Flex>

        <Divider style={{ margin: 0 }} />

        {/* Locations */}
        <Flex vertical gap={token.paddingXS}>
          <Text strong style={{ letterSpacing: 1, fontSize: token.fontSizeSM }}>
            LOCATIONS
          </Text>
          <LocationTable pokemonId={pokemonId} />
        </Flex>

        <Divider style={{ margin: 0 }} />

        {/* Base stats */}
        <Flex vertical gap={token.paddingXS}>
          <Text strong style={{ letterSpacing: 1, fontSize: token.fontSizeSM }}>
            BASE STATS
          </Text>
          <StatBars pokemonId={pokemonId} />
        </Flex>
      </Flex>
    </Drawer>
  );
}