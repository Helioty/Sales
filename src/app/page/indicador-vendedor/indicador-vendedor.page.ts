import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-indicador-vendedor',
  templateUrl: './indicador-vendedor.page.html',
  styleUrls: ['./indicador-vendedor.page.scss'],
})
export class IndicadorVendedorPage implements OnInit {

  @ViewChild("barCanvas", { static: false }) barCanvas: ElementRef;
  @ViewChild("doughnutCanvas", { static: false }) doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas", { static: false }) lineCanvas: ElementRef;
  @ViewChild("mixedCanvas", { static: false }) mixedCanvas: ElementRef;

  public barChart: Chart;
  public doughnutChart: Chart;
  public lineChart: Chart;
  public mixedChart: Chart;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 39],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });

      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: "doughnut",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
            }
          ]
        },
        options: {
          legend: {
            display: false
          }
        }
      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: "line",
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              label: "My First dataset",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 18, 56, 55, 40],
              spanGaps: false
            }
          ]
        }
      });

      this.mixedChart = new Chart(this.mixedCanvas.nativeElement, {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Bar Dataset',
            data: [10, 20, 30, 40]
          }, {
            label: 'Line Dataset',
            data: [50, 50, 50, 50],

            // Changes this dataset to become a line
            type: 'line'
          }],
          labels: ['January', 'February', 'March', 'April']
        },
        options: {
          legend: {
            display: true
          }
        }
      })
    }, 300);

  }
}
