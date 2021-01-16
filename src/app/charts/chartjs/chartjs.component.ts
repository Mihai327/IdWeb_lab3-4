import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-chartjs',
    templateUrl: './chartjs.component.html',
    styleUrls: ['./chartjs.component.scss']
})
export class ChartjsComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    ChartColors = [
        {
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255,99,132,1)'
        },
        {
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)'
        },
        {
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)'
        },
        {
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)'
        },
        {
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)'
        },
        {
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)'
        }
    ];
    Chartlabels = ['2013', '2014', '2014', '2015', '2016', '2017'];
    ChartData = [
        {
            label: '# of Votes',
            data: [10, 19, 3, 5, 2, 3],
            borderWidth: 1
        }
    ];
    ChartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            }]
        },
        elements: {
            point: {
                radius: 0
            }
        }
    };


    lineChartData = [
        {
            label: '# of Votes',
            data: [10, 19, 3, 5, 2, 3],
            borderWidth: 1,
            fill: false
        }
    ];


    doughnutChartlabels = ['Pink', 'Blue', 'Yellow'];
    doughnutChartData = [
        {
            data: [30, 40, 30]
        }
    ];
    doughnutChartOptions = {
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };


    scatteredChartlabels = ['Pink', 'Blue', 'Yellow'];
    scatteredChartData = [{
        label: 'First Dataset',
        data: [{
            x: -10,
            y: 0
        },
            {
                x: 0,
                y: 3
            },
            {
                x: -25,
                y: 5
            },
            {
                x: 40,
                y: 5
            }],
        borderWidth: 1
    },
        {
            label: 'Second Dataset',
            data: [{
                x: 10,
                y: 5
            },
                {
                    x: 20,
                    y: -30
                },
                {
                    x: -25,
                    y: 15
                },
                {
                    x: -10,
                    y: 5
                }
            ],
            borderWidth: 1
        }];
    scatteredChartOptions = {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    };
}
