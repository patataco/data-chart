# 원티드 프리온보딩 4주차 - 주어진 데이터를 기반으로 시계열 차트 만들기

## 📚 과제

### - 주어진 데이터를 기반으로 시계열 차트 만들기

#### 과제1. JSON 데이터를 기반으로 시계열차트 구현

- key값(시간)을 기반으로 시계열 차트 구현
- Area 형태의 그래프와 Bar 형태의 그래프가 모두 존재하는 복합 그래프 구현

#### 과제2. 호버 기능 구현

- 특정 데이터 구역에 마우스 호버시 id, value_area, value_bar 데이터를 툴팁 형태로 표시

#### 과제3. 필터링 기능 구현

- 버튼 형태로 ID값(지역이름)을 이용하여 버튼 클릭시 선택한 ID값과 동일한 ID값을 가진 데이터 구역만 하이라이트 처리
- 특정 데이터 구역을 클릭 시에도 필터링 기능과 동일한 형태로 동일한 ID값을 가진 데이터 구역을 하이라이트 처리

</br>

## 사용한 기술 스택

<img src="https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square"/> <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=Tailwind%20CSS&logoColor=white"/> <img src="https://img.shields.io/badge/chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white"/>
</br>

---

## 프로젝트 실행 방법

```
npm install
npm run dev

```

## 데모영상

Vercel을 통해 배포. [DEMO](https://data-chart.vercel.app/)
</br>

## 페이지 미리보기

![CleanShot 2023-09-13 at 21 21 12](https://github.com/patataco/data-chart/assets/127014105/266a930a-a141-479d-99ac-e2fca147aef8)

## 구조

```
src
 ┣ components
 ┃ ┣ Button.tsx
 ┃ ┣ ChartComponent.tsx
 ┃ ┗ FilterButton.tsx
 ┣ pages
 ┃ ┣ api
 ┃ ┃ ┗ hello.ts
 ┃ ┣ _app.tsx
 ┃ ┣ _document.tsx
 ┃ ┗ index.tsx
 ┣ service
 ┃ ┣ index.ts
 ┃ ┗ useChartData.ts
 ┣ styles
 ┃ ┗ globals.css
 ┗ utils
 ┃ ┣ chartOptions.ts
 ┃ ┣ dateFormat.ts
 ┃ ┣ getChartData.ts
 ┃ ┣ index.ts
 ┃ ┗ tooltipCallbacks.ts

```

</br>

## 💭 설계 방향

#### 설계 목표

- 본 프로젝트에서는 주어진 JSON 데이터를 기반으로 시계열 차트를 구현하였습니다. 데이터는 fetch 함수를 활용하여 public 디렉토리에 저장된 JSON 파일에서 가져왔습니다. 주된 목표는 원본 데이터를 Chart.js의 데이터 구조에 맞게 변환하는 작업이었으며, 이 변환 작업을 선언적 방법론을 통해 구현하였습니다. 이로 인해 전통적인 명령형 프로그래밍에서 볼 수 있는 state 관리와 이를 바꿔주는 set 메서드의 반복적인 사용 없이 데이터의 흐름을 자연스럽게 따르며 필요한 변환을 수행할 수 있었습니다.

## 🛠️ 설계 및 구현 설명

### 1. 데이터 변환 및 최적화

#### 설계 및 개발 방향

useChartData hook에서 원본 데이터를 가져와 시간 순서대로 정렬하고, x축에 표시될 날짜 형식으로 변환하였습니다. 이러한 변환 작업이 반복적으로 발생하지 않도록, 의존성 배열에 데이터를 넣어 useMemo로 최적화하였습니다.

```
const { labels, dataArr } = useMemo(() => {
  if (!data) {
    return {
      dataArr: [],
      labels: [],
    };
  }
  return parseData(data);
}, [data]);

```

### 2. 차트 컴포넌트

#### 설계 및 개발 방향

ChartComponent에서는 useChartData 훅으로부터 변환된 데이터를 가져와 차트를 구성하였습니다. 차트의 데이터가 필터링 조건(선택된 지역구 ID)에 따라 바뀌어야 하는 상황에서도, useMemo를 활용하여 선언적으로 업데이트되도록 설계하였습니다.

```
const newChartData: ChartData = useMemo(
  () =>
    getChartData(
      dataArr,
      labels,
      filteredId,
      LINE_COLOR,
      LINE_BACKGROUND,
      LINE_HIGHLIGHT_COLOR,
      BAR_COLOR,
      BAR_HIGHLIGHT_COLOR
    ),
  [labels, dataArr, filteredId]
);

```

## 결론

본 프로젝트에서는 useMemo의 활용을 통해 선언적 프로그래밍 방법론을 적극적으로 도입하였습니다. 이를 통해 코드의 가독성을 높이고, 불필요한 계산을 최소화하여 애플리케이션의 성능을 향상시켰습니다. 특히, 전통적인 방식의 state 관리와 그를 변경하는 set 함수의 사용을 줄이면서도 데이터의 흐름을 자연스럽게 유지할 수 있었습니다. 이러한 선언적 접근 방식은 복잡한 상태 관리를 필요로 하는 현대의 웹 애플리케이션에서 더욱 효율적인 코드 작성을 가능케 합니다.
