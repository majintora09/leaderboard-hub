<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index()
    {
        return Result::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'game' => 'required|string|max:255',
            'track' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'time' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'has_recording' => 'boolean',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['name'] = $request->user()->name;

        return Result::create($validated);
    }

    public function destroy(Result $result)
    {
        if ($result->user_id !== auth()->id()) {
            abort(403);
        }

        $result->delete();

        return response()->json([
            'message' => 'Result deleted'
        ]);
    }
}
