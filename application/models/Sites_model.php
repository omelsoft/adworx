<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sites_model extends CI_Model {

	#
	#	List all active sites for the selected publisher
	#	
	public function listSites( $pubid, $page ) {
		$this->db->select('sites.id, siteName, siteUrl');
		$this->db->from('sites');
		$this->db->where('pubId', $pubid);
		$this->db->join('users', 'users.id = sites.pubId');
		$this->db->limit(5, ($page - 1) * 5);

		$query = $this->db->get();

		$data['pubSites'] = $query->result();
		$data['total'] = $this->countAllSites($pubid);

		return json_encode($data, true);		
	}

	#
	#	List all active sites for the selected publisher
	#	
	public function listAllSites( $pubid ) {
		$this->db->select('sites.id, siteName, siteUrl');
		$this->db->from('sites');
		$this->db->where('pubId', $pubid);
		$this->db->join('users', 'users.id = sites.pubId');

		$query = $this->db->get();

		return $query->result();		
	}

	#
	# Add a New Site
	public function addNewSite($data)
	{	
		$this->db->insert('sites', $data);	

		$id = $this->db->insert_id();

		$result = $this->db->get_where('partners', array('id' => $id));
		return json_encode($result->row());
    }

	#	Count All Sites
	#
	public function countAllSites($pubid) {
		$this->db->select('*');
		$this->db->from('sites');		
		$this->db->where('pubId', $pubid);

		$query = $this->db->get();

		return $query->num_rows();
	}
	

}
