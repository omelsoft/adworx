<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Publishers extends CI_Controller {

    public function index() {
    	$page = $this->input->get('page');
    	$result = $this->modPartners->publishers($page);
    	echo $result;
    }

    public function addNew( $pubid, $partner, $data ) {
    	echo print_r($data);
    }

    public function settings($pubid) {
        $user = $this->session->userdata('logged_in');
        if ( $user['type'] == 'admin' ) {

            $data['title'] = 'Publisher Settings';
            $data['loggedin'] = true;
            $data['session'] = $user;
            $data['randomizer'] = md5(mt_rand());

            $data['pubId']      = $pubid;
            $data['page']       = 'settings';

            $this->load->view('templates/Header', $data);
            $this->load->view('templates/Sidebar', $data);
            $this->load->view('templates/app/Publisher_settings', $data);
            $this->load->view('templates/Footer', $data);  
            
        } else {
            redirect(site_url());
        }
    }


    /**********************************************************
    #
    #   PARTNERS   
    #
    **********************************************************/
    public function pubPartners($pubid = NULL) {
        $page = $this->input->get("page");
        $pubid = $this->input->get("pubId");

        $result = $this->modPartners->listPartners($pubid, $page);

        echo $result;
    }

    public function updatePartnerStatus($pubid = NULL) {
        $pubid = $this->input->get('pubId');
        $partnerid = $this->input->get('partnerId');
        $status = $this->input->get('status') ? 0 : 1;

        $this->modPartners->updatePartnerStatus($pubid, $partnerid, $status);

        $result = $this->modPartners->listPartners($pubid, 1);
        echo $result;     
    }


    /**********************************************************
    #
    #   SITES   
    #
    **********************************************************/
    public function pubSites($pubid = NULL, $page = NULL) {
        $page = $this->input->get("page");
        $pubid = $this->input->get("pubId");

        $result = $this->modSites->listSites($pubid, $page);

        echo $result;
    }

    public function addNewSite($pubid = NULL) {

        $pubid = $this->input->get('pubId');
        $siteName = $this->input->get('siteName');
        $siteUrl = $this->input->get('siteUrl');

        $data = array(
                'pubId' => $pubid,
                'siteName' => $siteName,
                'siteUrl' => $siteUrl
            );
        
        $result = $this->modSites->addNewSite($data);
        echo $result;
    }


    /**********************************************************
    #
    #   PLACEMENTS   
    #
    **********************************************************/

    #
    #   List all Placements on all sites
    #
    #   @returns object
    #   @type json
    #
    public function pubPlacements($pubid = NULL) {
        $page = $this->input->get("page");
        $pubid = $this->input->get("pubId");

        $result = $this->modPlacements->listPlacements($pubid, $page);

        echo $result;
    }

    #
    #   Get all Placements for selected publisher
    #
    #   @returns object
    #   @type json
    #
    public function allPlacements() {
        $pubid = $this->input->post_get("pubId");
        $result = $this->modPlacements->allPlacements($pubid);

        echo json_encode($result);
    }   

    #
    #   List all Placements on the selected site
    #
    #   @returns object
    #   @type json
    #
    public function pubPlacementsBySite() {
        $page = $this->input->get("page");
        $siteid = $this->input->get("siteId");
        $partnerid = $this->input->get("partnerId");
        $pubid = $this->input->get("pubId");

        $result = $this->modPlacements->listPlacementsBySite($pubid, $siteid, $partnerid, $page);

        echo $result;
    }

    #
    #   List all Placements on the selected site and Partner
    #
    #   @returns object
    #   @type json
    #
    public function pubPlacementsByPartner() {
        $page = $this->input->get("page");
        $siteid = $this->input->get("siteId");
        $partnerid = $this->input->get("partnerId");
        $pubid = $this->input->get("pubId");

        $result = $this->modPlacements->listPlacementsByPartner($pubid, $siteid, $partnerid, $page);

        echo $result;
    }

    #   
    #   Returns data for dropdown buttons
    #   
    #   @returns object
    #   @type json
    #
    public function initPlacementsData($pubid){
         $data['pubSites'] = $this->modSites->listAllSites($pubid);
         $data['pubPartners'] = $this->modPartners->getAllPartners($pubid);

         echo json_encode($data, true);
    } 

    #   
    #   Returns data for dropdown buttons
    #   
    #   @returns object
    #
    public function addNewPlacement() {
        $name   = $this->input->get('name');
        $page    = $this->input->get('page');   
        $pubId    = $this->input->get('pubId');
        $siteId    = $this->input->get('siteId');
        $partnerId    = $this->input->get('partnerId');

        $data  = array(
                'pubId'         => $pubId,
                'partnerId'     => $partnerId,
                'siteId'        => $siteId,
                'placementName' => $name 
                ); 
        //echo json_encode($data);
        $this->modPlacements->addNewPlacement($data);
        echo $this->modPlacements->listPlacements($pubId, 1);

    }

    #
    #   View reports of selected placement
    #
    #   @returns object
    #   @type json
    #
    public function viewReportsByPlacement() {

        $data = json_decode($this->input->post_get('data'), true);

        $range = $this->modReports->range(urldecode($data['range']), $data['start'], $data['end']);

        $result = $this->modPlacements->viewReportsByPlacement($data['partner'], $data['placementId'], $range['start'], $range['end'], $data['page'], $data['limit']);

        $reports['reports'] = $result;
        echo json_encode($reports);
    }

    public function updateReportByPlacement()
    {
        echo json_encode($this->modReports->updateReportByPlacement());
    }

}