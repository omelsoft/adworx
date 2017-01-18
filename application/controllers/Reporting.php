<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reporting extends CI_Controller {

    public function index() {

    	$data = array(
    			"page" => "_blank"
    		);
    	echo json_encode( $data, true);
    }

    public function generateReport()
    {
        $user = $this->session->userdata('logged_in');
        if ( ! $user ) return;

        $filters = json_decode($this->input->post_get('data'), true);

        $pubid = $filters['pubId'];
        $siteid = $filters['siteId'];
        $placementid = $filters['placementId'];
        $range = $filters['range'] ? $filters['range'] : 'Last 30 Days';
        $start = $filters['start'] ? $filters['start'] : '';
        $end = $filters['end'] ? $filters['end'] : '';

        # Get all publisher's sites
        $sites = $this->modSites->listAllSites($pubid);

        # Get all active partners
        $partners = $this->modPartners->getAllPartners($pubid);

        $range = $this->range(urldecode($range), $start, $end);
        
        $data = $this->modReports->generate($pubid, $siteid, $placementid, '', $range['start'], $range['end']);

        if ( $sites ) {
            foreach ($sites as $site => $property) {
                if ( $property->id == $siteid ) {
                    if ( $partners ) {
                        # Generate report data for each partner
                        foreach ($partners as $partner => $data) {
                            switch ( $data->alias ) {
                                case 'sekindo':
                                    $data = $this->modReports->sekindo($pubid, $property->id, 'array', '', $range['start'], $range['end']);
                                    $reportsData['sekindo'] = ( $data ) ? $this->sekindo($data, 'array', $range) : $this->noReport('Sekindo');
                                    $sitesData[$property->siteName]['sekindo'] = $reportsData['sekindo'];
                                    break;
                                case 'adx':
                                    $data = $this->modReports->adx($pubid, $property->id, 'array', '', $range['start'], $range['end']);
                                    $reportsData['adx'] = ( $data ) ? $this->adx($data, 'array', $range) : $this->noReport('AdX');
                                    $sitesData[$property->siteName]['adx'] = $reportsData['adx'];
                                    break;

                                case 'adsense':
                                    $data = $this->modReports->adsense($pubid, $property->id, 'array', '', $range['start'], $range['end']);
                                    $reportsData['adsense'] = ( $data ) ? $this->adsense($data, 'array', $range) : $this->noReport('Adsense');
                                    $sitesData[$property->siteName]['adsense'] = $reportsData['adsense'];
                                    break;
                            }           
                        }            
                    } else {
                        $reportsData['nodata'] = $this->noReport('No Ad Partner', 'No Data Available');
                        $sitesData[$property->siteName]['nodata'] = $reportsData['nodata'];
                    }         
                }
            }

        } else {
            $reportsData['nodata'] = $this->noReport('No Ad Partner', 'No Data Available');
            $sitesData['nodata'] = $reportsData['nodata'];
        }

        $reports['reports'] = $sitesData;

        echo json_encode($reports);
    }

    public function display() {
        $user = $this->session->userdata('logged_in');
        if ( ! $user ) return;

        $filters = json_decode($this->input->post_get('data'), true);

        $pubid = $filters['pubId'];
        $range = $filters['range'];
        $start = $filters['start'];
        $end = $filters['end'];

        # Get all publisher's sites
        $sites = $this->modSites->listAllSites($pubid);

        # Get all active partners
        $partners = $this->modPartners->getAllPartners($pubid);

        $range = $this->range(urldecode($range), $start, $end);

        $sitesData = array();

        if ( $sites ) {

            foreach ($sites as $site => $property) {

                if ( $partners ) {
                    # Generate report data for each partner
                    foreach ($partners as $partner => $data) {
                        switch ( $data->alias ) {
                            case 'sekindo':
                                $data = $this->modReports->sekindo($pubid, $property->id, 'array', '', $range['start'], $range['end']);
                                if ( $data ) {
                                    $reportsData['sekindo'] = $this->sekindo($data, 'array', $range);
                                    $sitesData[$property->siteName]['sekindo'] = $reportsData['sekindo'];
                                }
                                break;
                            case 'adx':
                                $data = $this->modReports->adx($pubid, $property->id, 'array', '', $range['start'], $range['end']);
                                if ( $data ) {
                                    $reportsData['adx'] = $this->adx($data, 'array', $range);
                                    $sitesData[$property->siteName]['adx'] = $reportsData['adx'];
                                }
                                break;

                            case 'adsense':
                                $data = $this->modReports->adsense($pubid, $property->id, 'array', '', $range['start'], $range['end']);
                                if ( $data ) {
                                    $reportsData['adsense'] = $this->adsense($data, 'array', $range);
                                    $sitesData[$property->siteName]['adsense'] = $reportsData['adsense'];
                                }
                                break;
                        }           
                    }
                    if ( count($sitesData) < 1 ) {
                        $reportsData['nodata'] = $this->noReport('No Ad Partner', 'No Data Available');
                        $sitesData['No Data Available']['nodata'] = $reportsData['nodata'];
                    }
                } else {
                    $reportsData['nodata'] = $this->noReport('No Ad Partner', 'No Data Available');
                    $sitesData[$property->siteName]['nodata'] = $reportsData['nodata'];
                }         

            }

        } else {
            $reportsData['nodata'] = $this->noReport('No Ad Partner', 'No Data Available');
            $sitesData['No Data Available']['nodata'] = $reportsData['nodata'];
        }

        $reports['reports'] = $sitesData;
        echo json_encode($reports);
        //$this->generateReportChart($reports);
    }

    private function noReport($partner, $range = 'Year To Date'){

        $report['title'] = $partner;
        $report['subTitle'] = $range;
        $report['date'] = array();
        $report['impressions'] = array();
        $report['clicks'] = array();
        $report['revenue'] = array();
        $report['ecpm'] = array();

        return $report;
    }

    private function sekindo($data, $type, $range) {
        switch ( $type ) {
            case 'array':
                
                foreach ($data as $row ) {
                    $date[] = $row->reportDate;
                    $impressions[] = $row->Impressions;
                    $clicks[] = $row->Clicks;
                    $revenue[] = $row->Revenue;
                    $ecpm[] = $row->eCPM;
                }                 

                break;
            
            default:
                # code...
                break;
        }

        $report['title'] = 'Sekindo';
        $report['subTitle'] = $range;
        $report['date'] = $date;
        $report['impressions'] = $impressions;
        $report['clicks'] = $clicks;
        $report['revenue'] = $revenue;
        $report['ecpm'] = $ecpm;

        return $report;
    }

    private function adx($data, $type, $range) {
        switch ( $type ) {
            case 'array':
                
                foreach ($data as $row ) {
                    $date[] = $row->Date;
                    $impressions[] = $row->Impressions;
                    $clicks[] = $row->Clicks;
                    $revenue[] = $row->Revenue;
                    $ecpm[] = $row->eCPM;
                }                 

                break;
            
            default:
                # code...
                break;
        }

        $report['title'] = 'AdX';
        $report['subTitle'] = $range;
        $report['date'] = $date;
        $report['impressions'] = $impressions;
        $report['clicks'] = $clicks;
        $report['revenue'] = $revenue;
        $report['ecpm'] = $ecpm;

        //$report['reports'] = $report;
        return $report;
    }

    private function adsense($data, $type, $range) {
        switch ( $type ) {
            case 'array':
                
                foreach ($data as $row ) {
                    $date[] = $row->Date;
                    $impressions[] = $row->Impressions;
                    $clicks[] = $row->Clicks;
                    $revenue[] = $row->Revenue;
                    $ecpm[] = $row->eCPM;
                }                 

                break;
            
            default:
                # code...
                break;
        }

        $report['title'] = 'Adsense';
        $report['subTitle'] = $range;
        $report['date'] = $date;
        $report['impressions'] = $impressions;
        $report['clicks'] = $clicks;
        $report['revenue'] = $revenue;
        $report['ecpm'] = $ecpm;

        //$report['reports'] = $report;
        return $report;
    }
    public function addNew( $partner,  $pubid ) {
    	$reportDate 	= $this->input->get('reportDate');
    	$impressions 	= $this->input->get('impressions');
    	$clicks 		= $this->input->get('clicks');
    	$eCPM 			= $this->input->get('ecpm');
    	$revenue 		= $this->input->get('revenue');
    	$data = array(
    		'id' 			=>	'',
    		'pubId' 		=>	$pubid,
    		'reportDate'	=>	$reportDate,
    		'Impressions'	=>	$impressions,
    		'Clicks'		=>	$clicks,
    		'eCPM'			=>	$eCPM,
    		'Revenue'		=>	$revenue
    	);
    }

    public function addNewReport() {
        $data = json_decode($this->input->post_get('data'), true);
        $partner = $this->input->post_get('partner');

        $insert = array(
            'pubId'         => $data['pubId'],
            'reportDate'    => $data['Date'],
            'placementId'   => $data['placementid'],
            'Impressions'   => $data['Impressions'],
            'Clicks'        => $data['Clicks'],
            'eCPM'          => $data['eCPM'],
            'Revenue'       => $data['Revenue']
        );

        echo json_encode($this->modReports->addNewReport($insert, $partner));      
    }

    public function reportFilters($pubid) {

        $filters['sites'] = $this->modSites->listAllSites($pubid);
        $filters['partners'] = $this->modPartners->getAllPartners($pubid);
        $filters['placements'] = $this->modPlacements->getAllPlacements($pubid);

        echo json_encode($filters);
    }

    public function range($range, $start = NULL, $end = NULL)
    {
        $thedate = new DateTime();
        $date = date_format($thedate, 'Y-m-d');

        $data_range = array(
            'start' => NULL,
            'end'   => NULL
        );

        switch ( $range ) {
            case 'Today':
                $data_range['start'] = $date;
                break;
            case 'Yesterday':
                $datesub = date_sub(new DateTime($date), date_interval_create_from_date_string("1 days"));
                $data_range['start'] = date_format($datesub, 'Y-m-d');
                break;          
            case 'This Week':
                $w_start = $this->getDay('Monday');
                $w_end = $this->getDay('Sunday');

                $start = date_format(new DateTime($w_start), 'Y-m-d');
                $end = date_format(new DateTime($w_end), 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $end;
                break;              
            case 'Last Week':
                $this_week = $this->getDay('Monday');

                $datesub_start = date_sub(new DateTime($this_week), date_interval_create_from_date_string("7 days"));
                $datesub_end = date_sub(new DateTime($this_week), date_interval_create_from_date_string("1 days"));

                $start = date_format($datesub_start, 'Y-m-d');
                $end = date_format($datesub_end, 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $end;
                break;              
            case 'Last 7 Days':
                $datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("7 days"));

                $start = date_format($datesub_start, 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $date;
                break;              
            case 'Last 14 Days':
                $datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("14 days"));

                $start = date_format($datesub_start, 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $date;
                break;              
            case 'Last 30 Days':
                $datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("30 days"));

                $start = date_format($datesub_start, 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $date;
                break;  
            case 'Last 60 Days':
                $datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("60 days"));

                $start = date_format($datesub_start, 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $date;
                break;                              
            case 'This Month':
                $month = date_format(new DateTime(), 'm' );
                $year = date_format(new DateTime(), 'Y' );

                $data_range['start'] = $year.'-'.$month.'-'.'01';
                $data_range['end']  = $year.'-'.$month.'-'.days_in_month($month, $year);
                break;  
            case 'Last Month':
                $month = date_format(new DateTime(), 'm' );
                $year = date_format(new DateTime(), 'Y' );

                if ($month == 1) {
                    $month = 12;
                    $year = $year - 1;
                } else {
                    $month = $month - 1;
                }

                $data_range['start'] = $year.'-'. $month.'-'.'01';
                $data_range['end']  = $year.'-'. $month.'-'.days_in_month($month, $year);
                break;                          

            case 'Custom':
                $data_range['start'] = $start;
                $data_range['end'] = $end;
                break;

            default:
                $datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("30 days"));

                $start = date_format($datesub_start, 'Y-m-d');

                $data_range['start'] = $start;
                $data_range['end']  = $date;
                break;
        }
        return $data_range;
    }

    #http://php.net/manual/en/function.cal-days-in-month.php
    function days_in_month($month, $year) 
    { 
        return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31); 
    }

    #From http://stackoverflow.com/questions/1431631/get-date-for-monday-and-friday-for-the-current-week-php
    function getDay($day)
    {
        $days = ['Monday' => 1, 'Tuesday' => 2, 'Wednesday' => 3, 'Thursday' => 4, 'Friday' => 5, 'Saturday' => 6, 'Sunday' => 7];

        $today = new \DateTime();
        $today->setISODate((int)$today->format('o'), (int)$today->format('W'), $days[ucfirst($day)]);
        return date_format($today, 'Y-m-d');
    }

    private function generateReportChart($reports) {
        $data['report'] = $reports;
        $highchart = $this->load->view('templates/app/Highchart', $data);
    }
}