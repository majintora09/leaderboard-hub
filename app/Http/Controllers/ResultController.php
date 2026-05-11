<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index()
    {
        return Result::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'game' => 'required|string|max:255',
            'track' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'time' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'has_recording' => 'boolean',
        ]);

        return Result::create($validated);
    }

    public function destroy(Result $result)
    {
        $result->delete();

        return response()->json([
            'message' => 'Result deleted'
        ]);
    }
}
