<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Partners_model extends CI_Model {

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

	#
	#	List Active Ad Partners for each publisher
	#
	public function listPartners( $pubid, $page ) {
		$this->db->select('partners_active.id, 
						   partners_active.pubId as pubId, 
						   partners_active.enabled as status, 
						   partners_active.partnerId, 
						   name, 
						   alias, 
						   partnerSite');
		$this->db->from('partners_active');
		$this->db->where('pubId', $pubid);
		//$this->db->where('enabled', 1);
		$this->db->join('partners', 'partners.id = partners_active.partnerId');
		$this->db->limit(5, ($page - 1) * 5);
		
		$query = $this->db->get();

		$data['pubPartners'] = $query->result();

		$data['total'] = $this->countPartners($pubid);
		return json_encode($data, true);
	}

	#	Count All Sites
	#
	public function countPartners($pubid) {
		$this->db->select('*');
		$this->db->from('partners_active');		
		$this->db->where('pubId', $pubid);

		$query = $this->db->get();

		return $query->num_rows();
	}

	#
	#	List Active Ad Partners for each publisher
	#
	public function getAllPartners( $pubid ) {
		$this->db->select('partners_active.partnerId as id, partners.alias, name');
		$this->db->from('partners_active');
		$this->db->where('pubId', $pubid);
		$this->db->where('enabled', 1);
		$this->db->join('partners', 'partners.id = partners_active.partnerId');
		
		$query = $this->db->get();

		return $query->result();
	}

    public function updatePartnerStatus($pubid, $partnerid, $status) {

        $this->db->where('pubId', $pubid);
        $this->db->where('partnerId', $partnerid);
        $this->db->update('partners_active', array('enabled' => $status));
   
    }	

}
