<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

		<!-- .main-content -->
		<div class="main-content">		
			<input type="hidden" ng-init="pubId=<?php echo $pubId ?>"/>
			<div ng-view></div>
		</div> <!--/ .main-content -->