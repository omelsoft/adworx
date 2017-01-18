<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reporting_model extends CI_Model {

	#	@params
	#	$pubid 	=> User or Publisher ID
	#	$partner 	=> Ad Partner / Ad Network (e.g. Sekindo, Adsense, AdX)
	#	$type 		=> Output format
	#	$range 		=> Date Range
	#	$start 		=> Date Start
	#	$end 		=> Date End
	#	$limit 		=> Limit per request
	#	@returns Mixed
	#
	public function generate( $pubid, $siteid, $placementid = NULL, $range = NULL, $datestart = NULL, $dateend = NULL, $type = 'array' ) {

		$this->db->select('reportDate as Date,Impressions,Clicks,eCPM,Revenue');
		$this->db->from('adx');
		$this->db->where('adx.pubId', $pubid);
		$this->db->join('placements', 'placements.id = adx.placementId');	
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->where('placements.siteId', $siteid);	
		$this->db->where('reportDate >=', $datestart);
		$this->db->where('reportDate <=', $dateend);
		//$this->db->where('placements.id', $placementid);
		$this->db->order_by('reportDate', "ASC");


		$query = $this->db->get();

		$data= $query->result();
		return $data;

	}

	#	@params
	#	$pubid 	=> User or Publisher ID
	#	$partner 	=> Ad Partner / Ad Network (e.g. Sekindo, Adsense, AdX)
	#	$type 		=> Output format
	#	$range 		=> Date Range
	#	$start 		=> Date Start
	#	$end 		=> Date End
	#	$limit 		=> Limit per request
	#	@returns Mixed
	#
	public function sekindo( $pubid, $siteid, $type = 'table', $range, $datestart, $dateend, $limit = 5 ) {

		//$this->db->select('reportDate as Date, Impressions, Clicks, eCPM, Revenue');
		$this->db->select('*');
		$this->db->from('sekindo');
		$this->db->join('placements', 'placements.id = sekindo.placementId');	
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->where('placements.siteId', $siteid);	
		$this->db->where('reportDate >=', $datestart);
		$this->db->where('reportDate <=', $dateend);
		$this->db->where('sekindo.pubId', $pubid);
		$this->db->order_by('reportDate', "ASC");

		$query = $this->db->get();

		switch ( $type ) {
			case 'table':
				$this->table->set_template($this->tableTemplate());
				$data = $this->table->generate($query);
				break;	

			case 'json':
				$data['data'] = $query->result();
				return json_encode($data);
				break;

			case 'array':
				$data = $query->result();
				return $data;
				break;

			default:
				# code...
				break;
		}

		return $data;
	}

	#	@params
	#	$pubid 	=> User or Publisher ID
	#	$partner 	=> Ad Partner / Ad Network (e.g. Sekindo, Adsense, AdX)
	#	$type 		=> Output format
	#	$range 		=> Date Range
	#	$start 		=> Date Start
	#	$end 		=> Date End
	#	$limit 		=> Limit per request
	#	@returns Mixed
	#
	public function adx( $pubid, $siteid, $type = 'table', $range = NULL, $start = NULL, $end = NULL, $limit = 5 ) {

		$this->db->select('reportDate as Date,Impressions,Clicks,eCPM,Revenue');
				
		$this->db->from('adx');
		$this->db->join('placements', 'placements.id = adx.placementId');	
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->where('placements.siteId', $siteid);	
		$this->db->where('reportDate >=', $start);
		$this->db->where('reportDate <=', $end);

		$this->db->where('adx.pubId', $pubid);
		$this->db->order_by('reportDate', "ASC");

		$query = $this->db->get();

		switch ( $type ) {
			case 'table':
				$this->table->set_template($this->tableTemplate());
				$data = $this->table->generate($query);
				break;	

			case 'json':
				$data['data'] = $query->result();
				return json_encode($data);
				break;

			case 'array':
				$data = $query->result();
				return $data;
				break;

			default:
				# code...
				break;
		}

		return $data;
	}

	#	@params
	#	$pubid 	=> User or Publisher ID
	#	$partner 	=> Ad Partner / Ad Network (e.g. Sekindo, Adsense, AdX)
	#	$type 		=> Output format
	#	$range 		=> Date Range
	#	$start 		=> Date Start
	#	$end 		=> Date End
	#	$limit 		=> Limit per request
	#	@returns Mixed
	#
	public function adsense( $pubid, $siteid, $type = 'table', $range = NULL, $start = NULL, $end = NULL, $limit = 5 ) {

		$this->db->select('reportDate as Date,Impressions,Clicks,eCPM,Revenue');
		$this->db->from('adsense');
		$this->db->join('placements', 'placements.id = adsense.placementId');	
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->where('placements.siteId', $siteid);	
		$this->db->where('reportDate >=', $start);
		$this->db->where('reportDate <=', $end);

		$this->db->where('adsense.pubId', $pubid);
		$this->db->order_by('reportDate', 'ASC');

		$query = $this->db->get();

		switch ( $type ) {
			case 'table':
				$this->table->set_template($this->tableTemplate());
				$data = $this->table->generate($query);
				break;	

			case 'json':
				$data['data'] = $query->result();
				return json_encode($data);
				break;

			case 'array':
				$data = $query->result();
				return $data;
				break;

			default:
				# code...
				break;
		}

		return $data;
	}

	public function addNew( $partner, $data ) {
		$this->db->insert('partners', $data);	
		$id = $this->db->insert_id();

		$result = $this->db->get_where('partners', array('id' => $id));
		return json_encode($result->row());		
	}


	public function results($page)
	{
		$this->db->limit(5, ($page - 1) * 5);
		$query = $this->db->get("partners");
		$data['data'] = $query->result();
		$data['total'] = $this->db->count_all("partners");

		return json_encode($data);		
	}

	public function store($data)
    {
		$this->db->insert('partners', $data);	
		$id = $this->db->insert_id();

		$result = $this->db->get_where('partners', array('id' => $id));
		return json_encode($result->row());
    }

    public function edit($id)
    {
		$result = $this->db->get_where('partners', array('id' => $id));

		return json_encode($result->row());
    }

    public function update($id, $data)
    {
    	$this->db->where('id', $id);
    	$this->db->update('partners', $data);

        $result = $this->db->get_where('partners', array('id' => $id));
		return json_encode($result->row());
    }

    public function delete($id)
    {
        $this->db->where('id', $id);
		$this->db->delete('partners');

		return json_encode(['success'=>true]);
    }




    #Returns all publishers
    public function publishers($page) {

		$this->db->select('id,fullname,email,type,timezone');
		$this->db->from('users');
		$this->db->where('type', 'publisher');
		$this->db->limit(5, ($page - 1) * 5);

		$query = $this->db->get();
		$data['publishers'] = $query->result();
		$data['total'] = $this->db->count_all_results();
		return json_encode($data);
	}


	public function addNewReport($data, $partner) {

		$this->db->insert($partner, $data);

		return $data;	

	}

	#
	#	Updates selected reporting date
	#
	public function updateReportByPlacement()
	{
		$data = json_decode($this->input->post_get('data'), true);
		$partner = $this->input->post_get('partner');

		# If data is an object, batch edit mode
		if ( count($data) == 1 ) {
			
			$data = $data['data'];
			foreach ($data as $row) {
				$insert = array(
					'Impressions' 	=> $row['Impressions'],
					'Clicks'		=> $row['Clicks'],
					'eCPM'			=> $row['eCPM'],
					'Revenue'		=> $row['Revenue']
				);
				$this->db->where('id', $row['id']);
	    		$this->db->update($partner, $insert);
			}

			return $data;

		} else {

			# Single record edit
			$insert = array(
				'Impressions' 	=> $data['Impressions'],
				'Clicks'		=> $data['Clicks'],
				'eCPM'			=> $data['eCPM'],
				'Revenue'		=> $data['Revenue']
	 		);

	    	$this->db->where('id', $data['id']);
	    	$this->db->update($partner, $insert);

			$this->db->reset_query();
			$this->db->select($partner.'.id, reportDate as Date, Impressions, Clicks, eCPM, Revenue');
			$this->db->from($partner);
			$this->db->where('id', $data['id']);

			$result = $this->db->get();
			return $result->row();					    	
		}

	}


	function tableTemplate() {
		$template = array(
		        'table_open'            => '<table id="dynatable" class="table table-hover" border="0" cellpadding="4" cellspacing="0">',
		        'thead_open'            => '<thead>',
		        'thead_close'           => '</thead>',
		        'heading_row_start'     => '<tr>',
		        'heading_row_end'       => '</tr>',
		        'heading_cell_start'    => '<th class="header">',
		        'heading_cell_end'      => '</th>',
		        'tbody_open'            => '<tbody>',
		        'tbody_close'           => '</tbody>',
		        'row_start'             => '<tr>',
		        'row_end'               => '</tr>',
		        'cell_start'            => '<td>',
		        'cell_end'              => '</td>',
		        'row_alt_start'         => '<tr>',
		        'row_alt_end'           => '</tr>',
		        'cell_alt_start'        => '<td>',
		        'cell_alt_end'          => '</td>',
		        'table_close'           => '</table>'
		);
		return $template;		
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
                $data_range['end'] = $date;
                break;
            case 'Yesterday':
                $datesub = date_sub(new DateTime($date), date_interval_create_from_date_string("1 days"));
                $data_range['start'] = date_format($datesub, 'Y-m-d');
                $data_range['end'] = date_format($datesub, 'Y-m-d');
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
                $data_range['end']  = $end;            
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
    
}
