<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Google extends CI_Controller {

  function __construct() {
      parent::__construct();

      //$this->load->library('google');

        set_include_path(APPPATH . 'third_party/' . PATH_SEPARATOR . get_include_path());
        
        require_once APPPATH .'third_party/Google/Api/Ads/Dfp/Lib/DfpUser.php';
        require_once APPPATH .'third_party/Google/Api/Ads/Dfp/Util/v201611/StatementBuilder.php';
        require_once APPPATH .'third_party/Google/Api/Ads/Dfp/Util/v201611/ReportDownloader.php';
        require_once APPPATH .'third_party/Google/Common/ExampleUtils.php';

        define('CLIENT_ID', '573450477316-ie0jbth8mcsvtnbnu1r2plefmslc0ta0.apps.googleusercontent.com');
        define('CLIENT_SECRET', '6iVIuhsWgO_MsPcRH5_sSTAR');

        define('REFRESH_TOKEN', 'ya29.CjDOA4rPjdl6Uhn2LTqBm_WqphE1X0jeeWTB_fVMbFVdF0H7c0l2ssVjqNQYJ6OWhqo');
        define('NETWORK_CODE', '13425667');

        define('AUTH_CODE', '4/f1CGhpVCMCGNIHXNlCx-b5MP_-sgG7BOtuNGAz7wsso');
        define('APPLICATION_NAME', 'AdWorx Reporting Tool');

        $this->redirectUri = 'http://portal.adworx.com.ph/app/google/refresh_token';        
        $this->offline = true;

  }

	public function index()
	{
    
		
  }

  public function dfp() {
      try {
        $oauth2Info = array(
          'client_id' => CLIENT_ID,
          'client_secret' => CLIENT_SECRET,
          'refresh_token' => REFRESH_TOKEN
        );

        $user = new DfpUser(null, APPLICATION_NAME, NETWORK_CODE, null, $oauth2Info);
        $user->LogDefault();

        // Get the OAuth2 credential.
        $this->RunExample($user);

      } catch (OAuth2Exception $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (ValidationException $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (Exception $e) {
        printf("An error has occurred: %s\n", $e->getMessage());
      }
  }

  function RunExample(DfpUser $user) {
        // Get the NetworkService.
        $networkService = $user->GetService('NetworkService');

        // Gets the current network.
        $network = $networkService->getCurrentNetwork();

        printf("Current network has network code %d and display name \"%s\".\n",
          $network->networkCode, $network->displayName);
  }

  public function dfpOrders() {
        try {
        $oauth2Info = array(
          'client_id' => CLIENT_ID,
          'client_secret' => CLIENT_SECRET,
          'refresh_token' => REFRESH_TOKEN
        );

        $user = new DfpUser(null, APPLICATION_NAME, NETWORK_CODE, null, $oauth2Info);
        $user->LogDefault();

        // Get the OrderService.
        $orderService = $user->GetService('OrderService', 'v201611');

        // Create a statement to select all orders.
        $statementBuilder = new StatementBuilder();
        $statementBuilder->OrderBy('id ASC')
            ->Limit(StatementBuilder::SUGGESTED_PAGE_LIMIT);

        // Default for total result set size.
        $totalResultSetSize = 0;

        do {
          // Get orders by statement.
          $page = $orderService->getOrdersByStatement(
              $statementBuilder->ToStatement());

          // Display results.
          if (isset($page->results)) {
            $totalResultSetSize = $page->totalResultSetSize;
            
            echo print_r($page->results);

            $i = $page->startIndex;
            foreach ($page->results as $order) {

              echo 

              printf("%d) Order with ID %d, name '%s', and advertiser ID %d was "
                  . "found.\n", $i++, $order->id, $order->name, $order->advertiserId);
            }
          }

          $statementBuilder->IncreaseOffsetBy(StatementBuilder::SUGGESTED_PAGE_LIMIT);
        } while ($statementBuilder->GetOffset() < $totalResultSetSize);

        printf("Number of results found: %d\n", $totalResultSetSize);
      } catch (OAuth2Exception $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (ValidationException $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (Exception $e) {
        printf("%s\n", $e->getMessage());
      }
  }

  public function reportSavedQuery( $savedQueryId = NULL){
    //$savedQueryId = '1820428771';
    if (isset($savedQueryId)) {
        try {
          $oauth2Info = array(
            'client_id' => CLIENT_ID,
            'client_secret' => CLIENT_SECRET,
            'refresh_token' => REFRESH_TOKEN
          );

          $user = new DfpUser(null, APPLICATION_NAME, NETWORK_CODE, null, $oauth2Info);
          $user->LogDefault();

        // Get the ReportService.
        $reportService = $user->GetService('ReportService', 'v201611');

        // Create statement to retrieve the saved query.
        $statementBuilder = new StatementBuilder();
        $statementBuilder->Where('id = :id')
            ->OrderBy('id ASC')
            ->Limit(1)
            ->WithBindVariableValue('id', $savedQueryId);

        $savedQueryPage = $reportService->getSavedQueriesByStatement(
            $statementBuilder->ToStatement());
        $savedQuery = $savedQueryPage->results[0];

        if ($savedQuery->isCompatibleWithApiVersion == false) {
          throw new UnexpectedValueException(
              'The saved query is not compatible with this API version.');
        }

        // Optionally modify the query.
        $reportQuery = $savedQuery->reportQuery;
        $reportQuery->adUnitView = 'FLAT';

        // Create report job using the saved query.
        $reportJob = new ReportJob();
        $reportJob->reportQuery = $reportQuery;

        // Run report job.
        $reportJob = $reportService->runReportJob($reportJob);

        // Create report downloader.
        $reportDownloader = new ReportDownloader($reportService, $reportJob->id);

        // Wait for the report to be ready.
        $reportDownloader->waitForReportReady();

        // Change to your file location.
        $random = mt_rand();

        $filePath = APPPATH . 'saved-reports/saved-report-'. $random .'.csv.gz';

        printf("Downloading report to %s ...\n", $filePath);

        echo '<a href="'.$reportDownloader->getDownloadUrl('CSV_DUMP') .'" targe="_blank">Download</a>';

        // Download the report.
        $reportDownloader->downloadReport('CSV_DUMP', $filePath);

        $csv = $this->unCompress($filePath);

        unlink($filePath);


        //http://stackoverflow.com/questions/1269562/how-to-create-an-array-from-a-csv-file-using-php-and-the-fgetcsv-function
        $report = fopen($csv, 'r');
        while ($line = fgetcsv($report)) {
          print_r($line);
        }
        fclose($report);

        printf("done.\n");

      } catch (OAuth2Exception $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (ValidationException $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (Exception $e) {
        printf("%s\n", $e->getMessage());
      }   
    }
  }

public function inventoryReport(){
     try {
          $oauth2Info = array(
            'client_id' => CLIENT_ID,
            'client_secret' => CLIENT_SECRET,
            'refresh_token' => REFRESH_TOKEN
          );

          $user = new DfpUser(null, APPLICATION_NAME, NETWORK_CODE, null, $oauth2Info);
          $user->LogDefault();

      // Get the ReportService.
      $reportService = $user->GetService('ReportService', 'v201611');

      // Get the NetworkService.
      $networkService = $user->GetService('NetworkService', 'v201611');

      // Get the root ad unit ID to filter on.
      //$rootAdUnitId = $networkService->getCurrentNetwork()->effectiveRootAdUnitId;
      $rootAdUnitId = '116650291';

      // Create statement to filter on a parent ad unit with the root ad unit ID to
      // include all ad units in the network.
      $statementBuilder = new StatementBuilder();
      $statementBuilder->Where('PARENT_AD_UNIT_ID = :parentAdUnitId')
          ->WithBindVariableValue('parentAdUnitId', floatval($rootAdUnitId));

      // Create report query.
      $reportQuery = new ReportQuery();
      $reportQuery->dimensions = array('AD_UNIT_ID', 'AD_UNIT_NAME');
      $reportQuery->columns = array('AD_SERVER_IMPRESSIONS', 'AD_SERVER_CLICKS',
          'DYNAMIC_ALLOCATION_INVENTORY_LEVEL_IMPRESSIONS',
          'DYNAMIC_ALLOCATION_INVENTORY_LEVEL_CLICKS',
          'TOTAL_INVENTORY_LEVEL_IMPRESSIONS',
          'TOTAL_INVENTORY_LEVEL_CPM_AND_CPC_REVENUE');

      // Set the filter statement.
      $reportQuery->statement = $statementBuilder->ToStatement();

      // Set the ad unit view to hierarchical.
      $reportQuery->adUnitView = 'HIERARCHICAL';

      // Set the start and end dates or choose a dynamic date range type.
      $reportQuery->dateRangeType = 'YESTERDAY';

      // Create report job.
      $reportJob = new ReportJob();
      $reportJob->reportQuery = $reportQuery;

      // Run report job.
      $reportJob = $reportService->runReportJob($reportJob);

      // Create report downloader.
      $reportDownloader = new ReportDownloader($reportService, $reportJob->id);

      // Wait for the report to be ready.
      $reportDownloader->waitForReportReady();

      // Change to your file location.
      $filePath = sprintf('%s.csv.gz', tempnam(sys_get_temp_dir(),
          'inventory-report-'));

      printf("Downloading report to %s ...\n", $filePath);

      // Download the report.
      $reportDownloader->downloadReport('CSV_DUMP', $filePath);

      printf("done.\n");
    } catch (OAuth2Exception $e) {
      ExampleUtils::CheckForOAuth2Errors($e);
    } catch (ValidationException $e) {
      ExampleUtils::CheckForOAuth2Errors($e);
    } catch (Exception $e) {
      printf("%s\n", $e->getMessage());
    } 
}

//http://stackoverflow.com/questions/11265914/how-can-i-extract-or-uncompress-gzip-file-using-php
function unCompress($filename){
  // Raising this value may increase performance
  $buffer_size = 4096; // read 4kb at a time
  $out_file_name = str_replace('.gz', '', $filename); 

  // Open our files (in binary mode)
  $file = gzopen($filename, 'rb');
  $out_file = fopen($out_file_name, 'wb'); 

  // Keep repeating until the end of the input file
  while (!gzeof($file)) {
      // Read buffer-size bytes
      // Both fwrite and gzread and binary-safe
      fwrite($out_file, gzread($file, $buffer_size));
  }

  // Files are done, close files
  fclose($out_file);
  gzclose($file);

  return $out_file_name;
}

  public function refresh_token($code = NULL){
      try {
        $oauth2Info = array(
          'client_id' => CLIENT_ID,
          'client_secret' => CLIENT_SECRET
        );

        $user = new DfpUser(null, null, null, null, $oauth2Info);
        $user->LogDefault();

        // Get the OAuth2 credential.
        $oauth2Info = $this->GetOAuth2Credential($user);

        echo print_r($oauth2Info);

        // Get the OAuth2 credential.
        $this->RunExample($user);

      } catch (OAuth2Exception $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (ValidationException $e) {
        ExampleUtils::CheckForOAuth2Errors($e);
      } catch (Exception $e) {
        printf("An error has occurred: %s\n", $e->getMessage());
      } 

  }

  function GetOAuth2Credential($user) {

    $OAuth2Handler = $user->GetOAuth2Handler();

    $authorizationUrl = $OAuth2Handler->GetAuthorizationUrl(
        $user->GetOAuth2Info(), $this->redirectUri, $this->offline);

    // Get the access token using the authorization code. Ensure you use the same
    // redirect URL used when requesting authorization.
    if (isset($_GET['code'])) {
      $user->SetOAuth2Info(
        $OAuth2Handler->GetAccessToken(
            $user->GetOAuth2Info(), $_GET['code'], $this->redirectUri));
    } else {
      redirect($authorizationUrl);
    }

    // The access token expires but the refresh token obtained for offline use
    // doesn't, and should be stored for later use.

    return $user->GetOAuth2Info();

  }

}