<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Template_view extends CI_Controller {
	public function index(){
		echo '{ "page" : "blank" }';
	}
	public function view($view = NULL)
	{
		$this->load->view('templates/'.$view);
	}
}
?>