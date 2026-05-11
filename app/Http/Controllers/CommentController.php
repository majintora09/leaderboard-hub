<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        return Comment::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'result_id' => 'required|exists:results,id',
            'message' => 'required|string|max:1000',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['name'] = $request->user()->name;

        return Comment::create($validated);
    }

    public function destroy(Comment $comment)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            abort(403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted'
        ]);
    }
}
