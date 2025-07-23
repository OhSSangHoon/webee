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

  const handleSearch = useCallback(async (pageNo = 1, isTrue: boolean) => {
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
  }, [crop, usage, insect, rowsPerPage]);

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
    
    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10 pt-20">
        <h1 className="text-4xl font-extrabold text-center">
          🐝 화분매개곤충 농약 적용 검색
        </h1>
        <p className="text-center text-lg text-white/80">
          작물, 용도, 곤충을 선택하고 검색하면 농약 적용 정보를 확인할 수
          있습니다.
        </p>

        {/* 검색 폼 */}
        <div className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-wrap gap-4 justify-center items-end">
          <div>
            <label className="block mb-1 font-medium">작물명</label>
            <select
              onChange={(e) => setCrop(e.target.value)}
              className="bg-white text-black p-2 rounded-md"
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
            <label className="block mb-1 font-medium">용도</label>
            <select
              onChange={(e) => setUsage(e.target.value)}
              className="bg-white text-black p-2 rounded-md"
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
            <label className="block mb-1 font-medium">곤충</label>
            <select
              onChange={(e) => setInsect(e.target.value)}
              className="bg-white text-black p-2 rounded-md"
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
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition"
          >
             검색
          </button>
        </div>

        {/* 결과 테이블 */}
        <div className="bg-white text-black rounded-xl overflow-auto shadow-lg">
          {loading ? (
            <div className="text-center p-6 text-xl">검색 중...</div>
          ) : results.length === 0 && searched ? (
            <div className="text-center p-6 text-lg text-gray-500">
              해당 조합으로 된 검색결과가 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">번호</th>
                  <th className="p-2">상표명</th>
                  <th className="p-2">품목명</th>
                  <th className="p-2">함량정보</th>
                  <th className="p-2">안전방사시간</th>
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
                    <td className="p-2">{r.prdlstNm}</td>
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
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 flex-wrap">
            {startPage > 1 && (
              <button
                onClick={() => handleSearch(startPage - 1, false)}
                className="px-3 py-1 rounded-full bg-white text-black hover:bg-gray-200"
              >
                ◀
              </button>
            )}
            {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
              const pageNo = startPage + idx;
              return (
                <button
                  key={pageNo}
                  onClick={() => handleSearch(pageNo, false)}
                  className={`px-3 py-1 rounded-full transition ${
                    page === pageNo
                      ? "bg-yellow-400 text-black font-bold"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {pageNo}
                </button>
              );
            })}
            {endPage < totalPages && (
              <button
                onClick={() => handleSearch(endPage + 1, false)}
                className="px-3 py-1 rounded-full bg-white text-black hover:bg-gray-200"
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
