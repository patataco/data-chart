export const beforeBody = (context, data) => {
  const item = context[0];

  // const isAreaDataset = item.datasetIndex === 0;

  // const valueAreaLabel = isAreaDataset ? item.dataset.label : 'value_area';
  // const valueBarLabel = !isAreaDataset ? item.dataset.label : 'value_bar';
  //
  // const areaValue = isAreaDataset
  //   ? item.parsed.y
  //   : data[item.dataIndex]['value_area'];
  // const barValue = !isAreaDataset
  //   ? item.parsed.y
  //   : data[item.dataIndex]['value_bar'];

  const districtId = data ? data[item.dataIndex].id : 'N/A';

  return [`ID: ${districtId}`];
};

export const getLabels = (context) => {
  const chart = context.chart;
  const index = context.dataIndex;

  const valueArea = chart.data.datasets[0].data[index];
  const valueBar = chart.data.datasets[1].data[index];

  const labelArea = chart.data.datasets[0].label || 'value_area';
  const labelBar = chart.data.datasets[1].label || 'value_bar';

  return [`${labelArea}: ${valueArea}`, `${labelBar}: ${valueBar}`];
};

// export const getLabelColor = (context) => {
//   const chart = context.chart;
//   const datasetIndex = context.datasetIndex;
//
//   const borderColor = chart.data.datasets[datasetIndex].borderColor;
//   const backgroundColor = chart.data.datasets[datasetIndex].backgroundColor;
//
//   return [
//     {
//       borderColor: '',
//       backgroundColor: BAR_COLOR,
//     },
//     { borderColor: LINE_HIGHLIGHT_COLOR, backgroundColor: LINE_BACKGROUND },
//   ];
// };
