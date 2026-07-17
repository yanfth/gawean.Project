<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:cari_jasa,buka_jasa',
            'campus' => 'nullable|string|max:255',
        ]);

        $dbRole = $request->role === 'buka_jasa' ? 'penyedia_jasa' : 'pencari_jasa';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $dbRole,
        ]);

        if ($dbRole === 'penyedia_jasa') {
            $user->penyediaJasa()->create();
        } else {
            $user->pencariJasa()->create();
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user->load($dbRole === 'penyedia_jasa' ? 'penyediaJasa' : 'pencariJasa'),
            'token' => $token,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required|in:cari_jasa,buka_jasa',
        ]);

        $user = User::where('email', $request->email)->first();
        
        $requestedDbRole = $request->role === 'buka_jasa' ? 'penyedia_jasa' : 'pencari_jasa';

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if ($user->role !== $requestedDbRole) {
            throw ValidationException::withMessages([
                'role' => ['Akun ini tidak terdaftar sebagai ' . ($request->role === 'buka_jasa' ? 'Buka Jasa' : 'Cari Jasa') . '.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load($requestedDbRole === 'penyedia_jasa' ? 'penyediaJasa' : 'pencariJasa'),
            'token' => $token,
        ]);
    }
}
