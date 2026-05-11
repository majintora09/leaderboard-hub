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
            'name' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        return Comment::create($validated);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted'
        ]);
    }
}
