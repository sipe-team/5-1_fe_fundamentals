import { css } from "@emotion/react";

import useTimelineFilters from "@/domains/timeline/hooks/useTimelineFilters";

import {
  CAPACITY_FILTER_OPTIONS,
  EQUIPMENT_FILTER_OPTIONS,
} from "@/shared/constants";
import { Flex } from "@/shared/components";
import { Button, Checkbox, Select } from "@/shared/ui";

export default function TimelineFilter() {
  const { clearFilters, isActiveFilter } = useTimelineFilters();

  return (
    <section
      css={css({
        display: "grid",
        gap: "20px",
        marginTop: "24px",
        padding: "20px",
        borderBottom: "1px solid #e5e7eb",
      })}
    >
      <Flex gap={40} align="center" justify="center">
        <CapacitySelect />
        <EquipmentCheckBox />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={clearFilters}
          disabled={!isActiveFilter}
        >
          초기화
        </Button>
      </Flex>
    </section>
  );
}

function CapacitySelect() {
  const { filters, updateCapacity } = useTimelineFilters();

  return (
    <Select
      label="수용 인원"
      value={filters.capacity?.toString() ?? ""}
      options={CAPACITY_FILTER_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
      placeholder="전체 회의실"
      onChange={(event) => updateCapacity(event.target.value)}
    />
  );
}

function EquipmentCheckBox() {
  const { filters, toggleEquipment } = useTimelineFilters();

  return (
    <div
      css={css({
        display: "grid",
        gap: "10px",
        alignContent: "start",
      })}
    >
      <span css={eqLabelStyle}>장비</span>
      <div
        css={css({
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 16px",
        })}
      >
        {EQUIPMENT_FILTER_OPTIONS.map(({ value, label }) => (
          <Checkbox
            key={value}
            label={label}
            checked={filters.equipment.includes(value)}
            onChange={() => toggleEquipment(value)}
          />
        ))}
      </div>
    </div>
  );
}

const eqLabelStyle = css({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#374151",
  textAlign: "left",
});
