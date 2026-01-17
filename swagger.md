수확량 및 품질 예측 API
수확량 및 품질 예측 관련 API



POST
/api/v1/reports/harvest-prediction
AI 기반 스마트 농업 분석 리포트 생성


사용자의 농지 정보(위치/면적/작물/품종), 하우스 시설 정보(하우스 수/면적/벌 사용/연 생산량), 환경 데이터(온도/습도, 선택)를 기반으로 AI가 종합 분석 리포트를 생성합니다.

리포트 구성:

수정벌 관리 최적화 지수 (점수 및 상위 퍼센트)
맞춤 수정벌 추천 (최적 벌 + 대안)
온습도 상태 진단 (현재 상태 + 경고)
우선 개선 사항 (심각도 순)
관리 가이드 (온도/습도/수분 관리)
기대 수익 분석 (추가 생산량 및 ROI)
최종 결론 요약
응답 시간은 평균 2~5초 이내입니다.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "farmBaseInfo": {
    "region": "에천",
    "areaPyeong": 1000,
    "cropName": "딸기",
    "cropVariety": "설향"
  },
  "greenhouseSetup": {
    "houseCount": 3,
    "areaPerHousePyeong": 330,
    "beeType": "지리산 수정벌",
    "boxesPerHouse": 3,
    "replacementCycleWeeks": 3,
    "annualYieldKg": 5000
  },
  "environmentData": {
    "temperature": 27,
    "humidity": 85
  }
}
Responses
Code	Description	Links
200	
성공

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": "200",
  "message": "요청이 성공하였습니다.",
  "data": {
    "summaryScore": {
      "score": 85,
      "percentile": 60
    },
    "recommendation": {
      "best": {
        "name": "지리산 수정벌",
        "price": 45000,
        "replacementCycleWeeks": 3,
        "activityRate": 92,
        "optimalTemperature": {
          "min": 15,
          "max": 28
        },
        "tags": [
          "고활동성",
          "저온적응"
        ]
      },
      "alternatives": [
        {
          "name": "호박벌",
          "price": 38000,
          "replacementCycleWeeks": 4,
          "activityRate": 88,
          "tags": [
            "경제적",
            "안정적"
          ]
        }
      ]
    },
    "environmentDiagnosis": {
      "temperature": {
        "current": 27,
        "optimal": {
          "min": 15,
          "max": 28
        },
        "status": "NORMAL"
      },
      "humidity": {
        "current": 85,
        "optimal": {
          "min": 60,
          "max": 80
        },
        "status": "HIGH"
      },
      "alerts": [
        "string"
      ]
    },
    "priorityIssues": [
      {
        "rank": 1,
        "title": "습도 과다",
        "description": "현재 습도가 85%로 최적 범위(60-80%)를 초과하여 병해 발생 위험이 있습니다."
      }
    ],
    "managementGuide": {
      "temperatureControl": {
        "currentRange": "27°C",
        "recommendedRange": "18-25°C",
        "actions": [
          "string"
        ]
      },
      "humidityControl": {
        "currentRange": "85%",
        "recommendedRange": "60-80%",
        "actions": [
          "string"
        ]
      },
      "pollinationManagement": {
        "placement": "하우스 중앙, 지면에서 50cm 높이",
        "replacementCycle": "3주마다 교체",
        "additionalTips": [
          "string"
        ]
      }
    },
    "expectedRevenue": {
      "marketPricePerKg": 8000,
      "annualProductionKg": 5000,
      "currentPollinationRate": 75,
      "improvedPollinationRate": 92,
      "additionalProductionKg": 850,
      "additionalRevenue": 6800000,
      "additionalCost": {
        "min": 500000,
        "max": 800000
      },
      "netGainRange": {
        "min": 6000000,
        "max": 6300000
      },
      "roiPercentRange": {
        "min": 750,
        "max": 1260
      }
    },
    "finalConclusion": {
      "suitability": "매우 적합",
      "expectedImprovementRate": {
        "min": 750,
        "max": 1260
      },
      "expectedAnnualRevenueIncrease": {
        "min": 6000000,
        "max": 6300000
      }
    }
  }
}