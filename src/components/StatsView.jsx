import { useMemo, memo } from 'react';
import { Flex, Typography, Progress, Statistic, Card, theme, Timeline, Tooltip } from 'antd';
import { KANTO, KANTO_MAP, getTypeIcon } from '../data/pokemon.js';
import { formatShortDate, KANTO_TOTAL } from '../utils/pokemon.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useBadgeStore } from '../stores/badgeStore.js';

const { Text, Title } = Typography;

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'fairy',
];

const TypeProgress = memo(function TypeProgress({ type, caught, total }) {
  const { token } = theme.useToken();
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;

  return (
    <Flex align="center" gap={token.paddingSM}>
      <Flex align="center" gap={token.paddingXXS} style={{ minWidth: 100 }}>
        <span>{getTypeIcon(type)}</span>
        <Text type="secondary" style={{ textTransform: 'capitalize' }}>
          {type}
        </Text>
      </Flex>
      <Progress
        percent={pct}
        format={() => <Text>{caught}/{total}</Text>}
        size="small"
        style={{ flex: 1, minWidth: 80 }}
      />
    </Flex>
  );
});

const TypeCoverageGrid = memo(function TypeCoverageGrid({ ownedTypes }) {
  const { token } = theme.useToken();

  return (
    <Flex wrap="wrap" gap={token.paddingXS}>
      {ALL_TYPES.map((type) => {
        const owned = ownedTypes.has(type);
        return (
          <Flex
            key={type}
            align="center"
            gap={4}
            style={{
              padding: `${token.paddingXXS}px ${token.paddingXS}px`,
              borderRadius: token.borderRadiusSM,
              background: owned ? `${token.colorPrimary}15` : undefined,
              border: `1px solid ${owned ? `${token.colorPrimary}30` : token.colorBorder}`,
              opacity: owned ? 1 : 0.5,
            }}
          >
            <span>{getTypeIcon(type)}</span>
            <Text style={{ textTransform: 'capitalize', color: owned ? undefined : token.colorTextQuaternary }}>
              {type}
            </Text>
            {owned && <Text style={{ color: token.colorPrimary }}>✓</Text>}
          </Flex>
        );
      })}
    </Flex>
  );
});

const CatchTimeline = memo(function CatchTimeline({ caught, getCaughtTime }) {
  const { token } = theme.useToken();

  const timelineItems = useMemo(() => {
    const entries = [];
    const migratedEntries = [];

    caught.forEach((timestamp, id) => {
      const data = KANTO_MAP.get(id);
      if (!data) return;

      const entry = {
        id,
        name: data[1],
        timestamp,
      };

      if (timestamp === null) {
        migratedEntries.push(entry);
      } else {
        entries.push(entry);
      }
    });

    // Sort by timestamp descending (most recent first)
    entries.sort((a, b) => b.timestamp - a.timestamp);

    return { entries, migratedEntries };
  }, [caught]);

  if (caught.size === 0) {
    return <Text type="secondary" style={{ fontStyle: 'italic' }}>No Pokémon caught yet. Start your journey!</Text>;
  }

  const timelineData = [
    ...timelineItems.entries.slice(0, 20).map((entry) => ({
      color: token.colorPrimary,
      content: (
        <Flex align="center" gap={token.paddingSM}>
          <img
            src={`./sprites/${entry.id}.png`}
            alt={entry.name}
            width={24}
            height={24}
            style={{ imageRendering: 'pixelated' }}
          />
          <Flex vertical>
            <Text strong>{entry.name}</Text>
            <Text type="secondary">{formatShortDate(entry.timestamp)}</Text>
          </Flex>
        </Flex>
      ),
    })),
  ];

  if (timelineItems.migratedEntries.length > 0) {
    timelineData.push({
      color: token.colorTextQuaternary,
      content: (
        <Flex vertical gap={token.paddingXXS}>
          <Text type="secondary">Previously caught ({timelineItems.migratedEntries.length})</Text>
          <Flex wrap="wrap" gap={token.paddingXXS}>
            {timelineItems.migratedEntries.slice(0, 15).map((entry) => (
              <Tooltip key={entry.id} title={entry.name}>
                <img
                  src={`./sprites/${entry.id}.png`}
                  alt={entry.name}
                  width={20}
                  height={20}
                  style={{ imageRendering: 'pixelated' }}
                />
              </Tooltip>
            ))}
            {timelineItems.migratedEntries.length > 15 && (
              <Text type="secondary">+{timelineItems.migratedEntries.length - 15} more</Text>
            )}
          </Flex>
        </Flex>
      ),
    });
  }

  return <Timeline items={timelineData} />;
});

const StatCard = memo(function StatCard({ title, value, suffix, prefix, valueStyle }) {
  const { token } = theme.useToken();

  return (
    <Card size="small" styles={{ body: { padding: token.paddingSM } }}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={prefix}
        styles={{ content: valueStyle }}
      />
    </Card>
  );
});

export default function StatsView() {
  const { token } = theme.useToken();

  // Read from stores directly
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  const getCaughtTime = useCaughtStore((s) => s.getCaughtTime);
  const badges = useBadgeStore((s) => s.badges);

  const stats = useMemo(() => {
    const caughtCount = caught.size;
    const missingCount = KANTO_TOTAL - caughtCount;
    const shinyCount = shiny?.size || 0;
    const badgeCount = badges?.size || 0;
    const pct = Math.round((caughtCount / KANTO_TOTAL) * 100);

    // Type breakdown
    const typeStats = new Map();
    ALL_TYPES.forEach((type) => {
      typeStats.set(type, { caught: 0, total: 0 });
    });

    KANTO.forEach(([id, name, types]) => {
      types.forEach((type) => {
        const stat = typeStats.get(type);
        if (stat) {
          stat.total++;
          if (caught.has(id)) {
            stat.caught++;
          }
        }
      });
    });

    // Owned types
    const ownedTypes = new Set();
    caught.forEach((_, id) => {
      const data = KANTO_MAP.get(id);
      if (data) {
        data[2].forEach((type) => ownedTypes.add(type));
      }
    });

    return { caughtCount, missingCount, shinyCount, badgeCount, pct, typeStats, ownedTypes };
  }, [caught, shiny, badges]);

  return (
    <Flex vertical gap={token.paddingLG} style={{ padding: token.paddingMD, overflowY: 'auto' }}>
      {/* Top Row: Quick Stats */}
      <Flex gap={token.paddingMD} wrap="wrap" justify="space-between">
        <Flex gap={token.paddingSM}>
          <StatCard title="Caught" value={stats.caughtCount} suffix={`/ ${KANTO_TOTAL}`} valueStyle={{ color: token.colorPrimary }} />
          <StatCard title="Missing" value={stats.missingCount} valueStyle={{ color: token.colorTextSecondary }} />
          <StatCard title="Shiny" value={stats.shinyCount} prefix="🌟" valueStyle={{ color: token.colorShiny }} />
          <StatCard title="Badges" value={stats.badgeCount} suffix="/ 8" valueStyle={{ color: token.colorPrimary }} />
        </Flex>

        {/* Inline completion percentage */}
        <Flex align="center" gap={token.paddingLG}>
          <Progress type="circle" percent={stats.pct} size={80} />
          <Flex vertical>
            <Text strong style={{ color: token.colorPrimary }}>{stats.pct}%</Text>
            <Text type="secondary">Complete</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Main Content: 2 Column Layout */}
      <Flex gap={token.paddingLG} style={{ minHeight: 0 }}>
        {/* Left Column: Type Coverage + Recent Catches */}
        <Flex vertical gap={token.paddingLG} style={{ flex: '0 0 400px' }}>
          <Flex vertical gap={token.paddingSM}>
            <Title level={5} style={{ margin: 0 }}>Type Coverage</Title>
            <Text type="secondary">{stats.ownedTypes.size} of {ALL_TYPES.length} types owned</Text>
            <TypeCoverageGrid ownedTypes={stats.ownedTypes} />
          </Flex>

          <Flex vertical gap={token.paddingSM} style={{ flex: 1, minHeight: 0 }}>
            <Title level={5} style={{ margin: 0 }}>Recent Catches</Title>
            <div style={{ overflowY: 'auto' }}>
              <CatchTimeline caught={caught} getCaughtTime={getCaughtTime} />
            </div>
          </Flex>
        </Flex>

        {/* Right Column: Type Breakdown in 2 columns */}
        <Flex vertical gap={token.paddingSM} style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0 }}>Type Breakdown</Title>
          <Text type="secondary">Pokémon caught by type</Text>
          <Flex gap={token.paddingMD}>
            <Flex vertical gap={token.paddingXS} style={{ flex: 1 }}>
              {ALL_TYPES.slice(0, 9).map((type) => {
                const stat = stats.typeStats.get(type);
                return <TypeProgress key={type} type={type} caught={stat.caught} total={stat.total} />;
              })}
            </Flex>
            <Flex vertical gap={token.paddingXS} style={{ flex: 1 }}>
              {ALL_TYPES.slice(9).map((type) => {
                const stat = stats.typeStats.get(type);
                return <TypeProgress key={type} type={type} caught={stat.caught} total={stat.total} />;
              })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
