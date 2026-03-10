import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { App as AntApp, ConfigProvider, Flex, Modal, Typography, theme } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { KANTO } from './data/pokemon.js';
import { useCaughtStore } from './stores/caughtStore.js';
import { useBadgeStore } from './stores/badgeStore.js';
import { useSettingsStore } from './stores/settingsStore.js';
import { useFilterStore } from './stores/filterStore.js';
import { useMilestones } from './hooks/useMilestones.js';
import { useSound } from './hooks/useSound.js';
import { fireRedTheme, leafGreenTheme } from './themes/index.js';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import PokemonGrid from './components/PokemonGrid.jsx';
import PokemonDetail from './components/PokemonDetail.jsx';
import BadgeManager from './components/BadgeManager.jsx';
import Confetti from './components/Confetti.jsx';
import RouteChecklist from './components/RouteChecklist.jsx';
import RouteOverlay from './components/RouteOverlay.jsx';
import StatsView from './components/StatsView.jsx';
import SwitchView from './components/SwitchView.jsx';

const { Text, Title } = Typography;
const TOTAL = 151;

function TheaterModeExit({ onExit }) {
  const [isVisible, setIsVisible] = useState(false);
  const { token } = theme.useToken();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 100) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setIsVisible(true);
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        padding: token.paddingMD,
        zIndex: 2000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Flex
        align="center"
        justify="center"
        onClick={onExit}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          cursor: 'pointer',
        }}
      >
        ✕
      </Flex>
    </div>
  );
}

function AppContent() {
  const { token } = theme.useToken();
  
  // Stores - use useShallow for batched subscriptions
  const { caught, shiny, toggle, toggleShiny, getCaughtTime, importData } = 
    useCaughtStore(useShallow((s) => ({
      caught: s.caught,
      shiny: s.shiny,
      toggle: s.toggle,
      toggleShiny: s.toggleShiny,
      getCaughtTime: s.getCaughtTime,
      importData: s.importData,
    })));
  
  const { badges, toggleBadge, importBadges } = 
    useBadgeStore(useShallow((s) => ({
      badges: s.badges,
      toggleBadge: s.toggle,
      importBadges: s.importBadges,
    })));
  
  const { theme: theme_mode, toggleTheme, soundEnabled, setSoundEnabled } = 
    useSettingsStore(useShallow((s) => ({
      theme: s.theme,
      toggleTheme: s.toggleTheme,
      soundEnabled: s.soundEnabled,
      setSoundEnabled: s.setSoundEnabled,
    })));
  
  const { filter, setFilter, statusFilter, setStatusFilter, sortBy, setSortBy, selectedTypes, setSelectedTypes, showFilters, setShowFilters } = 
    useFilterStore(useShallow((s) => ({
      filter: s.filter,
      setFilter: s.setFilter,
      statusFilter: s.statusFilter,
      setStatusFilter: s.setStatusFilter,
      sortBy: s.sortBy,
      setSortBy: s.setSortBy,
      selectedTypes: s.selectedTypes,
      setSelectedTypes: s.setSelectedTypes,
      showFilters: s.showFilters,
      setShowFilters: s.setShowFilters,
    })));
  
  // Hooks
  const { showConfetti } = useMilestones(caught.size);
  const { playCatch, playUncatch, playShiny, playVictory } = useSound();
  
  // Local state
  const [search, setSearch] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const prevCaughtCountRef = useRef(caught.size);

  const handleSelectPokemon = useCallback((id) => {
    setSelectedPokemon(id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = KANTO.filter(([id, name]) => {
      if (statusFilter === 'caught' && !caught.has(id)) return false;
      if (statusFilter === 'missing' && caught.has(id)) return false;
      return name.toLowerCase().includes(q) || String(id).padStart(3, '0').includes(q);
    });

    if (selectedTypes.size > 0) {
      result = result.filter(([, , types]) => 
        types.some(t => selectedTypes.has(t))
      );
    }

    if (sortBy === 'name-asc') {
      result = result.slice().sort((a, b) => a[1].localeCompare(b[1]));
    } else if (sortBy === 'name-desc') {
      result = result.slice().sort((a, b) => b[1].localeCompare(a[1]));
    } else if (sortBy === 'caught-date') {
      result = result.slice().sort((a, b) => {
        const timeA = getCaughtTime(a[0]);
        const timeB = getCaughtTime(b[0]);
        if (timeA === null && timeB === null) return 0;
        if (timeA === null) return 1;
        if (timeB === null) return -1;
        return timeB - timeA;
      });
    }

    return result;
  }, [search, statusFilter, caught, selectedTypes, sortBy, getCaughtTime]);

  const currentTheme = theme_mode === 'dark' ? fireRedTheme : leafGreenTheme;

  const gridContainerRef = useRef(null);

  const handleFilterChange = (val) => {
    setFilter(val);
    setSearch('');
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollTop = 0;
    }
  };

  const handleImport = (importedData) => {
    importData(importedData.caught, importedData.shiny);
    importBadges(importedData.badges);
  };

  const handleToggleWithSound = useCallback((id) => {
    // Use getState() to read fresh state without subscribing to it
    const wasCaught = useCaughtStore.getState().caught.has(id);
    toggle(id);
    if (wasCaught) {
      playUncatch();
    } else {
      playCatch();
    }
  }, [toggle, playCatch, playUncatch]);

  const handleToggleShinyWithSound = useCallback((id) => {
    toggleShiny(id);
    playShiny();
  }, [toggleShiny, playShiny]);

  useEffect(() => {
    if (caught.size === TOTAL && prevCaughtCountRef.current < TOTAL) {
      playVictory();
    }
    prevCaughtCountRef.current = caught.size;
  }, [caught.size, playVictory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowHelpModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters = selectedTypes.size > 0 || sortBy !== 'dex';

  return (
    <ConfigProvider 
      theme={currentTheme}
      tooltip={{
        mouseLeaveDelay: 0,
      }}
    >
      <AntApp>
      <Flex
        vertical
        style={{ height: '100vh', width: '100%', overflow: 'hidden' }}
      >
        {!theaterMode && (
          <Header 
            caught={caught.size} 
            shiny={shiny} 
            total={TOTAL} 
            badges={badges} 
            onImport={handleImport} 
            caughtMap={caught}
            soundEnabled={soundEnabled}
            onSoundToggle={setSoundEnabled}
            filter={filter}
            onFilterChange={handleFilterChange}
            theaterMode={theaterMode}
            onTheaterModeToggle={() => setTheaterMode(true)}
            theme={theme_mode}
            onThemeToggle={toggleTheme}
          />
        )}

        {/* SwitchView - always visible as base layer */}
        <Flex vertical flex={1} style={{ overflow: 'hidden' }}>
          <SwitchView />
        </Flex>

        {/* Theater mode exit button */}
        {theaterMode && <TheaterModeExit onExit={() => setTheaterMode(false)} />}

        {/* Modal overlay for all non-switch tabs */}
        <Modal
          title={
            filter === 'pokedex' ? 'Pokédex' :
            filter === 'badges' ? 'Badges' :
            filter === 'routes' ? 'Routes' :
            filter === 'stats' ? 'Stats' : ''
          }
          open={filter !== 'switch' && !theaterMode}
          onCancel={() => setFilter('switch')}
          footer={null}
          width="90%"
          centered
          style={{ maxWidth: 1400 }}
          styles={{ body: { height: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' } }}
        >
          {filter === 'badges' && (
            <BadgeManager badges={badges} onToggle={toggleBadge} />
          )}

          {filter === 'routes' && (
            <RouteChecklist
              caught={caught}
              shiny={shiny}
              onSelectPokemon={handleSelectPokemon}
            />
          )}

          {filter === 'stats' && (
            <StatsView
              caught={caught}
              shiny={shiny}
              badges={badges}
              getCaughtTime={getCaughtTime}
            />
          )}

          {filter === 'pokedex' && (
            <Flex vertical style={{ height: 'calc(100% - 20px)' }}>
              <SearchBar 
                value={search} 
                onChange={setSearch} 
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(prev => !prev)}
                hasActiveFilters={hasActiveFilters}
              />

              {showFilters && (
                <FilterPanel
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  selectedTypes={selectedTypes}
                  onTypesChange={setSelectedTypes}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                />
              )}

              <div style={{ flex: 1, minHeight: 0 }}>
                <PokemonGrid 
                  pokemon={filtered} 
                  caught={caught} 
                  shiny={shiny}
                  onToggle={handleToggleWithSound} 
                  onToggleShiny={handleToggleShinyWithSound}
                  onSelect={handleSelectPokemon}
                />
              </div>
            </Flex>
          )}
        </Modal>

        <PokemonDetail
          pokemonId={selectedPokemon}
          onClose={handleCloseDetail}
          onSelect={handleSelectPokemon}
        />

        <Confetti show={showConfetti} />

        {/* Route overlay - visible when routes are selected */}
        <RouteOverlay onSelectPokemon={handleSelectPokemon} />

        <Modal
          title={<Title level={4} style={{ margin: 0 }}>Keyboard Shortcuts</Title>}
          open={showHelpModal}
          onCancel={() => setShowHelpModal(false)}
          footer={null}
          width={420}
        >
          <Flex vertical gap={token.paddingSM}>
            <Flex justify="space-between">
              <Text>Open this help</Text>
              <Text keyboard>?</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Catch / Release</Text>
              <Text keyboard>Shift + Click</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Toggle Shiny</Text>
              <Text keyboard>Shift + Click</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Navigate cards</Text>
              <Text keyboard>Tab</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Open details</Text>
              <Text keyboard>Enter</Text>
            </Flex>
          </Flex>
        </Modal>
      </Flex>
      </AntApp>
    </ConfigProvider>
  );
}

export default function App() {
  return <AppContent />;
}