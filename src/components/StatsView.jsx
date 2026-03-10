import { useMemo, memo } from 'react';
import { Flex, Typography, Progress, Statistic, Card, theme, Timeline, Tooltip } from 'antd';
import { KANTO, KANTO_MAP, getTypeIcon } from '../data/pokemon.js';
import { formatShortDate, KANTO_TOTAL } from '../utils/pokemon.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useBadgeStore } from '../stores/badgeStore.js';
import { EVOLUTIONS } from '../data/evolutions.js';

const { Text, Title } = Typography;

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'fairy',
];

// Special Pokemon groups
const STARTERS = {
  grass: [1, 2, 3],
  fire: [4, 5, 6],
  water: [7, 8, 9],
};

const LEGENDARIES = [144, 145, 146];
const MYTHICAL = [150, 151];
const FOSSILS = [138, 139, 140, 141, 142];

// Compact Type Progress Card
const TypeMiniCard = memo(function TypeMiniCard({ type, caught, total }) {
  const { token } = theme.useToken();
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;
  const isComplete = caught === total;

  return (
    <Tooltip title={`${type}: ${caught}/${total} (${pct}%)`}>
      <Flex
        align="center"
        gap={4}
        style={{
          padding: `${token.paddingXXS}px ${token.paddingXS}px`,
          borderRadius: token.borderRadiusSM,
          background: isComplete ? `${token.colorSuccess}15` : undefined,
          border: `1px solid ${isComplete ? `${token.colorSuccess}40` : token.colorBorder}`,
          minWidth: 65,
        }}
      >
        <span style={{ fontSize: 12 }}>{getTypeIcon(type)}</span>
        <Text style={{ fontSize: 11, textTransform: 'capitalize', color: isComplete ? token.colorSuccess : undefined }}>
          {caught}/{total}
        </Text>
        {isComplete && <Text style={{ fontSize: 10, color: token.colorSuccess }}>✓</Text>}
      </Flex>
    </Tooltip>
  );
});

// Type Breakdown Grid (compact)
const TypeBreakdownGrid = memo(function TypeBreakdownGrid({ typeStats }) {
  const { token } = theme.useToken();

  return (
    <Flex wrap="wrap" gap={token.paddingXXS}>
      {ALL_TYPES.map((type) => {
        const stat = typeStats.get(type);
        return <TypeMiniCard key={type} type={type} caught={stat.caught} total={stat.total} />;
      })}
    </Flex>
  );
});

// Type Coverage Grid
const TypeCoverageGrid = memo(function TypeCoverageGrid({ ownedTypes }) {
  const { token } = theme.useToken();

  return (
    <Flex wrap="wrap" gap={token.paddingXXS}>
      {ALL_TYPES.map((type) => {
        const owned = ownedTypes.has(type);
        return (
          <Flex
            key={type}
            align="center"
            gap={3}
            style={{
              padding: `${token.paddingXXS}px ${token.paddingXS}px`,
              borderRadius: token.borderRadiusSM,
              background: owned ? `${token.colorPrimary}15` : undefined,
              border: `1px solid ${owned ? `${token.colorPrimary}30` : token.colorBorder}`,
              opacity: owned ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: 11 }}>{getTypeIcon(type)}</span>
            <Text style={{ fontSize: 10, textTransform: 'capitalize', color: owned ? undefined : token.colorTextQuaternary }}>
              {type}
            </Text>
            {owned && <Text style={{ fontSize: 9, color: token.colorPrimary }}>✓</Text>}
          </Flex>
        );
      })}
    </Flex>
  );
});

// Evolution Stage Progress
const EvolutionProgress = memo(function EvolutionProgress({ caught }) {
  const { token } = theme.useToken();

  const stageStats = useMemo(() => {
    const stages = { base: { caught: 0, total: 0 }, stage1: { caught: 0, total: 0 }, stage2: { caught: 0, total: 0 } };
    
    EVOLUTIONS.forEach((evo) => {
      const chain = evo[0];
      if (typeof chain[0] === 'number') {
        if (chain.length >= 1) {
          stages.base.total++;
          if (caught.has(chain[0])) stages.base.caught++;
        }
        if (chain.length >= 2 && typeof chain[1] === 'number') {
          stages.stage1.total++;
          if (caught.has(chain[1])) stages.stage1.caught++;
        }
        if (chain.length >= 3 && typeof chain[2] === 'number') {
          stages.stage2.total++;
          if (caught.has(chain[2])) stages.stage2.caught++;
        }
      }
    });

    return stages;
  }, [caught]);

  return (
    <Flex gap={token.paddingMD}>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 10 }}>Base</Text>
        <Text strong style={{ fontSize: 12 }}>{stageStats.base.caught}/{stageStats.base.total}</Text>
      </Flex>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 10 }}>S1</Text>
        <Text strong style={{ fontSize: 12 }}>{stageStats.stage1.caught}/{stageStats.stage1.total}</Text>
      </Flex>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 10 }}>S2</Text>
        <Text strong style={{ fontSize: 12 }}>{stageStats.stage2.caught}/{stageStats.stage2.total}</Text>
      </Flex>
    </Flex>
  );
});

// Starter Progress
const StarterProgress = memo(function StarterProgress({ caught }) {
  const { token } = theme.useToken();

  const starterStats = useMemo(() => {
    const stats = {};
    Object.entries(STARTERS).forEach(([type, ids]) => {
      const caughtCount = ids.filter(id => caught.has(id)).length;
      stats[type] = { caught: caughtCount, total: ids.length };
    });
    return stats;
  }, [caught]);

  return (
    <Flex gap={token.paddingSM}>
      {Object.entries(starterStats).map(([type, stat]) => (
        <Flex key={type} align="center" gap={4}>
          <span style={{ fontSize: 12 }}>{getTypeIcon(type)}</span>
          <Text style={{ fontSize: 12 }}>{stat.caught}/{stat.total}</Text>
          {stat.caught === stat.total && <Text style={{ color: token.colorSuccess, fontSize: 10 }}>✓</Text>}
        </Flex>
      ))}
    </Flex>
  );
});

// Special Pokemon Progress
const SpecialProgress = memo(function SpecialProgress({ caught, title, ids }) {
  const { token } = theme.useToken();

  const stats = useMemo(() => {
    return { caught: ids.filter(id => caught.has(id)).length, total: ids.length };
  }, [caught, ids]);

  return (
    <Flex vertical gap={2}>
      <Flex align="center" justify="space-between">
        <Text type="secondary" style={{ fontSize: 10 }}>{title}</Text>
        <Text style={{ fontSize: 11 }}>{stats.caught}/{stats.total}</Text>
      </Flex>
      <Flex gap={2}>
        {ids.map((id) => {
          const isCaught = caught.has(id);
          const data = KANTO_MAP.get(id);
          return (
            <Tooltip key={id} title={data ? data[1] : `#${id}`}>
              <img
                src={`./sprites/${id}.png`}
                alt={data ? data[1] : `#${id}`}
                width={18}
                height={18}
                style={{
                  imageRendering: 'pixelated',
                  opacity: isCaught ? 1 : 0.25,
                  filter: isCaught ? 'none' : 'grayscale(100%)',
                }}
              />
            </Tooltip>
          );
        })}
      </Flex>
    </Flex>
  );
});

// Journey Stats
const JourneyStats = memo(function JourneyStats({ caught }) {
  const { token } = theme.useToken();

  const journeyData = useMemo(() => {
    const timestamps = [];
    caught.forEach((timestamp, id) => {
      if (timestamp !== null) timestamps.push({ id, timestamp });
    });

    if (timestamps.length === 0) {
      return { firstCatch: null, daysActive: 0, catchesPerDay: 0 };
    }

    timestamps.sort((a, b) => a.timestamp - b.timestamp);
    const firstTimestamp = timestamps[0].timestamp;
    const lastTimestamp = timestamps[timestamps.length - 1].timestamp;
    const daysActive = Math.max(1, Math.ceil((lastTimestamp - firstTimestamp) / (1000 * 60 * 60 * 24)) + 1);
    const catchesPerDay = (caught.size / daysActive).toFixed(1);

    return { firstCatch: timestamps[0], daysActive, catchesPerDay };
  }, [caught]);

  if (journeyData.firstCatch === null) {
    return <Text type="secondary" style={{ fontSize: 11, fontStyle: 'italic' }}>Start catching!</Text>;
  }

  const firstData = KANTO_MAP.get(journeyData.firstCatch.id);

  return (
    <Flex gap={token.paddingMD} wrap="wrap">
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 10 }}>First:</Text>
        {firstData && (
          <Flex align="center" gap={2}>
            <img src={`./sprites/${journeyData.firstCatch.id}.png`} alt={firstData[1]} width={14} height={14} style={{ imageRendering: 'pixelated' }} />
            <Text style={{ fontSize: 10 }}>{firstData[1]}</Text>
          </Flex>
        )}
      </Flex>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 10 }}>Days:</Text>
        <Text style={{ fontSize: 11 }}>{journeyData.daysActive}</Text>
      </Flex>
      <Flex align="center" gap={4}>
        <Text type="secondary" style={{ fontSize: 10 }}>Avg:</Text>
        <Text style={{ fontSize: 11 }}>{journeyData.catchesPerDay}/day</Text>
      </Flex>
    </Flex>
  );
});

// Catch Timeline
const CatchTimeline = memo(function CatchTimeline({ caught }) {
  const { token } = theme.useToken();

  const timelineItems = useMemo(() => {
    const entries = [];
    const migratedEntries = [];

    caught.forEach((timestamp, id) => {
      const data = KANTO_MAP.get(id);
      if (!data) return;

      if (timestamp === null) {
        migratedEntries.push({ id, name: data[1] });
      } else {
        entries.push({ id, name: data[1], timestamp });
      }
    });

    entries.sort((a, b) => b.timestamp - a.timestamp);
    return { entries, migratedEntries };
  }, [caught]);

  if (caught.size === 0) {
    return <Text type="secondary" style={{ fontStyle: 'italic', fontSize: 12 }}>No Pokémon caught yet!</Text>;
  }

  const timelineData = [
    ...timelineItems.entries.slice(0, 12).map((entry) => ({
      color: token.colorPrimary,
      content: (
        <Flex align="center" gap={token.paddingXS}>
          <img src={`./sprites/${entry.id}.png`} alt={entry.name} width={18} height={18} style={{ imageRendering: 'pixelated' }} />
          <Flex>
            <Text strong style={{ fontSize: 11 }}>{entry.name}</Text>
            <Text type="secondary" style={{ fontSize: 9, marginLeft: 4 }}>{formatShortDate(entry.timestamp)}</Text>
          </Flex>
        </Flex>
      ),
    })),
  ];

  if (timelineItems.migratedEntries.length > 0) {
    timelineData.push({
      color: token.colorTextQuaternary,
      content: (
        <Flex vertical gap={2}>
          <Text type="secondary" style={{ fontSize: 10 }}>Previous ({timelineItems.migratedEntries.length})</Text>
          <Flex wrap="wrap" gap={2}>
            {timelineItems.migratedEntries.slice(0, 10).map((entry) => (
              <Tooltip key={entry.id} title={entry.name}>
                <img src={`./sprites/${entry.id}.png`} alt={entry.name} width={16} height={16} style={{ imageRendering: 'pixelated' }} />
              </Tooltip>
            ))}
            {timelineItems.migratedEntries.length > 10 && (
              <Text type="secondary" style={{ fontSize: 9 }}>+{timelineItems.migratedEntries.length - 10}</Text>
            )}
          </Flex>
        </Flex>
      ),
    });
  }

  return <Timeline items={timelineData} />;
});

// Mini Stat Card
const MiniStatCard = memo(function MiniStatCard({ title, value, suffix, icon, color }) {
  const { token } = theme.useToken();

  return (
    <Card size="small" styles={{ body: { padding: `${token.paddingXXS}px ${token.paddingSM}px` } }}>
      <Flex align="center" gap={token.paddingXS}>
        {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
        <Flex vertical>
          <Text type="secondary" style={{ fontSize: 9, lineHeight: 1 }}>{title}</Text>
          <Text strong style={{ fontSize: 14, color }}>{value}{suffix}</Text>
        </Flex>
      </Flex>
    </Card>
  );
});

export default function StatsView() {
  const { token } = theme.useToken();

  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  const badges = useBadgeStore((s) => s.badges);

  const stats = useMemo(() => {
    const caughtCount = caught.size;
    const missingCount = KANTO_TOTAL - caughtCount;
    const shinyCount = shiny?.size || 0;
    const badgeCount = badges?.size || 0;
    const pct = Math.round((caughtCount / KANTO_TOTAL) * 100);

    const typeStats = new Map();
    ALL_TYPES.forEach((type) => typeStats.set(type, { caught: 0, total: 0 }));

    KANTO.forEach(([id, name, types]) => {
      types.forEach((type) => {
        const stat = typeStats.get(type);
        if (stat) {
          stat.total++;
          if (caught.has(id)) stat.caught++;
        }
      });
    });

    const ownedTypes = new Set();
    caught.forEach((_, id) => {
      const data = KANTO_MAP.get(id);
      if (data) data[2].forEach((type) => ownedTypes.add(type));
    });

    return { caughtCount, missingCount, shinyCount, badgeCount, pct, typeStats, ownedTypes };
  }, [caught, shiny, badges]);

  return (
    <Flex vertical gap={token.paddingMD} style={{ padding: token.paddingMD, overflowY: 'auto' }}>
      {/* Top Row: Quick Stats + Progress */}
      <Flex gap={token.paddingMD} wrap="wrap" align="center" justify="space-between">
        <Flex gap={token.paddingXS} wrap="wrap">
          <MiniStatCard title="Caught" value={stats.caughtCount} suffix={`/${KANTO_TOTAL}`} color={token.colorPrimary} />
          <MiniStatCard title="Missing" value={stats.missingCount} color={token.colorTextSecondary} />
          <MiniStatCard title="Shiny" value={stats.shinyCount} icon="🌟" color={token.colorShiny} />
          <MiniStatCard title="Badges" value={stats.badgeCount} suffix="/8" color={token.colorPrimary} />
        </Flex>
        <Flex align="center" gap={token.paddingSM}>
          <Progress type="circle" percent={stats.pct} size={60} format={(p) => <Text strong style={{ fontSize: 14 }}>{p}%</Text>} />
        </Flex>
      </Flex>

      {/* Recent Catches + Stats Row - 50/50 split */}
      <Flex gap={token.paddingMD} wrap>
        {/* Recent Catches - Max 50% width */}
        <Card 
          size="small" 
          title={<Text strong style={{ fontSize: 13 }}>Recent Catches</Text>} 
          styles={{ body: { padding: token.paddingSM, maxHeight: 200, overflowY: 'auto' } }}
          style={{ flex: '1 1 280px', maxWidth: '50%' }}
        >
          <CatchTimeline caught={caught} />
        </Card>

        {/* Stats Column - fills remaining space */}
        <Flex vertical gap={token.paddingSM} style={{ flex: '1 1 280px', minWidth: 280 }}>
          {/* Evolution Progress */}
          <Card size="small" title={<Text type="secondary" style={{ fontSize: 11 }}>Evolution Stages</Text>} styles={{ body: { padding: token.paddingXS } }}>
            <EvolutionProgress caught={caught} />
          </Card>

          {/* Starter Progress */}
          <Card size="small" title={<Text type="secondary" style={{ fontSize: 11 }}>Starter Lines</Text>} styles={{ body: { padding: token.paddingXS } }}>
            <StarterProgress caught={caught} />
          </Card>

          {/* Journey Stats */}
          <Card size="small" title={<Text type="secondary" style={{ fontSize: 11 }}>Journey</Text>} styles={{ body: { padding: token.paddingXS } }}>
            <JourneyStats caught={caught} />
          </Card>
        </Flex>
      </Flex>

      {/* Special Pokemon Row */}
      <Flex gap={token.paddingMD} wrap>
        <Card size="small" title={<Text type="secondary" style={{ fontSize: 11 }}>Legendaries</Text>} styles={{ body: { padding: token.paddingXS } }} style={{ flex: '1 1 150px' }}>
          <SpecialProgress caught={caught} title="Birds" ids={LEGENDARIES} />
        </Card>

        <Card size="small" title={<Text type="secondary" style={{ fontSize: 11 }}>Mythical</Text>} styles={{ body: { padding: token.paddingXS } }} style={{ flex: '1 1 150px' }}>
          <SpecialProgress caught={caught} title="Mewtwo & Mew" ids={MYTHICAL} />
        </Card>

        <Card size="small" title={<Text type="secondary" style={{ fontSize: 11 }}>Fossils</Text>} styles={{ body: { padding: token.paddingXS } }} style={{ flex: '1 1 150px' }}>
          <SpecialProgress caught={caught} title="Ancient" ids={FOSSILS} />
        </Card>
      </Flex>

      {/* Type Coverage */}
      <Card size="small" title={<Text strong style={{ fontSize: 13 }}>Type Coverage</Text>} styles={{ body: { padding: token.paddingXS } }}>
        <Text type="secondary" style={{ fontSize: 10 }}>{stats.ownedTypes.size} of {ALL_TYPES.length} types owned</Text>
        <div style={{ marginTop: token.paddingXXS }}>
          <TypeCoverageGrid ownedTypes={stats.ownedTypes} />
        </div>
      </Card>

      {/* Type Breakdown - Compact Grid */}
      <Card size="small" title={<Text strong style={{ fontSize: 13 }}>Type Breakdown</Text>} styles={{ body: { padding: token.paddingXS } }}>
        <TypeBreakdownGrid typeStats={stats.typeStats} />
      </Card>
    </Flex>
  );
}