<?php
$user = App\Models\User::where('role', 'pencari_jasa')->first();
if (!$user) {
    $user = App\Models\User::factory()->create(['role' => 'pencari_jasa']);
    $user->pencariJasa()->create();
}

$jasa = App\Models\Jasa::first(); // dummy jasa

$request = new Illuminate\Http\Request();
$request->merge(['jasa_id' => $jasa->id, 'initial_message' => 'Halo, mau pesan!']);
$request->setUserResolver(function() use ($user) { return $user; });

$controller = app()->make(App\Http\Controllers\OrderController::class);

echo "Testing store()...\n";
$response = $controller->store($request);
echo $response->getContent() . "\n\n";

$order = json_decode($response->getContent());

echo "Testing sendMessage()...\n";
$req2 = new Illuminate\Http\Request();
$req2->merge(['content' => 'Bisa mulai kapan?']);
$req2->setUserResolver(function() use ($user) { return $user; });
$res2 = $controller->sendMessage($req2, $order->id);

echo "Checking order messages...\n";
$finalOrder = App\Models\Order::with('messages')->find($order->id);
echo json_encode($finalOrder->messages) . "\n";
