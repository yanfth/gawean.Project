<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Message;
use App\Models\Jasa;

class OrderController extends Controller
{
    /**
     * Get orders for the authenticated user based on their role
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $ordersAsPencari = [];
        $ordersAsPenyedia = [];

        // If user is a pencari jasa (has orders)
        if ($user->pencariJasa) {
            $ordersAsPencari = Order::with(['jasa.penyedia.user', 'messages'])
                ->where('pencari_jasa_id', $user->pencariJasa->id)
                ->orderBy('updated_at', 'desc')
                ->get();
        }

        // If user is a penyedia jasa (has jasas which have orders)
        if ($user->penyediaJasa) {
            $ordersAsPenyedia = Order::with(['pencariJasa.user', 'jasa', 'messages'])
                ->whereHas('jasa', function ($query) use ($user) {
                    $query->where('penyedia_jasa_id', $user->penyediaJasa->id);
                })
                ->orderBy('updated_at', 'desc')
                ->get();
        }

        return response()->json([
            'as_pencari' => $ordersAsPencari,
            'as_penyedia' => $ordersAsPenyedia,
        ]);
    }

    /**
     * Create a new order/chat for a specific jasa
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Ensure user has a pencariJasa profile to make orders
        if (!$user->pencariJasa) {
            $user->pencariJasa()->create();
            $user->load('pencariJasa');
        }

        $validated = $request->validate([
            'jasa_id' => 'required|exists:jasa,id',
            'initial_message' => 'nullable|string'
        ]);

        // Prevent ordering own jasa
        $jasa = Jasa::findOrFail($validated['jasa_id']);
        if ($user->penyediaJasa && $jasa->penyedia_jasa_id === $user->penyediaJasa->id) {
            return response()->json(['message' => 'Anda tidak bisa memesan jasa Anda sendiri.'], 403);
        }

        // Check if an active order already exists
        $order = Order::firstOrCreate(
            [
                'pencari_jasa_id' => $user->pencariJasa->id,
                'jasa_id' => $validated['jasa_id'],
                'status' => 'negotiating'
            ]
        );

        if (!empty($validated['initial_message'])) {
            $order->messages()->create([
                'sender_id' => $user->id,
                'content' => $validated['initial_message'],
            ]);
            $order->touch(); // Update updated_at
        }

        $order->load(['jasa.penyedia.user', 'messages']);
        return response()->json($order, 201);
    }

    /**
     * Get specific order details
     */
    public function show(Request $request, $id)
    {
        $order = Order::with(['jasa.penyedia.user', 'pencariJasa.user', 'messages.sender'])->findOrFail($id);
        
        $user = $request->user();
        $isPencari = $user->pencariJasa && $order->pencari_jasa_id === $user->pencariJasa->id;
        $isPenyedia = $user->penyediaJasa && $order->jasa->penyedia_jasa_id === $user->penyediaJasa->id;

        if (!$isPencari && !$isPenyedia) {
            return response()->json(['message' => 'Unauthorized access to this order.'], 403);
        }

        return response()->json($order);
    }

    /**
     * Add a message to an order
     */
    public function sendMessage(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();
        
        $isPencari = $user->pencariJasa && $order->pencari_jasa_id === $user->pencariJasa->id;
        $isPenyedia = $user->penyediaJasa && $order->jasa->penyedia_jasa_id === $user->penyediaJasa->id;

        if (!$isPencari && !$isPenyedia) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $message = $order->messages()->create([
            'sender_id' => $user->id,
            'content' => $validated['content'],
        ]);
        
        $order->touch();

        return response()->json($message->load('sender'), 201);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();
        
        $isPenyedia = $user->penyediaJasa && $order->jasa->penyedia_jasa_id === $user->penyediaJasa->id;

        if (!$isPenyedia) {
            return response()->json(['message' => 'Hanya penyedia jasa yang dapat mengubah status pesanan.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:negotiating,accepted,rejected,completed',
            'agreed_price' => 'nullable|numeric|min:0'
        ]);

        $order->update($validated);

        return response()->json(['message' => 'Status berhasil diupdate', 'order' => $order]);
    }
}
