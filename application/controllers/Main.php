<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function index()
	{
		$loggedin = $this->session->userdata('logged_in');
		if ( $loggedin ) 
		{
			$data['title'] = 'Dashboard';
			$data['loggedin'] = true;
			$data['user'] = $loggedin;
			$data['randomizer'] = md5(mt_rand());

			$this->load->view('templates/redirect');

			if ($loggedin['type'] == 'admin')
				redirect(site_url($loggedin['type'].'#/publishers'));
			else
				redirect(site_url($loggedin['type'].'#/reports'));

			$this->load->view('templates/Header', $data);
			$this->load->view('templates/Sidebar');
			$this->load->view('templates/Main');
			$this->load->view('templates/Footer', $data);	

		} else {
			$this->form_validation->set_rules('lg_username', 'Username', 'trim|required');
			$this->form_validation->set_rules('lg_password', 'Password', 'trim|required|callback_validation_login');

			if($this->form_validation->run()==false){

				$data['title'] = 'Login';
				$data['loggedin'] = false;
				$data['randomizer'] = md5(mt_rand());

				$this->load->view('templates/Header', $data);
				$this->load->view('templates/form/LoginForm.php');	
				$this->load->view('templates/Footer', $data);
			} else {
				redirect(site_url(), 'refresh');
			}
		}
	}

	public function admin() {
		$loggedin = $this->session->userdata('logged_in');
		if ($this->session->userdata('logged_in')) {

			$data['title'] = 'Dashboard';
			$data['loggedin'] = true;
			$data['session'] = $loggedin;
			$data['randomizer'] = md5(mt_rand());

            $data['pubId']   = $loggedin['id'];
			$data['page']	 = 'home';

			$this->load->view('templates/Header', $data);
			$this->load->view('templates/Sidebar', $data);
			$this->load->view('templates/Main', $data);
			$this->load->view('templates/Footer', $data);				
		} else {
			redirect(site_url());
		}
	}

	public function publisher() {
		$loggedin = $this->session->userdata('logged_in');
		if ($this->session->userdata('logged_in')) {

			$data['title'] = 'Dashboard';
			$data['loggedin'] = true;
			$data['session'] = $loggedin;
			$data['randomizer'] = md5(mt_rand());

            $data['pubId']   = $loggedin['id'];
			$data['page']	 = 'home';

			$this->load->view('templates/Header', $data);
			$this->load->view('templates/Sidebar', $data);
			$this->load->view('templates/Main', $data);
			$this->load->view('templates/Footer', $data);	
			
		} else {
			redirect(site_url());
		}
	}

	function validation_login($password)
	{

		$username = $this->input->post('lg_username');
		$result = $this->user->login($username, $password);
		
		$sess_array = array();

		if($result) {
			foreach( $result as $row ) {
				$sess_array = array(
								'id' 		=> $row->id, 
								'username' 	=> $row->username, 
								'fullname' 	=> $row->fullname, 
								'email'		=> $row->email,
								'type' 		=> $row->type,
								'timezone'	=> $row->timezone
							);
				$this->session->set_userdata('logged_in', $sess_array);
			}
			return true;
		} else {
			$this->form_validation->set_message('validation_login', 'Invalid username or password.');
			return false;
		}
	}

	public function signup() {

			$data['title'] = 'Signup';
			$data['loggedin'] = false;
			$data['randomizer'] = md5(mt_rand());

			$this->load->view('templates/Header', $data);
			$this->load->view('templates/form/SignupForm.php');	
			$this->load->view('templates/Footer', $data);		
	}

	public function forgot() {

			$data['title'] = 'Forgot Password';
			$data['loggedin'] = false;
			$data['randomizer'] = md5(mt_rand());

			$this->load->view('templates/Header', $data);
			$this->load->view('templates/form/ForgotPasswordForm.php');	
			$this->load->view('templates/Footer', $data);		
	}

	public function reset() {

			$data['title'] = 'Reset Password';
			$data['loggedin'] = false;
			$data['randomizer'] = md5(mt_rand());

			$this->load->view('templates/Header', $data);
			$this->load->view('templates/form/ForgotPasswordForm.php');	
			$this->load->view('templates/Footer', $data);		
	}

	public function logout()
	{
		$this->load->view('templates/redirect');
		$this->session->unset_userdata('logged_in');
		$this->session->sess_destroy();
		redirect(site_url(''), 'refresh');
	}
}
