<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'game',
        'track',
        'category',
        'time',
        'description',
        'has_recording',
    ];
}
