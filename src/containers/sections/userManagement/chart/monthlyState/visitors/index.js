import React, { Component } from "react";
import Chart from "react-apexcharts";
import classes from './style.scss';
import cl from '../../../../../../Hoc/multiclass';
function cn(elem) { return cl(elem, classes); }
class MonthlyVisitorsState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: false } },
      },
      dataLabels: {
        enabled: true,
        dropShadow: { enabled: true },
        style: { fontSize: '16px' }
      },
      noData: {
        text: 'Data has not been set',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#fff",
          fontSize: '14px',
          fontFamily: 'inherit'
        }
      },
      yaxis: [{
        forceNiceScale: true,
        axisTicks: { show: true },
        axisBorder: {
          show: true,
          color: "#ccc"
        },
        labels: {
          style: { color: "#ccc" }
        },
        title: {
          text: "visitors",
          style: {
            color: '#ccc',
            fontSize: '1.2rem',
            fontFamily: 'Helvetica, Arial, sans-serif',
        },
        }
      }],
      legend: {
        position: 'top',
        onItemClick: { toggleDataSeries: true },
      },
      loading:false,
      overlap:true
    }
  }
  series=()=>{
    return [
      {name: "Jun", data: [30, 60, 100, 15, 25, 28, 38, 46]},
      { name: "July", data: [20, 29, 37, 36, 44, 45, 50, 58] } 
    ]
  }

  chart=()=>{
    return{
      toolbar: { show: true },
      events:{ 
        beforeMount:(chartContext, config)=>{ console.log('beforeMounted') },
        mounted:(chartContext, config)=>{ console.log('Mounted') }
      },
      height: 100,
    }
  }

  xaxis=()=>{
    return {
      categories: [ "01", "02", "03", "04", "05", "06", "07", "08" ],
      labels:{ 
        show:true, 
        style:{ 
          colors:'#ccc' ,
        } 
      }
    }
  }
  options=()=>{
    const { fill,dataLabels,noData,yaxis,legend,grid }=this.state
    return {
      fill, dataLabels, noData, yaxis, grid, legend,
      xaxis:this.xaxis(),
      chart:this.chart()
    }
  }
  showHandler=()=>{
    let containerClass = ['visits-chart'];
    if(!this.props.show){
      containerClass.push('hide')
    }
    return containerClass

  }
  render() {
    return (
      <div className={cn(this.showHandler())}>
        <Chart
          options={this.options()}
          series={this.series()}
          type="area"
          width="100%"
          height="300px"
        />
      </div>
    );
  }
}

export default MonthlyVisitorsState;