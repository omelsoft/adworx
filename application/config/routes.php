<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'main';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

$route['temp'] = 'template_view/index';
$route['temp/(:any)'] = "template_view/view/$1";

$route['admin'] = "main/admin";
$route['publisher'] = "main/publisher";
$route['login'] = "main/index";
$route['signup'] = "main/signup";
$route['logout'] = "main/logout";
$route['forgot'] = "main/forgot";
$route['reset'] = "main/reset";

$route['partners/(:any)'] = "partners/index";
$route['partnersCreate'] = "partners/store";
$route['partnersEdit/(:any)'] = "partners/edit/$1";
$route['partnersUpdate/(:any)']['put'] = "partners/update/$1";
$route['partnersDelete/(:any)']['delete'] = "partners/delete/$1";

$route['pubpartners'] = 'publishers/pubPartners';
$route['pubsites/(:any)'] = 'publishers/pubSites/$1';
$route['pubsites'] = 'publishers/pubSites';
$route['sites'] = 'publishers/pubSites';

$route['pubplacements'] = 'publishers/pubPlacements';
$route['initPlacementsData/(:any)'] = 'publishers/initPlacementsData/$1';
$route['addNewPlacement'] = 'publishers/addNewPlacement';


$route['addNewSite'] = 'publishers/addNewSite';
$route['updatePartnerStatus'] = 'publishers/updatePartnerStatus';

$route['publisher/(:any)'] = "publishers/settings/$1";
$route['pub/(:any)'] = "publishers/$1";
$route['pub/(:any)/(:any)'] = "publishers/$1/$2";

$route['display/(:any)'] = "reports/display/$1";