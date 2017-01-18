<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Partners extends CI_Controller {
    public $user;

	public function index()
	{

		$page = $this->input->get("page");

		$result = $this->modPartners->results($page);

		echo $result;
		
	}

	public function store()
    {
        $name   = $this->input->get('name');
        $url    = $this->input->get('url');
        $alias  = $this->input->get('alias');

        $data = array(
                'name'          => $name,
                'alias'         => $alias,
                'partnerSite'   => $url
            );
        
        $result = $this->modartners->store($data);
        echo $result;

        //echo json_encode($data);

        /*$_POST = json_decode(file_get_contents('php://input'), true);
        $insert = $this->input->post();

    	$result = $this->partners->store($insert);
		echo $result;*/
    }

    public function edit($id)
    {
		$result = $this->modPartners->edit($id);
		echo $result;
    }

    public function update($id)
    {
    	$_POST = json_decode(file_get_contents('php://input'), true);
    	$insert = $this->input->post();

    	$result = $this->modPartners->update($id, $insert);

		echo $result;
    }
    public function delete($id)
    {
        echo $this->modPartners->delete($id);
    }

    public function publishers($page = NULL) {
    	$page = $this->input->get('page');
    	$result = $this->modPartners->publishers($page);
    	echo $result;
    }
}