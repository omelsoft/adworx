<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Filters extends CI_Controller {

	function index($range, $start = NULL, $end = NULL)
	{
		$thedate = new DateTime();
		$date = date_format($thedate, 'Y-m-d');

		$data_range = array(
			'start' => NULL,
			'end'	=> NULL
		);

		switch ( $range ) {
			case 'today':
				$data_range['start'] = $date;
				break;
			case 'yesterday':
				$datesub = date_sub(new DateTime($date), date_interval_create_from_date_string("1 days"));
				$data_range['start'] = date_format($datesub, 'Y-m-d');
				break;			
			case 'this_week':
				$w_start = $this->dashboard->getDay('Monday');
				$w_end = $this->dashboard->getDay('Sunday');

				$start = date_format(new DateTime($w_start), 'Y-m-d');
				$end = date_format(new DateTime($w_end), 'Y-m-d');

				$data_range['start'] = $start;
				$data_range['end']  = $end;
				break;				
			case 'last_week':
				$this_week = $this->dashboard->getDay('Monday');

				$datesub_start = date_sub(new DateTime($this_week), date_interval_create_from_date_string("7 days"));
				$datesub_end = date_sub(new DateTime($this_week), date_interval_create_from_date_string("1 days"));

				$start = date_format($datesub_start, 'Y-m-d');
				$end = date_format($datesub_end, 'Y-m-d');

				$data_range['start'] = $start;
				$data_range['end']  = $end;
				break;				
			case 'last_7_days_and_today':
				$datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("7 days"));

				$start = date_format($datesub_start, 'Y-m-d');

				$data_range['start'] = $start;
				$data_range['end']  = $date;
				break;				
			case 'last_14_days_and_today':
				$datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("14 days"));

				$start = date_format($datesub_start, 'Y-m-d');

				$data_range['start'] = $start;
				$data_range['end']  = $date;
				break;				
			case 'last_30_days_and_today':
				$datesub_start = date_sub(new DateTime($date), date_interval_create_from_date_string("30 days"));

				$start = date_format($datesub_start, 'Y-m-d');

				$data_range['start'] = $start;
				$data_range['end']  = $date;
				break;				
			case 'this_month':
				$month = date_format(new DateTime(), 'm' );
				$year = date_format(new DateTime(), 'Y' );

				$data_range['start'] = $year.'-'.$month.'-'.'01';
				$data_range['end']  = $year.'-'.$month.'-'.days_in_month($month, $year);
				break;	
			case 'last_month':
				$month = date_format(new DateTime(), 'm' );
				$year = date_format(new DateTime(), 'Y' );

				if ($month == 1) {
					$month = 12;
					$year -= $year;
				} else {
					$month = $month - 1;
				}

				$data_range['start'] = $year.'-'. $month.'-'.'01';
				$data_range['end']  = $year.'-'. $month.'-'.days_in_month($month, $year);
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

}