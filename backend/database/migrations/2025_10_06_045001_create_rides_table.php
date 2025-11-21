<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->string('ride_number')->unique();
            $table->foreignId('rider_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('pickup_location');
            $table->decimal('pickup_latitude', 10, 8)->nullable();
            $table->decimal('pickup_longitude', 11, 8)->nullable();
            $table->string('drop_location');
            $table->decimal('drop_latitude', 10, 8)->nullable();
            $table->decimal('drop_longitude', 11, 8)->nullable();
            $table->string('ride_type')->nullable();
            $table->enum('status', ['pending', 'accepted', 'arrived', 'started', 'completed', 'cancelled'])->default('pending');
            $table->decimal('distance', 8, 2)->nullable();
            $table->decimal('duration', 8, 2)->nullable();
            $table->decimal('base_fare', 10, 2)->default(0);
            $table->decimal('distance_fare', 10, 2)->default(0);
            $table->decimal('time_fare', 10, 2)->default(0);
            $table->decimal('surge_multiplier', 5, 2)->default(1);
            $table->decimal('total_fare', 10, 2)->default(0);
            $table->decimal('commission', 10, 2)->default(0);
            $table->decimal('driver_earnings', 10, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('unpaid');
            $table->text('cancellation_reason')->nullable();
            $table->string('cancelled_by')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rides');
    }
};
