import { useNavigate } from "react-router";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <EmptyState
      title="404"
      description="페이지를 찾을 수 없습니다."
      action={<Button onClick={() => navigate("/")}>타임라인으로 돌아가기</Button>}
    />
  );
}
