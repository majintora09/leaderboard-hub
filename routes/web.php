<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\CommentController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/api/results', [ResultController::class, 'index']);
Route::get('/api/comments', [CommentController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::post('/api/results', [ResultController::class, 'store']);
    Route::delete('/api/results/{result}', [ResultController::class, 'destroy']);

    Route::post('/api/comments', [CommentController::class, 'store']);
    Route::delete('/api/comments/{comment}', [CommentController::class, 'destroy']);
});
