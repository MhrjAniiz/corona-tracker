import React from "react";
import {Line} from 'react-chartjs-2'
import { useState ,useEffect} from "react";
import numeral from 'numeral'


const options = {
    legend:{
        display:false,
    },
    elements:{
        points:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect: false,
        callbacks:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:"ll",
                },
            },
        ],
        yAxes:[
            {
                gridLines: {
                    display: false,
                },
                ticks:{
                    callback: function( value,index,values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}
export default function LineGraph({casesType="cases"}) {
  const [data, setData] = useState({});
  useEffect(() => {
      const fetchData = async()=>{
        fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data,'cases');
          setData(chartData);
        });
      }
      fetchData();
  }, [casesType]);

  const buildChartData = (data, casesType="cases") =>{
      const chartData = [];
      let lastDataPoint;

      for(let date in data.cases){
          if(lastDataPoint){
              const newDataPoint = {
                  x: date,
                  y:data[casesType][date]- lastDataPoint
              }
             chartData.push(newDataPoint);
          }
          lastDataPoint = data[casesType][date];
      }
      return chartData;
  }
  return (
    <div>
        {data?.length>0 && (
             <Line  options={options} data={{
               
                datasets: [
                    {
                        backgroundColor: 'rgba(204,16,52,0.2)',
                        borderColor: "#CC1034",
                        data:data
                    }
                ]
            }} />
        )}
           
    </div>
  );
}
