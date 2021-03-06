app.controller('OverviewController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.data = [];
    $scope.reports = [];
    $scope.metric = 'Revenue';
    $scope.metrics = ['eCPM', 'Impressions', 'Revenue'];
    $scope.overall = {
        ecpm: 0,
        impressions: 0,
        revenue: 0
    };
    $scope.filter = {
        'site': '',
        'siteId': 0,
        'partner': '',
        'placement': '',
        'placementId': 0,
        'placementBySite': [],
        'placementByPartner': [],
        'placementFiltered': [],
        'filteredSite': false,
        'filteredPartner': false
    };
    $scope.setActiveMenu('overview');

    init();

    function init() {
        rangeFilter();
        initReportFilters();
        generateReports();
    }

    function initReportFilters() {
        var filter = $scope.filter;

        filter.site = 'All Sites';
        filter.partner = 'All Partners';
        filter.placement = 'Overall';

        dataFactory.httpRequest('app/../reporting/reportFilters/' + $scope.pubId).then(function(filters) {
            $scope.filters = filters;
        });
    }

    $scope.filterBySite = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (index != undefined && id != undefined) {
            filter.site = $scope.filters.sites[index]['siteName'];

            $scope.filter.placementBySite = [];

            if (filter.partnerId) {
                filter.placementBySite = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id && (placements[placement]['partnerId']) == filter.partnerId) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.siteId = id;
            filter.placement = 'Overall';
            filter.filteredSite = true;

            filterBySite($scope.pubId, filter.siteId, filter.placementId, $scope.filter.range);

        } else {
            filter.site = 'All Sites';
            $scope.filter.placementBySite = [];
            filter.siteId = '';
            filter.filteredSite = false;
            generateReports();
        }

        console.log(filter);
    }

    function filterBySite(pubid, siteid, placementid, range) {
        dataFactory.httpRequest('app/../reporting/generateReport/' + pubid + '/' + siteid + '/' + placementid + '/' + range).then(function(response) {
            $scope.data = response;
            $scope.reports = response.reports;
            console.log(response);
            defaultPropertiesGraph(response);
        });
    }

    $scope.filterByPartner = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (index != undefined && id != undefined) {
            filter['partner'] = $scope.filters.partners[index]['name'];

            $scope.filter.placementByPartner = [];

            if (filter.siteId) {
                filter.placementByPartner = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if (placements[placement]['partnerId'] == id && (placements[placement]['siteId']) == filter.siteId) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }

            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['partnerId']) == id) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.partnerId = id;
            filter.placement = 'Overall';
            filter.filteredPartner = true;

        } else {
            filter.partner = 'All Partners';
            $scope.filter.placementByPartner = [];
            filter.partnerId = '';
            filter.filteredPartner = false;
        }
        // console.log(filter);
    }

    $scope.filterByPlacement = function(placement) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (placement != undefined) {
            filter['placement'] = placement['placementName'];

            $scope.filter.placementId = placement['placementId'];

        } else {
            filter['placement'] = 'All Placements';
            filter.placementId = '';
        }
        // console.log(placement);
    }

    $scope.filterByRange = function(range, start, end) {
        $scope.filter.range = range;
        console.log($scope.filter.siteId);
        if ($scope.filter.siteId) {
            filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range);
        } else {
            generateReports();
        }
    }

    function rangeFilter() {
        var ranges = [
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Last 7 Days',
            'Last 14 Days',
            'Last 30 Days',
            'Last 60 Days',
            'Last Month',
            'This Month',
            'Custom'
        ];
        $scope.filter.ranges = ranges;
        $scope.filter.range = 'Last 30 Days';
    }

    function generateReports() {
        dataFactory.httpRequest('app/../reporting/display/' + $scope.pubId + '/' + $scope.filter.range).then(function(data) {
            $scope.data = data;
            $scope.reports = data.reports;
            defaultPropertiesGraph(data);
        });
    }

    function prepareReports() {
        var data = $scope.reports;
        var reports = [],
            count = 0;

        for (var report in data) {
            count = count + 1;
            reports[count] = data[report];
        }
        if (count <= 1) {
            var report = reports[1];
            plotData(report);
        } else {
            plotData(data, count, true);
        }
    }

    $scope.filterByMetric = function(metric) {
        $scope.metric = metric;
        defaultPropertiesGraph($scope.data);
    }

    function defaultPropertiesGraph(data) {

        $scope.property = [];

        var p = $scope.property;
        var reports = data.reports;
        var property = [];
        var properties = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertyData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var partnerData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertySeries = [];
        var propertyYAxis = [];

        for (var sites in reports) {
            p.push(sites);
        }

        if (p.length) {

            for (var i = 0; i < p.length; i++) {
                // Iterate tru each property
                property[p[i]] = {
                    site: p[i],
                    partners: reports[p[i]]
                }
            }
            console.log(property);
        }

        for (var site in property) {
            var partners = property[site].partners;
            var date = [],
                impressions = [],
                ecpm = [],
                revenue = [];

            for (var partner in partners) {
                var r = partners[partner];

                for (var d = 0; d < r.date.length; d++) {

                    var imps = parseFloat(r.impressions[d]),
                        rev = roundToTwo(parseFloat(r.revenue[d]));

                    date[d] = r.date[d];
                    impressions[d] = (parseFloat(impressions[d]) ? parseFloat(impressions[d]) : 0) + parseFloat(imps);
                    revenue[d] = roundToTwo((parseFloat(revenue[d]) ? roundToTwo(parseFloat(revenue[d])) : 0) + roundToTwo(rev));

                    var cpm = parseFloat(revenue[d]) / (parseFloat(impressions[d]) / 1000);
                    ecpm[d] = isNaN(parseFloat(cpm)) ? 0 : roundToTwo(parseFloat(cpm));

                }

                partnerData.date.push(date);
                partnerData.ecpm.push(ecpm);
                partnerData.impressions.push(impressions);
                partnerData.revenue.push(revenue);

            }

            propertyData.date.push(date);
            propertyData.ecpm.push(ecpm);
            propertyData.impressions.push(impressions);
            propertyData.revenue.push(revenue);

        }

        var propData = [],
            idx = 0;

        for (var ps in property) {
            propData.push({
                site: ps,
                date: propertyData.date[idx],
                data: {
                    'ecpm': propertyData.ecpm[idx],
                    'impressions': propertyData.impressions[idx],
                    'revenue': propertyData.revenue[idx],
                    overall: {
                        revenue: parseFloat(propertyData.revenue[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0).toFixed(2)),
                        impressions: propertyData.impressions[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0)
                    }
                }
            });
            idx = idx + 1;
        }

        $scope.overall = {
            revenue: 0,
            impressions: 0,
            ecpm: 0
        }

        for (var series in propData) {

            switch ($scope.metric) {
                case 'Revenue':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'spline',
                        yAxis: 1,
                        data: propData[series].data.revenue,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'eCPM':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'spline',
                        yAxis: 1,
                        data: propData[series].data.ecpm,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'Impressions':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'spline',
                        yAxis: 1,
                        data: propData[series].data.impressions,
                        tooltip: {
                            valuePrefix: ''
                        }
                    });
                    break;
            }

            var or = propData[series].data.overall.revenue,
                oi = parseFloat(propData[series].data.overall.impressions);

            $scope.overall.revenue = parseFloat($scope.overall.revenue) ? parseFloat($scope.overall.revenue) + or : or;
            $scope.overall.impressions = parseFloat($scope.overall.impressions) ? parseFloat($scope.overall.impressions + oi) : oi;

            var oe = parseFloat(roundToTwo(isNaN($scope.overall.revenue / ($scope.overall.impressions / 1000)) ? 0 : $scope.overall.revenue / ($scope.overall.impressions / 1000)));
            $scope.overall.ecpm = oe;

        }
        console.log($scope.overall);

        switch ($scope.metric) {
            case 'Revenue':
                propertyYAxis.push({ // Primary yAxis
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

                });
                break;

            case 'eCPM':
                propertyYAxis.push({ // Secondary yAxis
                    gridLineWidth: 0,
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: 'eCPM',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
                });
                break;

            case 'Impressions':
                propertyYAxis.push({ // Tertiary yAxis
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
                });
                break;
        }

        var range = $scope.filter.range;
        var site = $scope.filter.site;
        var metric = $scope.metric;

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: site
            },
            subtitle: {
                text: range
            },
            xAxis: [{
                categories: propData[0].date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: metric,
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                }
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 55,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: propertySeries,
            credits: {
                enabled: false
            }
        });
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    function plotData(report, count, overall) {

        var date = [],
            impressions = [],
            ecpm = [],
            revenue = [];
        if (overall == true && count >= 2) {

            for (var r in report) {
                p = report[r];
                for (var i = 0; i < p.date.length; i++) {
                    date[i] = p.date[i];
                    impressions[i] = (Number(impressions[i]) ? Number(impressions[i]) : 0) + Number(p.impressions[i]);
                    revenue[i] = (Number(revenue[i]) ? Number(revenue[i]) : 0) + Number(p.revenue[i]);
                    ecpm[i] = Number(revenue[i] / (impressions[i] / 1000));
                }
            }

            // report.title = ['Overall'];
            // report.subTitle = ['Year To Date'];
            // console.log(report);
        } else {
            // console.log(report);
            for (var i = 0; i < report.date.length; i++) {
                date[i] = report.date[i];
                impressions[i] = Number(report.impressions[i]);
                ecpm[i] = Number(report.ecpm[i]);
                revenue[i] = Number(report.revenue[i]);
            }
        }

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: report.title
            },
            subtitle: {
                text: report.subTitle
            },
            xAxis: [{
                categories: date,
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
                    text: 'Earnings',
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
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 55,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'eCPM',
                type: 'spline',
                yAxis: 1,
                data: ecpm,
                tooltip: {
                    valuePrefix: '$ '
                }
            }, {
                name: 'Impressions',
                type: 'spline',
                yAxis: 2,
                data: impressions,
                marker: {
                    enabled: true
                },
                tooltip: {
                    valueSuffix: ''
                }

            }, {
                name: 'Earnings',
                type: 'spline',
                data: revenue,
                tooltip: {
                    valuePrefix: '$ '
                }
            }]
        });
    }

}]);
