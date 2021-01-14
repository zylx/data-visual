export default {
  component: 'chart-bar',
  label: '柱形图',
  propValue: {
    title: {
      text: '柱形图'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  },
  icon: 'el-icon-thumb',
  animations: [],
  events: {},
  style: {
    width: 300,
    height: 300,
    color: '',
    backgroundColor: ''
  }
}
