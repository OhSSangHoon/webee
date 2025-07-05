"use client";

import { useEffect, useState } from "react";

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

export default function pesticideTable() {
  const [aList, setAList] = useState<string[]>([]);
  const [bList, setBList] = useState<string[]>([]);
  const [cList, setCList] = useState<string[]>([]);

  const [crop, setCrop] = useState("");
  const [usage, setUsage] = useState("");
  const [insect, setInsect] = useState("");

  const [results, setResults] = useState<ResultItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetch("/api/proxy-insect-code")
      .then((res) => res.text())
      .then(parseXMLtoOptions)
      .then((data) => {
        setAList(data.filter((d) => d.code === "A").map((d) => d.codeNm));
        setBList(data.filter((d) => d.code === "B").map((d) => d.codeNm));
        setCList(data.filter((d) => d.code === "C").map((d) => d.codeNm));
      });
  }, []);

  const handleSearch = async (pageNo = 1) => {
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

    // 페이지 수 계산
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "text/xml");
    const totalCount = parseInt(
      doc.getElementsByTagName("totalCount")[0]?.textContent || "0"
    );
    const pageCount = Math.ceil(totalCount / rowsPerPage);

    setResults(parsed);
    setTotalPages(pageCount);
    setPage(pageNo);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">🐝 농약적용검색</h1>

      <div className="flex gap-4 items-end">
        <div>
          <label>작물명</label>
          <select
            onChange={(e) => setCrop(e.target.value)}
            className="border p-2 rounded block"
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
          <label>용도</label>
          <select
            onChange={(e) => setUsage(e.target.value)}
            className="border p-2 rounded block"
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
          <label>곤충</label>
          <select
            onChange={(e) => setInsect(e.target.value)}
            className="border p-2 rounded block"
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
          onClick={() => handleSearch(1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">번호</th>
            <th className="border px-2 py-1">상표명</th>
            <th className="border px-2 py-1">품목명</th>
            <th className="border px-2 py-1">함량정보</th>
            <th className="border px-2 py-1">안전방사시간</th>
            <th className="border px-2 py-1">작물명</th>{" "}
            <th className="border px-2 py-1">봄종명</th>
            <th className="border px-2 py-1">용도</th>
            <th className="border px-2 py-1">적용병해충</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{r.agchmApplcNo}</td>
              <td className="border px-2 py-1">{r.brandNm}</td>
              <td className="border px-2 py-1">{r.prdlstNm}</td>
              <td className="border px-2 py-1">{r.contInfo}</td>
              <td className="border px-2 py-1">{r.safeRdmtrTime}</td>{" "}
              <td className="border px-2 py-1">{r.cropsNm}</td>
              <td className="border px-2 py-1">{r.sprngspcsNm}</td>
              <td className="border px-2 py-1">{r.prpos}</td>
              <td className="border px-2 py-1">{r.applcsicknsHlsctsickns}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNo = idx + 1;
          return (
            <button
              key={pageNo}
              onClick={() => handleSearch(pageNo)}
              className={`px-3 py-1 border rounded ${
                page === pageNo ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {pageNo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
