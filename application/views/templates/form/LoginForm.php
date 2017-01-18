		<!-- LOGIN FORM -->
		<div class="text-center login-form">
			<div class="logo"></div>
			<!-- Main Form -->
			<div class="login-form-1 animated flipY">
				<form id="login-form" action="<?php echo site_url()?>#/" method="post" class="text-left">
					<div class="login-form-main-message"></div>
					<div class="main-login-form">
						<div class="login-group">
							<div class="form-group user">
								<label for="lg_username" class="sr-only">Username</label>
								<input type="text" class="form-control" id="lg_username" name="lg_username" placeholder="username">
							</div>
							<div class="form-group password">
								<label for="lg_password" class="sr-only">Password</label>
								<input type="password" class="form-control" id="lg_password" name="lg_password" placeholder="password">
							</div>
							<div class="form-group login-group-checkbox">
								<input type="checkbox" id="lg_remember" name="lg_remember">
								<label for="lg_remember">remember</label>
							</div>
						</div>
						<button type="submit" class="btn btn-primary btn-login">Login</button>
					</div>
					<div class="etc-login-form">
						<p class="align-right">Forgot your <a href="forgot">username</a> or <a href="forgot">password</a>?</p>
					</div>
				</form>
			</div>
			<!-- end:Main Form -->
			<div class="login-form-footer">
				AdWorx Portal by <a href="http://tekworxph.com">TekWorx</a>
			</div>
		</div> <!--/ LOGIN FORM -->