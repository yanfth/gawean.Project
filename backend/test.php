<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$request = new \Illuminate\Http\Request([
    'name' => 'Test User',
    'email' => 'test_1234@example.com',
    'password' => 'password123',
    'role' => 'buka_jasa'
]);

$controller = new \App\Http\Controllers\AuthController();
$response = $controller->register($request);
echo $response->getContent();
