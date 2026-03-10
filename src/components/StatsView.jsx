import { useMemo, memo } from 'react';
import { Flex, Typography, Progress, Statistic, Card, theme, Timeline, Tooltip, Tag, Row, Col } from 'antd';
import { KANTO, KANTO_MAP, getTypeIcon, TYPES } from '../data/pokemon.js';
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

// Type Tag with progress
const TypeTag = memo(function TypeTag({ type, caught, total }) {
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;
  const isComplete = caught === total;

  return (
    <Tooltip title={`${type}: ${caught}/${total} (${pct}%)`}>
      <Tag
        color={isComplete ? 'success' : TYPES[type]}
        variant={isComplete ? 'solid' : 'outlined'}
        style={{ 
          margin: 0,
          opacity: caught > 0 ? 1 : 0.4,
        }}
      >
        <span>{getTypeIcon(type)}</span>
        <Text style={{ marginLeft: 6, color: 'inherit' }}>
          {caught}/{total}
        </Text>
        {isComplete && <Text style={{ marginLeft: 6 }}>✓</Text>}
      </Tag>
    </Tooltip>
  );
});

// Type Breakdown Grid using Tags
const TypeBreakdownGrid = memo(function TypeBreakdownGrid({ typeStats }) {
  return (
    <Flex wrap="wrap" gap="small">
      {ALL_TYPES.map((type) => {
        const stat = typeStats.get(type);
        return <TypeTag key={type} type={type} caught={stat.caught} total={stat.total} />;
      })}
    </Flex>
  );
});

// Type Coverage Grid using Tags
const TypeCoverageGrid = memo(function TypeCoverageGrid({ ownedTypes }) {
  return (
    <Flex wrap="wrap" gap="small">
      {ALL_TYPES.map((type) => {
        const owned = ownedTypes.has(type);
        return (
          <Tag
            key={type}
            color={owned ? TYPES[type] : 'default'}
            variant={owned ? 'filled' : 'outlined'}
            style={{ 
              opacity: owned ? 1 : 0.35,
            }}
          >
            <span>{getTypeIcon(type)}</span>
            <Text style={{ marginLeft: 6, textTransform: 'capitalize', color: 'inherit' }}>
              {type}
            </Text>
            {owned && <Text style={{ marginLeft: 6 }}>✓</Text>}
          </Tag>
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
    <Flex gap={token.paddingLG}>
      <Flex align="center" gap="small">
        <Text type="secondary">Base</Text>
        <Text strong>{stageStats.base.caught}/{stageStats.base.total}</Text>
      </Flex>
      <Flex align="center" gap="small">
        <Text type="secondary">Stage 1</Text>
        <Text strong>{stageStats.stage1.caught}/{stageStats.stage1.total}</Text>
      </Flex>
      <Flex align="center" gap="small">
        <Text type="secondary">Stage 2</Text>
        <Text strong>{stageStats.stage2.caught}/{stageStats.stage2.total}</Text>
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
    <Flex gap={token.paddingLG}>
      {Object.entries(starterStats).map(([type, stat]) => (
        <Flex key={type} align="center" gap="small">
          <span>{getTypeIcon(type)}</span>
          <Text>{stat.caught}/{stat.total}</Text>
          {stat.caught === stat.total && <Text style={{ color: token.colorSuccess }}>✓</Text>}
        </Flex>
      ))}
    </Flex>
  );
});

// Special Pokemon Progress
const SpecialProgress = memo(function SpecialProgress({ caught, title, ids }) {
  const stats = useMemo(() => {
    return { caught: ids.filter(id => caught.has(id)).length, total: ids.length };
  }, [caught, ids]);

  return (
    <Flex vertical gap="small">
      <Flex align="center" justify="space-between">
        <Text type="secondary">{title}</Text>
        <Text>{stats.caught}/{stats.total}</Text>
      </Flex>
      <Flex gap="small">
        {ids.map((id) => {
          const isCaught = caught.has(id);
          const data = KANTO_MAP.get(id);
          return (
            <Tooltip key={id} title={data ? data[1] : `#${id}`}>
              <img
                src={`./sprites/${id}.png`}
                alt={data ? data[1] : `#${id}`}
                width={32}
                height={32}
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
    return <Text type="secondary" italic>Start catching!</Text>;
  }

  const firstData = KANTO_MAP.get(journeyData.firstCatch.id);

  return (
    <Flex gap={token.paddingLG} wrap="wrap">
      <Flex align="center" gap="small">
        <Text type="secondary">First:</Text>
        {firstData && (
          <Flex align="center" gap="small">
            <img src={`./sprites/${journeyData.firstCatch.id}.png`} alt={firstData[1]} width={24} height={24} style={{ imageRendering: 'pixelated' }} />
            <Text>{firstData[1]}</Text>
          </Flex>
        )}
      </Flex>
      <Flex align="center" gap="small">
        <Text type="secondary">Days:</Text>
        <Text>{journeyData.daysActive}</Text>
      </Flex>
      <Flex align="center" gap="small">
        <Text type="secondary">Avg:</Text>
        <Text>{journeyData.catchesPerDay}/day</Text>
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
    return <Text type="secondary" italic>No Pokémon caught yet!</Text>;
  }

  const timelineData = [
    ...timelineItems.entries.slice(0, 12).map((entry) => ({
      color: token.colorPrimary,
      title: formatShortDate(entry.timestamp),
      content: (
        <Flex align="center" gap="small">
          <img src={`./sprites/${entry.id}.png`} alt={entry.name} width={24} height={24} style={{ imageRendering: 'pixelated' }} />
          <Text strong>{entry.name}</Text>
        </Flex>
      ),
    })),
  ];

  if (timelineItems.migratedEntries.length > 0) {
    timelineData.push({
      color: token.colorTextQuaternary,
      content: (
        <Flex vertical gap="small">
          <Text type="secondary">Previous ({timelineItems.migratedEntries.length})</Text>
          <Flex wrap="wrap" gap="small">
            {timelineItems.migratedEntries.slice(0, 10).map((entry) => (
              <Tooltip key={entry.id} title={entry.name}>
                <img src={`./sprites/${entry.id}.png`} alt={entry.name} width={24} height={24} style={{ imageRendering: 'pixelated' }} />
              </Tooltip>
            ))}
            {timelineItems.migratedEntries.length > 10 && (
              <Text type="secondary">+{timelineItems.migratedEntries.length - 10}</Text>
            )}
          </Flex>
        </Flex>
      ),
    });
  }

  return <Timeline items={timelineData} />;
});

// Stat Card using Ant Design Statistic
const StatCard = memo(function StatCard({ title, value, suffix, prefix, valueStyle }) {
  const { token } = theme.useToken();

  return (
    <Card 
      variant="borderless"
      styles={{ 
        body: { padding: token.paddingSM },
      }}
    >
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={prefix}
        valueStyle={valueStyle}
      />
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

  // Gradient colors for progress
  const progressGradient = {
    '0%': token.colorPrimary,
    '100%': token.colorSuccess,
  };

  return (
    <Flex vertical gap={token.paddingLG} style={{ padding: token.paddingLG, overflowY: 'auto' }}>
      {/* Top Row: Quick Stats + Progress */}
      <Row gutter={[token.paddingLG, token.paddingLG]} align="middle">
        <Col xs={24} sm={16} md={18}>
          <Flex gap="small" wrap="wrap">
            <StatCard 
              title="Caught" 
              value={stats.caughtCount} 
              suffix={`/ ${KANTO_TOTAL}`}
              valueStyle={{ color: token.colorPrimary }}
            />
            <StatCard 
              title="Missing" 
              value={stats.missingCount}
              valueStyle={{ color: token.colorTextSecondary }}
            />
            <StatCard 
              title="Shiny" 
              value={stats.shinyCount}
              prefix={<span>🌟</span>}
              valueStyle={{ color: token.colorShiny }}
            />
            <StatCard 
              title="Badges" 
              value={stats.badgeCount}
              suffix="/ 8"
              valueStyle={{ color: token.colorPrimary }}
            />
          </Flex>
        </Col>
        <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
          <Progress 
            type="dashboard" 
            percent={stats.pct} 
            size={120}
            strokeColor={progressGradient}
            format={(p) => (
              <Flex vertical align="center">
                <Text strong style={{ fontSize: token.fontSizeLG }}>{p}%</Text>
                <Text type="secondary">Complete</Text>
              </Flex>
            )}
          />
        </Col>
      </Row>

      {/* Recent Catches + Stats Row */}
      <Row gutter={[token.paddingLG, token.paddingLG]}>
        {/* Recent Catches */}
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Recent Catches</Title>}
            styles={{ body: { padding: token.padding, maxHeight: 280, overflowY: 'auto' } }}
          >
            <CatchTimeline caught={caught} />
          </Card>
        </Col>

        {/* Stats Column */}
        <Col xs={24} md={12}>
          <Flex vertical gap={token.padding}>
            {/* Evolution Progress */}
            <Card title={<Text type="secondary">Evolution Stages</Text>} styles={{ body: { padding: token.paddingSM } }}>
              <EvolutionProgress caught={caught} />
            </Card>

            {/* Starter Progress */}
            <Card title={<Text type="secondary">Starter Lines</Text>} styles={{ body: { padding: token.paddingSM } }}>
              <StarterProgress caught={caught} />
            </Card>

            {/* Journey Stats */}
            <Card title={<Text type="secondary">Journey</Text>} styles={{ body: { padding: token.paddingSM } }}>
              <JourneyStats caught={caught} />
            </Card>
          </Flex>
        </Col>
      </Row>

      {/* Special Pokemon Row */}
      <Row gutter={[token.paddingLG, token.paddingLG]}>
        <Col xs={24} sm={8}>
          <Card title={<Text type="secondary">Legendaries</Text>} styles={{ body: { padding: token.paddingSM } }}>
            <SpecialProgress caught={caught} title="Birds" ids={LEGENDARIES} />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card title={<Text type="secondary">Mythical</Text>} styles={{ body: { padding: token.paddingSM } }}>
            <SpecialProgress caught={caught} title="Mewtwo & Mew" ids={MYTHICAL} />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card title={<Text type="secondary">Fossils</Text>} styles={{ body: { padding: token.paddingSM } }}>
            <SpecialProgress caught={caught} title="Ancient" ids={FOSSILS} />
          </Card>
        </Col>
      </Row>

      {/* Type Coverage */}
      <Card title={<Title level={5} style={{ margin: 0 }}>Type Coverage</Title>} styles={{ body: { padding: token.paddingSM } }}>
        <Text type="secondary">{stats.ownedTypes.size} of {ALL_TYPES.length} types owned</Text>
        <div style={{ marginTop: token.paddingXS }}>
          <TypeCoverageGrid ownedTypes={stats.ownedTypes} />
        </div>
      </Card>

      {/* Type Breakdown */}
      <Card title={<Title level={5} style={{ margin: 0 }}>Type Breakdown</Title>} styles={{ body: { padding: token.paddingSM } }}>
        <TypeBreakdownGrid typeStats={stats.typeStats} />
      </Card>
    </Flex>
  );
}