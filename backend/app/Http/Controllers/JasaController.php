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

        // Check verification status
        if (!$user->penyediaJasa->is_verified) {
            return response()->json([
                'message' => 'Anda harus terverifikasi sebagai mahasiswa sebelum bisa memposting jasa. Silakan upload dokumen verifikasi terlebih dahulu.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('jasa_images', 'public');
        }

        $jasa = Jasa::create([
            'penyedia_jasa_id' => $user->penyediaJasa->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'] ?? null,
            'price' => $validated['price'] ?? 0,
            'image' => $imagePath,
        ]);

        return response()->json(['message' => 'Jasa berhasil ditambahkan', 'data' => $jasa], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jasa = Jasa::with(['penyedia.user', 'penyedia.testimonials'])->find($id);
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
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('jasa_images', 'public');
        } else {
            unset($validated['image']);
        }

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
        // For Pencari Jasa Dashboard - include penyedia info and testimonials
        $jasas = Jasa::with(['penyedia.user', 'penyedia.testimonials'])->orderBy('created_at', 'desc')->get();
        return response()->json($jasas);
    }
}
