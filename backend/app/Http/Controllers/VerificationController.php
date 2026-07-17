<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /**
     * Upload verification document and mark penyedia as verified.
     */
    public function upload(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'penyedia_jasa' || !$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $path = $request->file('document')->store('verification_docs', 'public');

        $penyedia = $user->penyediaJasa;
        $penyedia->update([
            'verification_doc' => $path,
            'is_verified' => true,
        ]);

        return response()->json([
            'message' => 'Dokumen verifikasi berhasil diupload. Anda sekarang terverifikasi!',
            'is_verified' => true,
            'verification_doc' => $path,
        ]);
    }

    /**
     * Check verification status.
     */
    public function status(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'penyedia_jasa' || !$user->penyediaJasa) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'is_verified' => $user->penyediaJasa->is_verified,
            'verification_doc' => $user->penyediaJasa->verification_doc,
        ]);
    }
}
