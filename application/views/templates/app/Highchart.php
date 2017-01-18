<?php
$reports = $report['reports'];

foreach ($reports as $report => $partner) {
    $data['title'] = $partner['title'];
    $data['date'] = $partner['date'];
    $data['impressions'] = $partner['impressions'];
    $data['ecpm'] = $partner['ecpm'];
    $data['revenue'] = $partner['revenue'];
    $data['clicks'] = $partner['clicks'];
}
?>
<script>
    Highcharts.chart('container', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: <?php echo json_encode($data['title']) ?> 
        },
        subtitle: {
            text: 'Sekindo'
        },
        xAxis: [{
            categories: <?php echo json_encode($data['date']) ?>,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '$ {value}',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: 'Revenue',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'eCPM',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '$ {value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }

        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Impressions',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'eCPM',
            type: 'column',
            yAxis: 1,
            data: <?php echo json_encode($data['ecpm']) ?>,
            tooltip: {
                valueSuffix: ' $'
            }

        }, {
            name: 'Impressions',
            type: 'spline',
            yAxis: 2,
            data: <?php echo json_encode($data['impressions']) ?>,
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Earnings',
            type: 'spline',
            data: <?php echo json_encode($data['revenue']) ?>,
            tooltip: {
                valueSuffix: ' $'
            }
        }]
    });
</script>