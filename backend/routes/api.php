<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load($request->user()->role === 'penyedia_jasa' ? 'penyediaJasa' : 'pencariJasa');
    });

    Route::apiResource('jasa', \App\Http\Controllers\JasaController::class);
    Route::get('/all-jasa', [\App\Http\Controllers\JasaController::class, 'getAll']);
});
