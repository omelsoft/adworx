
    <!-- .sidebar -->
    <div class="sidebar">
<?php if ($page == 'home') : ?>
          <div class="dashboard-sidebar">
            <!-- SIDEBAR USERPIC -->
            <div class="dashboard-userpic">
            </div>
            <div class="clear"></div>
            <!-- END SIDEBAR USERPIC -->
            <!-- SIDEBAR USER TITLE -->
            <div class="dashboard-usertitle">
              <div class="dashboard-usertitle-name">
              Welcome, <?php echo $session['username'] ?>!
              </div>
            </div>
            <!-- END SIDEBAR USER TITLE -->
            <!-- SIDEBAR BUTTONS -->
            <div class="dashboard-userbuttons">
              <a href="<?php echo site_url('logout') ?>"><button type="button" class="btn btn-danger btn-sm">Logout</button></a>
            </div>
            <!-- END SIDEBAR BUTTONS -->
            <!-- SIDEBAR MENU -->
            <div class="dashboard-usermenu">
              <ul class="nav">
<?php if ($session['type'] == 'admin') : ?>
                <li ng-class="{'active':activeMenu == 'overview','':activeMenu!='overview'}">
                  <a href="#overview"><i class="fa fa-home" aria-hidden="true"></i>Overview</a>
                </li>
                <li ng-class="{'active':activeMenu == 'publishers','':activeMenu!='publishers'}">
                  <a href="#publishers"><i class="fa fa-users" aria-hidden="true"></i>Publishers</a>
                </li>
                <li ng-class="{'active':activeMenu == 'partners','':activeMenu!='partners'}">
                  <a href="#partners"><i class="fa fa-server" aria-hidden="true"></i>Ad Partners</a>
                </li>
<?php elseif ($session['type'] == 'publisher') : ?>
                </li>
                <li ng-class="{'active':activeMenu == 'sites','':activeMenu!='sites'}">
                  <a href="#sites"><i class="fa fa-sitemap" aria-hidden="true"></i>Sites</a>
                </li>
                <li ng-class="{'active':activeMenu == 'reports','':activeMenu!='reports'}">
                  <a href="#reports"><i class="fa fa-line-chart" aria-hidden="true"></i>Reports</a>
                </li>
              <?php endif; ?>
                <li>
                  <a href=""><i class="glyphicon glyphicon-flag"></i>Help</a>
                </li>              
              </ul>
            </div>
            <!-- END MENU -->
        </div><?php elseif( $page == 'settings' ): ?>          <div class="dashboard-sidebar">
            <!-- SIDEBAR USERPIC -->
            <div class="dashboard-userpic">
            </div>
            <div class="clear"></div>
            <!-- END SIDEBAR USERPIC -->
            <!-- SIDEBAR USER TITLE -->
            <div class="dashboard-usertitle">
              <div class="dashboard-usertitle-name">
              Welcome, <?php echo $session['username'] ?>!
              </div>
            </div>
            <!-- END SIDEBAR USER TITLE -->
            <!-- SIDEBAR BUTTONS -->
            <div class="dashboard-userbuttons">
              <a href="<?php echo site_url('logout') ?>"><button type="button" class="btn btn-danger btn-sm">Logout</button></a>
            </div>
            <!-- END SIDEBAR BUTTONS -->
            <!-- SIDEBAR MENU -->
            <div class="dashboard-usermenu">
              <ul class="nav">
                <li class=""><a href="<?php echo site_url() ?>"><i class="fa fa-home" aria-hidden="true"></i>Home</a>
                </li>
                <li ng-class="{'active':activeMenu == 'sites','':activeMenu!='sites'}">
                  <a href="#pubSites"><i class="fa fa-sitemap" aria-hidden="true"></i>Sites</a>
                </li>
                <li ng-class="{'active':activeMenu == 'placements','':activeMenu!='placements'}">
                  <a href="#pubPlacements"><i class="fa fa-object-group" aria-hidden="true"></i>Placements</a>
                </li>
                <li ng-class="{'active':activeMenu == 'partners','':activeMenu!='partners'}">
                  <a href="#pubPartners"><i class="fa fa-server" aria-hidden="true"></i>Partners</a>
                </li>
                <li ng-class="{'active':activeMenu == 'reports','':activeMenu!='reports'}">
                  <a href="#pubReports"><i class="fa fa-line-chart" aria-hidden="true"></i>Reports</a>
                </li>
                <li>
                  <a href="#">
                  <i class="glyphicon glyphicon-flag"></i>
                  Help </a>
                </li>
              </ul>
            </div>
            <!-- END MENU -->
        </div>
<?php endif; ?>        <div class="footer">
            <div class="logo"></div>
            <div class="copyright">
                &copy; <?php $now = time(); echo mdate('%Y', $now); ?> AdWorx by TekWorx
            </div>
        </div>
    </div>
    <!--/ .sidebar -->
    <!-- .row -->
    <div class="row" id="main">
        <div ng-show="loading" class="loader-wrapper"></div>