<?php
require_once 'Google/Client.php';

session_start();

$client = new Google_Client();
$client->setAuthConfigFile('Google/client_secret.json');
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/omelsoft/app/oauth2callback.php');

if (! isset($_GET['code'])) {
  $auth_url = $client->createAuthUrl();
  header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
} else {
  $client->authenticate($_GET['code']);
  $_SESSION['access_token'] = $client->getAccessToken();
  $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/omelsoft/app';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}

?>