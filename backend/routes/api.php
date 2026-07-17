<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\TestimonialController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load($request->user()->role === 'penyedia_jasa' ? 'penyediaJasa' : 'pencariJasa');
    });

    Route::apiResource('jasa', \App\Http\Controllers\JasaController::class);
    Route::get('/all-jasa', [\App\Http\Controllers\JasaController::class, 'getAll']);

    // Verification
    Route::post('/verification/upload', [VerificationController::class, 'upload']);
    Route::get('/verification/status', [VerificationController::class, 'status']);

    // Testimonials
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);

    // Orders & Chats
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index']);
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store']);
    Route::get('/orders/{id}', [\App\Http\Controllers\OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/messages', [\App\Http\Controllers\OrderController::class, 'sendMessage']);
});
