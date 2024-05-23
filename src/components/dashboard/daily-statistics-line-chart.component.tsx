import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import { IChartSize, IDashboardModel } from '../../redux/domains/Dashboard';
import i18n from '../../i18n';

interface IDailyStatisticsLineChartProps {
    dashboardModel: IDashboardModel;
    disabledTotalCase? : boolean;
    chartSize?: IChartSize;
    productChartHeight?: number;
}

const DailyStatisticsLineChart: FC<IDailyStatisticsLineChartProps> = ({dashboardModel, disabledTotalCase = false, chartSize = {chartClassName:""}, productChartHeight = 0 }) => {

    const [showTotalCase, setShowTotalCase] = useState(!disabledTotalCase);
    const [showTotalOrder, setShowTotalOrder] = useState(disabledTotalCase);
    const [showCancelOrder, setShowCancelOrder] = useState(false);

    const generateData : Chart.ChartData | ((canvas: HTMLCanvasElement) => Chart.ChartData) = (showCase: Boolean, showOrder: Boolean, showCancel: Boolean) => {

        const labels = dashboardModel?.dateList?.map((value) => {
            return dayjs(value).format('DD-MM-YYYY');
        });
        let caseValue: number[] = [];
        let orderValue: number[] = [];
        let cancelValue: number[] = [];
        
        const dataset: any[] = [];

        if (showCase) {
            caseValue = dashboardModel?.caseCounts?.map((value) => {
                return value.caseCount;
            });
            dataset.push( {
                //total
                label: i18n.t("TOTAL_CASE"),
                data: caseValue,
                fill: false,
                backgroundColor: '#0171BB',
                borderColor: '#0171BB',
                pointRadius: 4
            });
        }
        if (showOrder) {
            orderValue = dashboardModel?.orderCounts?.map((value) => {
                return value.totalCount;
            });
            dataset.push(  {
                //order
                label: i18n.t("TOTAL_ORDER"),
                data: orderValue,
                fill: false,
                backgroundColor: '#F3B002',
                borderColor: '#F3B002',
                pointRadius: 4
            });
        }
        if (showCancel) {
            cancelValue = dashboardModel?.orderCounts?.map((value) => {
                return value.rejectedCount;
            });
            dataset.push(  {
                //reject
                label: i18n.t("REJECTED_ORDER"),
                data: cancelValue,
                fill: false,
                backgroundColor: '#EB2E38',
                borderColor: '#EB2E38',
                pointRadius: 4
            });
        }

        return {
            labels: labels,
            datasets: dataset
        };
    }   

    const generateOption: Chart.ChartOptions = () => {
    const options = {
        maintainAspectRatio: false,
        indexAxis: 'x',
        layout: {
            padding: 20
        },
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'right',
          },
          title: {
            display: false,
          },
        },
        scales: {
            x: {
                grid: {
                    borderColor: '#616161',
                    color: 'transparent'
                },               
            },  
            y: {
                grid: {
                    borderColor: '#ffffff'
                },
                color: '#CACACA',
                ticks: {
                    beginAtZero: true,
                    callback: (value:any, index:any, values:any) => {
                        if (Math.floor(value) === value) {
                            return value;
                        }
                    }
                }
            },
        },
        hover: {
            mode: 'index',
            intersect: true
         }
      };
      return options;
    };

    return (
        <div className="daily-stat__main-box hexa__box-shadow h-100">
        <Navbar className="justify-content-end px-0">
            <Nav className="daily-stat__nav-menu flex-wrap">
                    {!disabledTotalCase &&
                    <Nav.Item className="case-detail__menu-item ml-3 mb-2">
                        <Button className= {(showTotalCase?"selected " : "" )+"daily-stat__menu_btn"} variant="" onClick={()=> setShowTotalCase(!showTotalCase)}>{i18n.t("TOTAL_CASE")}</Button>
                    </Nav.Item>
                    }
                    <Nav.Item className="case-detail__menu-item ml-3 mb-2">
                        <Button className={(showTotalOrder?"selected " : "" )+"daily-stat__menu_btn"} variant="" onClick={()=> setShowTotalOrder(!showTotalOrder)}>{i18n.t("TOTAL_ORDER")}</Button>
                    </Nav.Item>   
                    <Nav.Item className="case-detail__menu-item ml-3 mb-2">
                        <Button className={(showCancelOrder?"selected " : "" )+"daily-stat__menu_btn"} variant="" onClick={()=> setShowCancelOrder(!showCancelOrder)}>{i18n.t("REJECTED_ORDER")}</Button>
                    </Nav.Item>            
            </Nav>              
        </Navbar>
        <div className={chartSize.chartClassName} style={{height: productChartHeight > 0 ? productChartHeight: undefined }}>
            <Line type='horizontalBar' data={generateData(showTotalCase,showTotalOrder,showCancelOrder)} options={generateOption()}></Line>
        </div>
    </div>
    );

}

export default DailyStatisticsLineChart;
