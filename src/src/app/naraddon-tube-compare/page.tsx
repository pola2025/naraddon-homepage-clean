'use client';

import React, { useState } from 'react';
import NaraddonTubeV1 from '@/components/NaraddonTubeV1';
import NaraddonTubeV2 from '@/components/NaraddonTubeV2';
import './page.css';

export default function NaraddonTubeComparePage() {
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2' | 'both'>('both');

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1 className="compare-title">나라똔튜브 기획안 비교</h1>
        <p className="compare-subtitle">두 가지 버전을 비교하여 최적의 디자인을 선택하세요</p>

        <div className="version-selector">
          <button
            className={`selector-btn ${selectedVersion === 'v1' ? 'active' : ''}`}
            onClick={() => setSelectedVersion('v1')}
          >
            버전 1 - 썸네일 확장형
          </button>
          <button
            className={`selector-btn ${selectedVersion === 'v2' ? 'active' : ''}`}
            onClick={() => setSelectedVersion('v2')}
          >
            버전 2 - 띠배너형
          </button>
          <button
            className={`selector-btn ${selectedVersion === 'both' ? 'active' : ''}`}
            onClick={() => setSelectedVersion('both')}
          >
            둘 다 보기
          </button>
        </div>
      </div>

      <div className="compare-content">
        {(selectedVersion === 'v1' || selectedVersion === 'both') && (
          <div className="version-section">
            <div className="version-info">
              <h2>버전 1 - 썸네일 확장형</h2>
              <ul className="feature-list">
                <li>✅ 4개의 썸네일 그리드 레이아웃</li>
                <li>✅ 클릭 시 모달 팝업으로 확대</li>
                <li>✅ 선택되지 않은 요소 블러 처리</li>
                <li>✅ 확대된 썸네일 아래 영상 2개 표시</li>
                <li>✅ 몰입감 있는 포커스 경험</li>
              </ul>
            </div>
            <NaraddonTubeV1 />
          </div>
        )}

        {(selectedVersion === 'v2' || selectedVersion === 'both') && (
          <div className="version-section">
            <div className="version-info">
              <h2>버전 2 - 띠배너형</h2>
              <ul className="feature-list">
                <li>✅ 가로형 띠배너 4개 세로 배치</li>
                <li>✅ 이미지와 영상 좌우 교차 배치</li>
                <li>✅ 모든 콘텐츠 한눈에 확인 가능</li>
                <li>✅ 클릭 시 해당 위치에서 영상 재생</li>
                <li>✅ 스크롤 친화적 레이아웃</li>
              </ul>
            </div>
            <NaraddonTubeV2 />
          </div>
        )}
      </div>

      <div className="compare-footer">
        <div className="comparison-table">
          <h3>기능 비교표</h3>
          <table>
            <thead>
              <tr>
                <th>비교 항목</th>
                <th>버전 1 (썸네일 확장형)</th>
                <th>버전 2 (띠배너형)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>초기 화면</td>
                <td>컴팩트한 그리드</td>
                <td>전체 콘텐츠 노출</td>
              </tr>
              <tr>
                <td>사용자 경험</td>
                <td>탐색 → 선택 → 확대</td>
                <td>스크롤 → 즉시 재생</td>
              </tr>
              <tr>
                <td>공간 활용</td>
                <td>효율적 (접힌 상태)</td>
                <td>넓은 공간 필요</td>
              </tr>
              <tr>
                <td>모바일 적합성</td>
                <td>우수 (모달 방식)</td>
                <td>양호 (세로 배치)</td>
              </tr>
              <tr>
                <td>콘텐츠 접근성</td>
                <td>2단계 (클릭 필요)</td>
                <td>1단계 (바로 보임)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
