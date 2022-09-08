import { Component, OnInit } from '@angular/core';

import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor() { }
  value: any;
  
  ngOnInit(): void {
    
    //creates pie chart
    this.value = 100
    type EChartsOption = echarts.EChartsOption
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    option = {
      title: {
        text: 'Organisation Donations',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left'
      // },
      series: [
        {
          name: 'Total Donations',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.value, name: 'Social Moments' },
            { value: 735, name: 'EdAble Flowers' },
            { value: 580, name: 'Barrys Bakehouse' },
            { value: 484, name: 'Phone Zone' },
            { value: 300, name: 'Tress R Us' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    option && myChart.setOption(option);
  }
  
  
}
