<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jasa;

class JasaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'penyedia_jasa' || !$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized or profile not found'], 403);
        }

        $jasas = Jasa::where('penyedia_jasa_id', $user->penyediaJasa->id)->orderBy('created_at', 'desc')->get();
        return response()->json($jasas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'penyedia_jasa' || !$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'price' => 'nullable|numeric|min:0'
        ]);

        $jasa = Jasa::create([
            'penyedia_jasa_id' => $user->penyediaJasa->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'] ?? null,
            'price' => $validated['price'] ?? 0,
        ]);

        return response()->json(['message' => 'Jasa berhasil ditambahkan', 'data' => $jasa], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jasa = Jasa::find($id);
        if (!$jasa) return response()->json(['message' => 'Not found'], 404);
        return response()->json($jasa);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        if ($user->role !== 'penyedia_jasa' || !$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jasa = Jasa::where('id', $id)->where('penyedia_jasa_id', $user->penyediaJasa->id)->first();
        if (!$jasa) {
            return response()->json(['message' => 'Jasa tidak ditemukan atau bukan milik Anda'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'price' => 'nullable|numeric|min:0'
        ]);

        $jasa->update($validated);

        return response()->json(['message' => 'Jasa berhasil diupdate', 'data' => $jasa]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        if ($user->role !== 'penyedia_jasa' || !$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jasa = Jasa::where('id', $id)->where('penyedia_jasa_id', $user->penyediaJasa->id)->first();
        if (!$jasa) {
            return response()->json(['message' => 'Jasa tidak ditemukan atau bukan milik Anda'], 404);
        }

        $jasa->delete();

        return response()->json(['message' => 'Jasa berhasil dihapus']);
    }

    /**
     * Fetch all jasas for public (Pencari Jasa)
     */
    public function getAll(Request $request)
    {
        // For Pencari Jasa Dashboard
        $jasas = Jasa::with('penyedia.user')->orderBy('created_at', 'desc')->get();
        return response()->json($jasas);
    }
}
