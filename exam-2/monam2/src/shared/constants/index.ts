export const CAPACITY_FILTER_OPTIONS = [
  { value: "4", label: "4명 이상" },
  { value: "8", label: "8명 이상" },
  { value: "12", label: "12명 이상" },
  { value: "16", label: "16명 이상" },
] as const;

export const EQUIPMENT_FILTER_OPTIONS = [
  { value: "monitor", label: "모니터" },
  { value: "whiteboard", label: "화이트보드" },
  { value: "video_conference", label: "화상 회의" },
  { value: "projector", label: "프로젝터" },
] as const;
