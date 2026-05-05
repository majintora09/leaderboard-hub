<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResultController;

Route::get('/results', [ResultController::class, 'index']);
Route::post('/results', [ResultController::class, 'store']);
Route::delete('/results/{result}', [ResultController::class, 'destroy']);
