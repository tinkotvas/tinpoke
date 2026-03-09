import { Typography, Flex, theme, Tooltip, Button, Space } from 'antd';
import { AppstoreOutlined, TrophyOutlined, EnvironmentOutlined, BarChartOutlined, ExpandOutlined, BulbOutlined } from '@ant-design/icons';
import { BADGES } from '../data/badges.js';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useBadgeStore } from '../stores/badgeStore.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import { useFilterStore } from '../stores/filterStore.js';
import SettingsModal from './SettingsModal.jsx';

const { Title, Text } = Typography;

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
  const theme_mode = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const filter = useFilterStore((s) => s.filter);
  const setFilter = useFilterStore((s) => s.setFilter);

  const caughtCount = caught?.size || 0;
  const pct = Math.round((caughtCount / total) * 100);
  const shinyCount = shiny?.size || 0;
  const badgeCount = badges?.size || 0;

  const tabOptions = [
    { label: 'Pokédex', value: 'pokedex', icon: <AppstoreOutlined /> },
    { label: 'Badges', value: 'badges', icon: <TrophyOutlined /> },
    { label: 'Routes', value: 'routes', icon: <EnvironmentOutlined /> },
    { label: 'Stats', value: 'stats', icon: <BarChartOutlined /> },
  ];

  return (
    <Flex
      align="center"
      gap={token.paddingMD}
      style={{
        background: `linear-gradient(180deg, ${token.colorPrimary}08 0%, transparent 100%)`,
        padding: `${token.paddingXS}px ${token.paddingMD}px`,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        minHeight: 44,
      }}
    >
      {/* Theater mode button */}
      <Tooltip title="Theater Mode">
        <Button
          type="text"
          icon={<ExpandOutlined />}
          onClick={onTheaterModeToggle}
          style={{
            color: token.colorTextSecondary,
            marginLeft: token.paddingXS,
          }}
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
              style={{ color: token.colorTextSecondary }}
            />
          ))}
        </Space>

        {/* Caught */}
        <Text
          strong
          style={{
            fontSize: token.fontSize,
            color: token.colorPrimary,
            whiteSpace: 'nowrap',
          }}
        >
          {caughtCount}/{total}
        </Text>

        {/* Shiny */}
        <Text
          style={{
            fontSize: token.fontSize,
            color: '#FFD700',
            whiteSpace: 'nowrap',
          }}
        >
          🌟 {shinyCount}
        </Text>

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
                    fontSize: 12,
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
        <Text
          type="secondary"
          style={{
            fontSize: token.fontSizeSM,
            whiteSpace: 'nowrap',
          }}
        >
          {pct}%
        </Text>

        {/* Settings */}
        <SettingsModal onImport={onImport} />
      </Flex>
    </Flex>
  );
}