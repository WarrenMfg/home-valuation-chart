import { useEffect } from 'react';
import ChartJS from 'chart.js';

import { formatValuation } from '../utils';

// remove janky animation on hover
ChartJS.defaults.global.hover = {
  mode: 'nearest',
  intersect: true,
  axis: 'x',
  animationDuration: 0
};

export const useChartJS = ({
  homeValuationData,
  canvasRef,
  chartRef,
  setEstimate,
  selectedHomeValuationData
}) => {
  // create/destroy chart on selectedHomeValuationData changes
  useEffect(() => {
    // update estimate
    if (homeValuationData.length >= 2) {
      const last2Months = homeValuationData.slice(-2);
      const currentMonth = last2Months[1].valuation;
      const lastMonth = last2Months[0].valuation;
      const diff = currentMonth - lastMonth;
      const percentDiff = Math.round((diff / currentMonth) * 100);
      setEstimate(
        `${formatValuation({
          data: diff,
          withSign: true,
          roundToNearestThousand: false
        })} (${percentDiff}%)`
      );
    } // TODO: if estimate is negative, still show this info? If so, same color?

    // .getContext(), define config, create/destroy chart
    if (selectedHomeValuationData.length) {
      // consider: selectedHomeValuationData.length >= 2
      const ctx = canvasRef.current.getContext('2d');
      const config = {
        type: 'line',
        data: {
          // labels for months
          labels:
            selectedHomeValuationData.length >= 6
              ? selectedHomeValuationData.map(obj => obj.month).concat(['']) // need extra space
              : selectedHomeValuationData.map(obj => obj.month),
          // data for top dashed line, solid line, and bottom dashed line
          datasets: [
            // top dashed line
            {
              data: selectedHomeValuationData.map(obj => obj.valuationHigh),
              backgroundColor: 'rgb(243, 249, 251)',
              fill: '+1',
              lineTension: 0,
              borderColor: 'rgb(0, 133, 167)',
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0,
              pointHitRadius: 0
            },
            // solid line
            {
              data: selectedHomeValuationData.map(obj => obj.valuation),
              fill: false,
              lineTension: 0,
              borderColor: 'rgb(0, 133, 167)',
              borderWidth: 2,
              borderCapStyle: 'round',
              pointRadius: 3, // indicators are likely needed for mobile
              pointHitRadius: 12,
              pointBackgroundColor: 'rgb(0, 133, 167)',
              pointBorderColor: 'rgba(255, 255, 255, 0)',
              pointHoverRadius: 7,
              pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
              pointHoverBorderColor: 'rgb(0, 133, 167)',
              pointHoverBorderWidth: 2
            },
            // bottom dashed line
            {
              data: selectedHomeValuationData.map(obj => obj.valuationLow),
              backgroundColor: 'rgb(243, 249, 251)',
              fill: '-1',
              lineTension: 0,
              borderColor: 'rgb(0, 133, 167)',
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0,
              pointHitRadius: 0
            }
          ]
        },
        // overall options for legend, layout, scales, and custom tooltip
        options: {
          // use our own legend
          legend: {
            display: false
          },
          // need padding-top so top label doesn't get cut off
          layout: {
            padding: {
              top: 20
            }
          },
          // define gridlines and ticks
          scales: {
            xAxes: [
              {
                offset: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                  zeroLineWidth: 0
                },
                ticks: {
                  maxTicksLimit: 4,
                  maxRotation: 0,
                  minRotation: 0,
                  fontSize: 16,
                  padding: 8,
                  fontColor: 'rgb(37, 40, 42)',
                  fontFamily:
                    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
                }
              }
            ],
            yAxes: [
              {
                position: 'right',
                gridLines: {
                  lineWidth: 2,
                  color: 'rgb(235,235,235)',
                  drawBorder: false,
                  drawTicks: false,
                  zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  suggestedMin: selectedHomeValuationData[0].valuation / 3,
                  maxTicksLimit: 5,
                  mirror: true,
                  labelOffset: -10,
                  fontSize: 16,
                  fontColor: 'rgb(37, 40, 42)',
                  fontFamily:
                    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
                  // custom labels
                  callback: function (value) {
                    if (value < 100) {
                      return '$0';
                    } else if (value < 1000) {
                      return '$100';
                    } else if (value < 1_000_000) {
                      return `$${value / 1000}K`;
                    } else {
                      return `$${value / 1_000_000}M`;
                    }
                  }
                }
              }
            ]
          },
          tooltips: {
            titleAlign: 'center',
            titleFontColor: 'rgb(37, 40, 42)',
            bodyAlign: 'center',
            backgroundColor: 'rgb(255, 255, 255)',
            bodyFontColor: 'rgb(37, 40, 42)',
            borderColor: 'rgb(235,235,235)',
            borderWidth: 2,
            xPadding: 14,
            yPadding: 14,
            displayColors: false,
            // disable built-in tooltip to add custom tooltip
            enabled: false,
            // define custom tooltip
            custom: function (tooltipModel) {
              // get tooltip element
              let tooltipEl = document.getElementById('chartjs-tooltip');

              // create element on first render
              if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = `<div id='custom-tooltip' class='py-3 px-4 bg-white rounded-lg shadow-lg border-2 border-gray-200'></div>`;
                document.body.appendChild(tooltipEl);
              }

              // hide if mouseout
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }

              // set caret position (from the docs, but not sure what this does yet)
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                tooltipEl.classList.add('no-transform');
              }

              // set text
              if (tooltipModel.body) {
                const target =
                  selectedHomeValuationData[tooltipModel.dataPoints[0].index];

                let innerHtml = `
                  <p class='font-bold text-base text-center mb-3'>${formatValuation(
                    {
                      data: target.valuation,
                      withSign: false,
                      roundToNearestThousand: true
                    }
                  )}</p>
                  <div class='flex justify-center items-center mb-1'>
                    <div class='flex justify-center items-center w-5 h-5 mr-2 rounded-full' style='background-color: rgba(66, 168, 160, 0.075);'>
                      <i class='fas fa-caret-up text-lg' style='color: rgb(66, 168, 160);'></i>
                    </div>
                    <p class='text-base'>${formatValuation({
                      data: target.valuationHigh,
                      withSign: false,
                      roundToNearestThousand: true
                    })}</p>
                  </div>
                  <div class='flex justify-center items-center'>
                    <div class='flex justify-center items-center w-5 h-5 mr-2 rounded-full' style='background-color: rgba(201, 42, 82, 0.075);'>
                      <i class='fas fa-caret-down text-lg' style='color: rgb(201, 42, 82);'></i>
                    </div>
                    <p class='text-base'>${formatValuation({
                      data: target.valuationLow,
                      withSign: false,
                      roundToNearestThousand: true
                    })}</p>
                  </div>`;

                const customTooltip = tooltipEl.querySelector(
                  '#custom-tooltip'
                );
                customTooltip.innerHTML = innerHtml;
              }

              // display and position
              // `this` will be the overall tooltip
              const position = this._chart.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = 'absolute';

              // position tooltip to the left or right, depending on index
              if (
                tooltipModel.dataPoints[0].index >=
                selectedHomeValuationData.length - 2
              ) {
                tooltipEl.style.left =
                  position.left +
                  window.pageXOffset +
                  tooltipModel.caretX -
                  165 + // this is an approximation of the tooltip width
                  'px';
              } else {
                tooltipEl.style.left =
                  position.left +
                  window.pageXOffset +
                  tooltipModel.caretX +
                  'px';
              }
              tooltipEl.style.top =
                position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.padding =
                tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
            }
          }
        }
      };

      // if chart already exists we must destroy to remove event listeners and create new chart
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = new ChartJS(ctx, config);
      } else {
        chartRef.current = new ChartJS(ctx, config);
      }
    } // TODO: what is minimum data length needed to render chart and still look good? 2?
  }, [selectedHomeValuationData]);
};
