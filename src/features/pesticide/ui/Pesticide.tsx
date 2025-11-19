"use client";

import { useCallback, useEffect, useState } from "react";

type SelectOption = { code: string; codeNm: string };
type ResultItem = {
  agchmApplcNo: string;
  prdlstNm: string;
  engPrdlstNm: string;
  brandNm: string;
  contInfo: string;
  prpos: string;
  applcsicknsHlsctsickns: string;
  safeRdmtrTime: string;
  sprngspcsNm: string;
  cropsNm: string;
  registDt: string;
};

const parseXMLtoOptions = async (xmlText: string): Promise<SelectOption[]> => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.getElementsByTagName("item"));
  return items.map((item) => ({
    code: item.getElementsByTagName("code")[0]?.textContent || "",
    codeNm: item.getElementsByTagName("codeNm")[0]?.textContent || "",
  }));
};

const parseXMLtoResults = async (xmlText: string): Promise<ResultItem[]> => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.getElementsByTagName("item"));
  return items.map((item) => ({
    agchmApplcNo:
      item.getElementsByTagName("agchmApplcNo")[0]?.textContent || "",
    prdlstNm: item.getElementsByTagName("prdlstNm")[0]?.textContent || "",
    engPrdlstNm: item.getElementsByTagName("engPrdlstNm")[0]?.textContent || "",
    brandNm: item.getElementsByTagName("brandNm")[0]?.textContent || "",
    contInfo: item.getElementsByTagName("contInfo")[0]?.textContent || "",
    prpos: item.getElementsByTagName("prpos")[0]?.textContent || "",
    applcsicknsHlsctsickns:
      item.getElementsByTagName("applcsicknsHlsctsickns")[0]?.textContent || "",
    safeRdmtrTime:
      item.getElementsByTagName("safeRdmtrTime")[0]?.textContent || "",
    sprngspcsNm: item.getElementsByTagName("sprngspcsNm")[0]?.textContent || "",
    cropsNm: item.getElementsByTagName("cropsNm")[0]?.textContent || "",
    registDt: item.getElementsByTagName("registDt")[0]?.textContent || "",
  }));
};

export default function PesticideTable() {
  const [aList, setAList] = useState<string[]>([]);
  const [bList, setBList] = useState<string[]>([]);
  const [cList, setCList] = useState<string[]>([]);

  const [crop, setCrop] = useState("");
  const [usage, setUsage] = useState("");
  const [insect, setInsect] = useState("");

  const [results, setResults] = useState<ResultItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const rowsPerPage = 10;

  const handleSearch = useCallback(
    async (pageNo = 1, isTrue: boolean) => {
      setLoading(isTrue);
      setSearched(true);

      const query = new URLSearchParams({
        sCropsNm: crop,
        sPrpos: usage,
        sSprngspcsNm: insect,
        pageNo: String(pageNo),
        numOfRows: String(rowsPerPage),
      });

      const res = await fetch(`/api/proxy-insect-list?${query.toString()}`);
      const xmlText = await res.text();
      const parsed = await parseXMLtoResults(xmlText);

      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, "text/xml");
      const totalCount = parseInt(
        doc.getElementsByTagName("totalCount")[0]?.textContent || "0"
      );
      const pageCount = Math.ceil(totalCount / rowsPerPage);

      setResults(parsed);
      setTotalPages(pageCount);
      setPage(pageNo);
      setLoading(false);
    },
    [crop, usage, insect, rowsPerPage]
  );

  useEffect(() => {
    fetch("/api/proxy-insect-code")
      .then((res) => res.text())
      .then(parseXMLtoOptions)
      .then((data) => {
        setAList(data.filter((d) => d.code === "A").map((d) => d.codeNm));
        setBList(data.filter((d) => d.code === "B").map((d) => d.codeNm));
        setCList(data.filter((d) => d.code === "C").map((d) => d.codeNm));
      })
      .then(() => {
        // 항목 세팅 후 전체 조회 한 번 실행
        handleSearch(1, true);
      });
  }, [handleSearch]);

  const pageGroup = Math.floor((page - 1) / 10);
  const startPage = pageGroup * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  return (
    <div className="bg-gradient-to-b from-[#fffffff6] to-[#ffd675f6] min-h-screen text-white px-3 pt-5 pb-10 ">
      <div className=" mx-auto space-y-10 ">
        <section className="w-full order-1">
          <h2 className="text-2xl font-extrabold text-main-900 drop-shadow">
            내 작물에 맞는 농약 찾기
          </h2>
          <h3 className="text-gray-800 text-base mt-1">
            작물, 용도, 곤충을 선택 후 검색하면 농약 적용 정보를 확인할 수
            있습니다.
          </h3>
        </section>

        {/* 검색 폼 */}
        <section className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-wrap gap-2 justify-center items-end text-gray-800">
          <div>
            <label htmlFor="crop-select" className="block mb-1 font-medium">
              작물명
            </label>
            <select
              id="crop-select"
              onChange={(e) => setCrop(e.target.value)}
              className="bg-white text-gray-900 p-2 rounded-md"
              aria-label="작물명 선택"
            >
              <option value="">전체</option>
              {aList.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="usage-select" className="block mb-1 font-medium">
              용도
            </label>
            <select
              id="usage-select"
              onChange={(e) => setUsage(e.target.value)}
              className="bg-white text-gray-900 p-2 rounded-md"
              aria-label="용도 선택"
            >
              <option value="">전체</option>
              {bList.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="insect-select" className="block mb-1 font-medium">
              곤충
            </label>
            <select
              id="insect-select"
              onChange={(e) => setInsect(e.target.value)}
              className="bg-white text-gray-900 p-2 rounded-md"
              aria-label="곤충 선택"
            >
              <option value="">전체</option>
              {cList.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => handleSearch(1, true)}
            className="button-orange"
          >
            검색
          </button>
        </section>

        {/* 결과 테이블 */}
        <section className="bg-white text-gray-900 rounded-xl shadow-lg w-full overflow-auto">
          {loading ? (
            <div className="text-center p-6 text-xl">검색 중...</div>
          ) : results.length === 0 && searched ? (
            <div className="text-center p-6 text-lg text-gray-500">
              해당 조합으로 된 검색결과가 없습니다.
            </div>
          ) : (
            <table className="min-w-2xl text-base text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">번호</th>
                  <th className="p-2">상표명</th>
                  <th className="p-2">품목명</th>
                  <th className="p-2">
                    함량 <br />
                    정보
                  </th>
                  <th className="p-2">
                    안전 <br />
                    방사 <br />
                    시간
                  </th>
                  <th className="p-2">작물명</th>
                  <th className="p-2">봄종명</th>
                  <th className="p-2">용도</th>
                  <th className="p-2">적용병해충</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="odd:bg-gray-50 even:bg-white">
                    <td className="p-2">{r.agchmApplcNo}</td>
                    <td className="p-2">{r.brandNm}</td>
                    <td className="p-2 break-words max-w-[15ch]">
                      {r.prdlstNm}
                    </td>
                    <td className="p-2">{r.contInfo}</td>
                    <td className="p-2">{r.safeRdmtrTime}</td>
                    <td className="p-2">{r.cropsNm}</td>
                    <td className="p-2">{r.sprngspcsNm}</td>
                    <td className="p-2">{r.prpos}</td>
                    <td className="p-2">{r.applcsicknsHlsctsickns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <section className="flex flex-wrap justify-center mt-4">
            {startPage > 1 && (
              <button
                onClick={() => handleSearch(startPage - 1, false)}
                className="px-3 py-1 text-white font-semibold
                 bg-white/20 backdrop-blur-xl border border-white/20 shadow-md
                 rounded-l-full hover:bg-white/30 transition-all cursor-pointer"
              >
                ◀
              </button>
            )}

            {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
              const pageNo = startPage + idx;
              const isSelected = page === pageNo;

              return (
                <button
                  key={pageNo}
                  onClick={() => handleSearch(pageNo, false)}
                  className={`px-3 py-1 text-white font-semibold border-t border-b border-white/20
                    -ml-[1px] relative transition-all cursor-pointer
                    ${
                      isSelected
                        ? "bg-white/40 backdrop-blur-xl shadow-lg -translate-y-1 scale-105 z-10 rounded"
                        : "bg-white/20 backdrop-blur-xl shadow-md hover:bg-white/30"
                    }
                    ${idx === 0 ? "rounded-l-full" : ""}
                    ${idx === endPage - startPage ? "rounded-r-full" : ""}`}
                >
                  {pageNo}
                </button>
              );
            })}

            {endPage < totalPages && (
              <button
                onClick={() => handleSearch(endPage + 1, false)}
                className="px-3 py-1 text-white font-semibold
                 bg-white/20 backdrop-blur-xl border border-white/20 shadow-md
                 rounded-r-full hover:bg-white/30 transition-all cursor-pointer"
              >
                ▶
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
