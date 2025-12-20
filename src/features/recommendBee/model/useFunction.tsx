/* 추천 결과 페이지 전용 컴포넌트 모음
   - Section: 아이콘 + 제목 + 리스트 형태의 섹션 UI
   - ProductsSection: 추천된 상품 목록 로딩/빈 상태/리스트 렌더링
*/



export function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="card-title ">{title}</h4>
      </div>
      <ul className=" list-disc card-content ">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}


