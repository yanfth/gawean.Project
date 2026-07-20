<?php

namespace App\Http\Controllers;

use App\Models\CommunityChannel;
use App\Models\CommunityMessage;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    /**
     * List all community channels with message count.
     */
    public function channels(Request $request)
    {
        $channels = CommunityChannel::withCount('messages')
            ->with('creator:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($channels);
    }

    /**
     * Create a new community channel.
     */
    public function createChannel(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:10',
        ]);

        $channel = CommunityChannel::create([
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon ?? '💬',
            'created_by' => $request->user()->id,
        ]);

        $channel->load('creator:id,name');
        $channel->loadCount('messages');

        return response()->json($channel, 201);
    }

    /**
     * Delete a channel.
     */
    public function deleteChannel(Request $request, $channelId)
    {
        $channel = CommunityChannel::findOrFail($channelId);

        if ($channel->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $channel->delete();

        return response()->json(['message' => 'Channel deleted successfully']);
    }

    public function messages(Request $request, $channelId)
    {
        $channel = CommunityChannel::findOrFail($channelId);

        $messages = $channel->messages()
            ->with('user:id,name,profile_photo')
            ->orderBy('created_at', 'asc')
            ->get()
            ->toArray();

        $botMessages = \Illuminate\Support\Facades\Cache::get("bot_messages_{$channelId}", []);
        
        $allMessages = array_merge($messages, $botMessages);
        usort($allMessages, function($a, $b) {
            return strtotime($a['created_at']) - strtotime($b['created_at']);
        });

        return response()->json([
            'channel' => $channel,
            'messages' => $allMessages,
        ]);
    }

    public function sendBotMessage(Request $request, $channelId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $botMessages = \Illuminate\Support\Facades\Cache::get("bot_messages_{$channelId}", []);

        $newMessage = [
            'id' => -rand(10000, 99999),
            'channel_id' => (int)$channelId,
            'user_id' => -999,
            'content' => $request->input('content'),
            'created_at' => now()->toIso8601String(),
            'user' => [
                'id' => -999,
                'name' => 'Gawean Bot 🤖',
                'profile_photo' => null
            ]
        ];

        $botMessages[] = $newMessage;
        \Illuminate\Support\Facades\Cache::put("bot_messages_{$channelId}", $botMessages);

        return response()->json($newMessage, 201);
    }

    /**
     * Send a message to a channel.
     */
    public function sendMessage(Request $request, $channelId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $channel = CommunityChannel::findOrFail($channelId);

        $message = CommunityMessage::create([
            'channel_id' => $channel->id,
            'user_id' => $request->user()->id,
            'content' => $request->input('content'),
        ]);

        $message->load('user:id,name,profile_photo');

        return response()->json($message, 201);
    }

    /**
     * Delete own message.
     */
    public function deleteMessage(Request $request, $messageId)
    {
        $message = CommunityMessage::findOrFail($messageId);

        if ($message->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['message' => 'Pesan berhasil dihapus.']);
    }
}
