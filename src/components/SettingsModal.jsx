import { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Upload, Typography, Flex, theme, message, Divider, Switch } from 'antd';
import { SettingOutlined, DownloadOutlined, UploadOutlined, SoundOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useCaughtStore } from '../stores/caughtStore.js';
import { useBadgeStore } from '../stores/badgeStore.js';
import { useSettingsStore } from '../stores/settingsStore.js';

const { Text, Title } = Typography;

const EXPORT_VERSION = 1;

export default function SettingsModal({ onImport }) {
  const { token } = theme.useToken();
  
  // Read from stores directly
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);
  const badges = useBadgeStore((s) => s.badges);
  const theme_mode = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  
  const [open, setOpen] = useState(false);
  const [importData, setImportData] = useState(null);
  const [showImportPreview, setShowImportPreview] = useState(false);

  const exportData = useMemo(() => {
    const now = new Date();
    const exportDate = now.toISOString();

    return {
      version: EXPORT_VERSION,
      exportDate,
      caught: [...caught],
      shiny: [...shiny],
      badges: [...badges],
    };
  }, [caught, shiny, badges]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pokedex-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('Progress exported successfully!');
  }, [exportData]);

  const parseImportData = useCallback((data) => {
    if (!data || typeof data !== 'object') return null;

    const result = {
      caught: new Map(),
      shiny: new Set(),
      badges: new Set(),
    };

    if (Array.isArray(data.caught)) {
      if (data.caught.length > 0 && typeof data.caught[0] === 'number') {
        result.caught = new Map(data.caught.map(id => [id, null]));
      } else if (data.caught.length > 0 && Array.isArray(data.caught[0])) {
        result.caught = new Map(data.caught);
      }
    }

    if (Array.isArray(data.shiny)) {
      result.shiny = new Set(data.shiny);
    }

    if (Array.isArray(data.badges)) {
      result.badges = new Set(data.badges);
    }

    return result;
  }, []);

  const beforeUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const parsed = parseImportData(data);
        if (!parsed) {
          message.error('Invalid backup file format');
          return;
        }
        setImportData(parsed);
        setShowImportPreview(true);
      } catch {
        message.error('Failed to parse backup file');
      }
    };
    reader.readAsText(file);
    return false;
  }, [parseImportData]);

  const handleConfirmImport = useCallback(() => {
    if (importData) {
      onImport(importData);
      setShowImportPreview(false);
      setImportData(null);
      setOpen(false);
      message.success('Progress imported successfully!');
    }
  }, [importData, onImport]);

  const handleCancelImport = useCallback(() => {
    setShowImportPreview(false);
    setImportData(null);
  }, []);

  const importPreview = useMemo(() => {
    if (!importData) return null;

    const caughtCount = importData.caught.size;
    const shinyCount = importData.shiny.size;
    const badgeCount = importData.badges.size;

    const newCaught = caughtCount - caught.size;
    const newShiny = shinyCount - shiny.size;
    const newBadges = badgeCount - badges.size;

    return {
      caughtCount,
      shinyCount,
      badgeCount,
      newCaught: Math.max(0, newCaught),
      newShiny: Math.max(0, newShiny),
      newBadges: Math.max(0, newBadges),
    };
  }, [importData, caught, shiny, badges]);

  return (
    <>
      <Button
        type="text"
        icon={<SettingOutlined />}
        onClick={() => setOpen(true)}
        title="Settings"
      />

      <Modal
        title={
          <Flex align="center" gap={token.paddingXS}>
            <SettingOutlined />
            <span>Settings</span>
          </Flex>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setShowImportPreview(false);
          setImportData(null);
        }}
        footer={null}
        width={560}
      >
        {showImportPreview && importPreview ? (
          <Flex vertical gap={token.paddingMD}>
            <Flex vertical gap={token.paddingXS}>
              <Text>Import will add:</Text>
              <Flex vertical style={{ padding: token.paddingSM }}>
                <Text>• <strong>{importPreview.newCaught}</strong> new caught Pokemon</Text>
                <Text>• <strong>{importPreview.newShiny}</strong> new shiny marks</Text>
                <Text>• <strong>{importPreview.newBadges}</strong> new badges</Text>
              </Flex>
              <Text type="secondary">
                This will merge with your current progress and overwrite existing entries.
              </Text>
            </Flex>
            <Flex gap={token.paddingSM} justify="flex-end">
              <Button onClick={handleCancelImport}>Cancel</Button>
              <Button type="primary" onClick={handleConfirmImport}>
                Import
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex vertical gap={token.paddingLG}>
            <Flex gap={token.paddingMD}>
              <Flex vertical gap={token.paddingMD} style={{ flex: 1 }}>
                <Flex vertical gap={token.paddingXS}>
                  <Title level={5} style={{ margin: 0 }}>Theme</Title>
                  <Text type="secondary">
                    Switch between light and dark mode.
                  </Text>
                </Flex>
                <Flex align="center" gap={token.paddingSM}>
                  {theme_mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                  <Switch 
                    checked={theme_mode === 'dark'} 
                    onChange={toggleTheme}
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                  />
                </Flex>
              </Flex>

              <Flex vertical gap={token.paddingMD} style={{ flex: 1 }}>
                <Flex vertical gap={token.paddingXS}>
                  <Title level={5} style={{ margin: 0 }}>Sound Effects</Title>
                  <Text type="secondary">
                    Enable sound effects when catching Pokemon.
                  </Text>
                </Flex>
                <Flex align="center" gap={token.paddingSM}>
                  <SoundOutlined />
                  <Switch 
                    checked={soundEnabled} 
                    onChange={setSoundEnabled}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                  />
                </Flex>
              </Flex>
            </Flex>

            <Divider style={{ margin: 0 }} />

            <Flex gap={token.paddingMD}>
              <Flex vertical gap={token.paddingMD} style={{ flex: 1 }}>
                <Flex vertical gap={token.paddingXS}>
                  <Title level={5} style={{ margin: 0 }}>Export Progress</Title>
                  <Text type="secondary">
                    Download a backup of your caught Pokemon, shiny marks, and badges.
                  </Text>
                </Flex>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  block
                >
                  Export to JSON
                </Button>
              </Flex>

              <Flex vertical gap={token.paddingMD} style={{ flex: 1 }}>
                <Flex vertical gap={token.paddingXS}>
                  <Title level={5} style={{ margin: 0 }}>Import Progress</Title>
                  <Text type="secondary">
                    Restore a previous backup. This will merge with your current progress.
                  </Text>
                </Flex>
                <Upload
                  accept=".json"
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />} block>
                    Import from JSON
                  </Button>
                </Upload>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Modal>
    </>
  );
}
