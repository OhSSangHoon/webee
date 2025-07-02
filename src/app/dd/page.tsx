"use client";
export interface BeeDiagnosisResult {
  code: string;
  message: string;
  data: {
    name: string;
    confidence: string;
    description: string;
    symptoms: string[];
    cause: string;
    severity: string;
  };
}

import React, { useState } from "react";
import axios from "axios";

const BeeDiagnosisUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BeeDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("beeImage", file);

    try {
      const response = await axios.post<BeeDiagnosisResult>(
        `https://api.webee.sbs/api/v1/bee/diagnosis`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("진단 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>🐝 꿀벌 질병 진단기</h2>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleSubmit}>진단 요청</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "1rem",
            backgroundColor: "#f8f8f8",
            padding: "1rem",
          }}
        >
          <h3>✅ 진단 결과</h3>
          <p>
            <strong>질병명:</strong> {result.data.name}
          </p>
          <p>
            <strong>신뢰도:</strong> {result.data.confidence}
          </p>
          <p>
            <strong>설명:</strong> {result.data.description}
          </p>
          <p>
            <strong>원인:</strong> {result.data.cause}
          </p>
          <p>
            <strong>심각도:</strong> {result.data.severity}
          </p>
          <p>
            <strong>증상:</strong>
          </p>
          <ul>
            {result.data.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BeeDiagnosisUploader;
