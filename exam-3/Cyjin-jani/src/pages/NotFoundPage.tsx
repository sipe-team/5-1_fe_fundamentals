import { Link } from 'wouter';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      <p className="text-base font-medium text-foreground">
        페이지를 찾을 수 없어요.
      </p>
      <p className="text-sm text-muted-foreground">
        주소가 잘못됐거나 삭제된 페이지일 수 있어요.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        메뉴판으로 가기
      </Link>
    </div>
  );
}
