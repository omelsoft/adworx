<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="en" ng-app="adWorxApp">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php echo $title ?></title>
  
    <link href="/app/assets/css/main-app.css?<?php echo $randomizer ?>" rel="stylesheet" type="text/css" />
<?php if (! $loggedin ) : ?>
    <link href="/app/assets/css/form-login.css?<?php echo $randomizer ?>" rel="stylesheet" type="text/css" />
<?php endif; ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script src="/app/assets/js/release/v1.0.0/main-jqboot.js?<?php echo $randomizer ?>"></script>
<?php if (! $loggedin ) : ?>
    <script src="/app/assets/js/release/v1.0.0/main-user.js?<?php echo $randomizer ?>"></script>
<?php endif; ?>
    <script src="/app/assets/js/release/v1.0.0/main-ng.js?<?php echo $randomizer ?>"></script>
    <script src="/app/assets/js/release/v1.0.0/main-app.min.js?<?php echo $randomizer ?>"></script>
    <script src="/app/assets/js/release/v1.0.0/main-chart.js?<?php echo $randomizer ?>"></script>  

</head>
<body ng-controller="MainController">