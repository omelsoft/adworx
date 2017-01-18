<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Placements_model extends CI_Model {

	#
	#	List all active sites for the selected publisher
	#	
	public function listPlacements( $pubid, $page ) {
		$this->db->select('placements.id, partners.name, partners.alias, placements.placementName, sites.siteName, sites.siteUrl');
		$this->db->from('placements');
		$this->db->join('partners', 'partners.id = placements.partnerId');
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->order_by('sites.siteName', 'ASC');
		$this->db->order_by('partners.name', 'ASC');
		$this->db->order_by('placements.id', 'ASC');
		$this->db->where('sites.pubId', $pubid);		
		$this->db->limit(5, ($page - 1) * 5);

		$query = $this->db->get();
		$data['pubPlacements'] = $query->result();
		$data['total'] = $this->count($pubid);
		return json_encode($data, true);		
	}

	#
	#	List all active sites for the selected publisher
	#	
	public function listPlacementsBySite( $pubid, $siteid, $partnerid, $page ) {
		$this->db->select('placements.id, partners.name, partners.alias, placements.placementName, sites.siteName, sites.siteUrl');
		$this->db->from('placements');
		$this->db->join('partners', 'partners.id = placements.partnerId');
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->order_by('sites.siteName', 'ASC');
		$this->db->order_by('partners.name', 'ASC');
		$this->db->order_by('placements.id', 'ASC');
		$this->db->where('sites.pubId', $pubid);	
		$this->db->where('placements.siteId', $siteid);

		if ($partnerid)
			$this->db->where('placements.partnerId', $partnerid);

		$this->db->limit(5, ($page - 1) * 5);

		$query = $this->db->get();
		$data['pubPlacements'] = $query->result();
		if ($partnerid)
			$data['total'] = $this->countBySitePartner($pubid, $siteid, $partnerid);
		else
			$data['total'] = $this->countBySite($pubid, $siteid);
		return json_encode($data, true);		
	}

	#
	#	List all active sites for the selected publisher and partner
	#	
	public function listPlacementsByPartner( $pubid, $siteid, $partnerid, $page ) {
		$this->db->select('placements.id, partners.name, partners.alias, placements.placementName, sites.siteName, sites.siteUrl');
		$this->db->from('placements');
		$this->db->join('partners', 'partners.id = placements.partnerId');
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->order_by('sites.siteName', 'ASC');
		$this->db->order_by('partners.name', 'ASC');
		$this->db->order_by('placements.id', 'ASC');
		$this->db->where('sites.pubId', $pubid);	
		$this->db->where('placements.siteId', $siteid);
		$this->db->where('placements.partnerId', $partnerid);
		$this->db->limit(5, ($page - 1) * 5);

		$query = $this->db->get();
		$data['pubPlacements'] = $query->result();
		$data['total'] = $this->countBySitePartner($pubid, $siteid, $partnerid);
		return json_encode($data, true);		
	}

	#
	#	Returns @object
	#	Placement filters
	#	
	public function getAllPlacements( $pubid ) {
		$this->db->select('placements.id as placementId, placements.placementName, partners.id as partnerId, partners.name as partnerName, partners.alias, sites.id as siteId, sites.siteName');
		$this->db->from('placements');
		$this->db->join('partners', 'partners.id = placements.partnerId');
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->order_by('sites.siteName', 'ASC');
		$this->db->order_by('partners.name', 'ASC');
		$this->db->order_by('placements.id', 'ASC');
		$this->db->where('sites.pubId', $pubid);		

		$query = $this->db->get();
		
		return $query->result();		
	}

	#
	#	Returns @object
	#	Placement filters
	#	
	public function allPlacements( $pubid ) {
		$this->db->select('placements.id, placements.placementName, partners.id as partnerId, partners.name, partners.alias, sites.id as siteId, sites.siteName');
		$this->db->from('placements');
		$this->db->join('partners', 'partners.id = placements.partnerId');
		$this->db->join('sites', 'sites.id = placements.siteId');
		$this->db->order_by('sites.siteName', 'ASC');
		$this->db->order_by('partners.name', 'ASC');
		$this->db->order_by('placements.id', 'ASC');
		$this->db->where('sites.pubId', $pubid);		

		$query = $this->db->get();
		
		return $query->result();		
	}

	public function addNewPlacement( $data ) {
		$this->db->insert('placements', $data);	
		$id = $this->db->insert_id();		

		return $id;	
	}

	#	Count All Placements
	#
	public function count($pubid) {
		$this->db->select('*');
		$this->db->from('placements');		
		$this->db->where('pubId', $pubid);

		$query = $this->db->get();

		return $query->num_rows();
	}

	#	Count All Placements By Site
	#
	public function countBySite($pubid, $siteid) {
		$this->db->select('*');
		$this->db->from('placements');		
		$this->db->where('pubId', $pubid);
		$this->db->where('siteId', $siteid);

		$query = $this->db->get();

		return $query->num_rows();
	}

	#	Count All Placements By Site
	#
	public function countBySitePartner($pubid, $siteid, $partnerid) {
		$this->db->select('*');
		$this->db->from('placements');		
		$this->db->where('pubId', $pubid);
		$this->db->where('siteId', $siteid);
		$this->db->where('partnerId', $partnerid);

		$query = $this->db->get();

		return $query->num_rows();
	}


	#
	#	Returns @object
	#	Placement filters
	#	
	public function viewReportsByPlacement( $partner, $placementid, $datestart, $dateend, $page, $limit = 5 ) {
		$this->db->select($partner.'.id, reportDate as Date, Impressions, Clicks, eCPM, Revenue');
		$this->db->from($partner);
		$this->db->where('placementId', $placementid);
		$this->db->join('placements', 'placements.id = '.$partner.'.placementId');
		$this->db->where('reportDate >=', $datestart);
		$this->db->where('reportDate <=', $dateend);
		$this->db->order_by('reportDate', 'DESC');	
		if ($page != 'All') {
			$this->db->limit($limit, ($page - 1) * $limit);	
		}

		$query = $this->db->get();
		
		$result['data'] = $query->result();
		$result['total'] = $this->countReportsByPlacement($partner, $placementid, $datestart, $dateend);

		return $result;		
	}	

	public function countReportsByPlacement($partner, $placementid, $datestart, $dateend) {
		$this->db->select($partner.'.id, reportDate as Date, Impressions, Clicks, eCPM, Revenue');
		$this->db->from($partner);
		$this->db->where('placementId', $placementid);
		$this->db->join('placements', 'placements.id = '.$partner.'.placementId');
		$this->db->where('reportDate >=', $datestart);
		$this->db->where('reportDate <=', $dateend);
		$this->db->order_by('reportDate', 'DESC');
		$query = $this->db->get();

		return $query->num_rows();				
	}


}
