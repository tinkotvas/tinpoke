import { memo } from 'react';
import { Select, Flex, Typography, theme } from 'antd';
import TypeFilter from './TypeFilter.jsx';

const { Text } = Typography;

const sortOptions = [
  { value: 'dex', label: 'Dex #' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'caught-date', label: 'Caught Date' },
];

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'caught', label: 'Caught' },
  { value: 'missing', label: 'Missing' },
];

const FilterPanel = memo(function FilterPanel({ 
  sortBy, 
  onSortChange, 
  selectedTypes, 
  onTypesChange,
  statusFilter,
  onStatusChange,
}) {
  const { token } = theme.useToken();

  return (
    <Flex vertical>
      <Flex
        align="center"
        gap={token.paddingSM}
        style={{
          padding: `${token.paddingXS}px ${token.paddingLG}px`,
        }}
      >
        <Text type="secondary">Show:</Text>
        <Select
          value={statusFilter}
          onChange={onStatusChange}
          options={statusOptions}
          style={{ minWidth: 100 }}
          popupMatchSelectWidth
        />
        <Text type="secondary" style={{ marginLeft: token.paddingSM }}>Sort:</Text>
        <Select
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          style={{ minWidth: 120 }}
          popupMatchSelectWidth
        />
      </Flex>
      <TypeFilter selectedTypes={selectedTypes} onTypesChange={onTypesChange} />
    </Flex>
  );
});

export default FilterPanel;
