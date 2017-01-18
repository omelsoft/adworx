<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

	function login($username, $password) 
	{
		$this->db->select('id,fullname,email,username,password,type,timezone');
		$this->db->from('users');
		$this->db->where('username', $username);
		$this->db->where('password', md5($password));
		$this->db->limit(1);

		$query = $this->db->get();
		if($query->num_rows()==1) {
			return $query->result();
		} else {
			return false;
		}
	}

	function signup()
	{
		$fn = $this->input->post('fullname');
		$un = $this->input->post('username');		
		$pw = md5($this->input->post('password'));
		$ws = $this->input->post('website');
		$email = $this->input->post('email');		
		$message = $this->input->post('message');

		if ( !isset($fn) || !isset($un) || !isset($pw) || !isset($ws) || !isset($email) || !isset($message) ) return false;

		$data = array(
			'id' 		=> '',
			'fullname'	=> $fn,
			'username'	=> $un,
			'password'	=> $pw,
			'email'		=> $email,
			'website'	=> $ws,
			'message'	=> $message,
			'type'		=> 'publisher'
		);		
		$this->db->insert('user', $data);
	}

}