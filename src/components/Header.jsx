import { Typography, Flex, theme, Tooltip, Button, Space } from 'antd';
import { AppstoreOutlined, TrophyOutlined, BarChartOutlined, ExpandOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { BADGES } from '../data/badges.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useBadgeStore } from '../stores/badgeStore.js';
import { useFilterStore } from '../stores/filterStore.js';
import SettingsModal from './SettingsModal.jsx';

const { Text } = Typography;

export default function Header({
  total = 151,
  onImport,
  theaterMode,
  onTheaterModeToggle,
}) {
  const { token } = theme.useToken();

  // Read from stores directly
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  const badges = useBadgeStore((s) => s.badges);
  const setFilter = useFilterStore((s) => s.setFilter);

  const caughtCount = caught?.size || 0;
  const pct = Math.round((caughtCount / total) * 100);
  const shinyCount = shiny?.size || 0;

  const tabOptions = [
    { label: 'Pokédex', value: 'pokedex', icon: <AppstoreOutlined /> },
    { label: 'Badges', value: 'badges', icon: <TrophyOutlined /> },
    { label: 'Routes', value: 'routes', icon: <NodeIndexOutlined />},
    { label: 'Stats', value: 'stats', icon: <BarChartOutlined /> },
  ];

  return (
    <Flex
      align="center"
      gap={token.paddingMD}
      style={{
        padding: `${token.paddingXS}px ${token.paddingMD}px`,
        minHeight: 44,
      }}
    >
      {/* Theater mode button */}
      <Tooltip title="Theater Mode">
        <Button
          type="text"
          icon={<ExpandOutlined />}
          onClick={onTheaterModeToggle}
        />
      </Tooltip>

      {/* Right: Stats strip */}
      <Flex align="center" gap={token.paddingSM} style={{ marginLeft: 'auto' }}>
        {/* Navigation Buttons */}
        <Space size="small">
          {tabOptions.map(tab => (
            <Button
              key={tab.value}
              type="text"
              icon={tab.icon}
              onClick={() => setFilter(tab.value)}
              title={tab.label}
            />
          ))}
        </Space>

        {/* Caught */}
        <Flex align="center" >
          <img src="./poke-ball.png" alt="" width={18} height={18} />
          <Text strong style={{ color: token.colorPrimary, whiteSpace: 'nowrap', marginLeft: 4 }}>
            {caughtCount}/{total}
          </Text>

        </Flex>
        {/* Shiny */}
        {shinyCount > 0 && <Text style={{ color: token.colorShiny, whiteSpace: 'nowrap' }}>
          🌟 {shinyCount}
        </Text>}

        {/* Badges inline */}
        <Flex gap={3} align="center">
          {BADGES.map((badge) => {
            const earned = badges?.has(badge.id);
            return (
              <Tooltip
                key={badge.id}
                title={`${badge.name} Badge${earned ? ' ✓' : ''} - ${badge.leader}`}
              >
                <span
                  className={`badge-icon ${earned ? 'earned' : 'unearned'}`}
                  style={{
                    fontSize: token.fontSizeSM,
                    lineHeight: 1,
                    cursor: 'default',
                  }}
                >
                  {badge.icon}
                </span>
              </Tooltip>
            );
          })}
        </Flex>

        {/* Percentage */}
        <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
          {pct}%
        </Text>

        {/* Settings */}
        <SettingsModal onImport={onImport} />
      </Flex>
    </Flex>
  );
}
