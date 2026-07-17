<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    /**
     * List testimonials for the authenticated penyedia.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->penyediaJasa) {
            return response()->json([]);
        }

        $testimonials = Testimonial::where('penyedia_jasa_id', $user->penyediaJasa->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($testimonials);
    }

    /**
     * Store a new testimonial.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->penyediaJasa) {
            $user->penyediaJasa()->create();
            $user->load('penyediaJasa');
        }

        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $testimonial = Testimonial::create([
            'penyedia_jasa_id' => $user->penyediaJasa->id,
            'client_name' => $validated['client_name'],
            'content' => $validated['content'],
            'rating' => $validated['rating'],
        ]);

        return response()->json(['message' => 'Testimoni berhasil ditambahkan', 'data' => $testimonial], 201);
    }

    /**
     * Update a testimonial.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        if (!$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $testimonial = Testimonial::where('id', $id)
            ->where('penyedia_jasa_id', $user->penyediaJasa->id)
            ->first();

        if (!$testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'client_name' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
        ]);

        $testimonial->update($validated);

        return response()->json(['message' => 'Testimoni berhasil diupdate', 'data' => $testimonial]);
    }

    /**
     * Delete a testimonial.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        if (!$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $testimonial = Testimonial::where('id', $id)
            ->where('penyedia_jasa_id', $user->penyediaJasa->id)
            ->first();

        if (!$testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan'], 404);
        }

        $testimonial->delete();

        return response()->json(['message' => 'Testimoni berhasil dihapus']);
    }
}
