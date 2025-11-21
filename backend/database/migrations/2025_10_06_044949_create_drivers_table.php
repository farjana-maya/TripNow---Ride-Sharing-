<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // License Information
            $table->string('license_number');
            $table->date('license_expiry');
            
            // Vehicle Information (Basic - for quick reference)
            $table->string('vehicle_type');
            $table->string('vehicle_model');
            $table->string('vehicle_number');
            $table->string('vehicle_color')->nullable();
            $table->year('vehicle_year')->nullable();

            // Additional Driver Information
            $table->string('nid_number');
            $table->string('nid_copy_path')->nullable();
            $table->string('license_copy_path');
            $table->json('vehicle_documents')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
          
            
            // Status & Approval
            $table->enum('status', ['pending', 'approved', 'rejected', 'online', 'offline'])->default('pending');
            $table->text('rejection_reason')->nullable();
            
            // Blocking System
            $table->boolean('is_blocked')->default(false);
            $table->text('block_reason')->nullable();
            $table->enum('block_type', ['temporary', 'permanent'])->nullable();
            $table->timestamp('blocked_at')->nullable();
            $table->foreignId('blocked_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('block_until')->nullable();
            
            // Performance Metrics
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_rides')->default(0);
            $table->integer('completed_rides')->default(0);
            $table->integer('cancelled_rides')->default(0);
            
            // Financial
            $table->decimal('total_earnings', 10, 2)->default(0);
            $table->decimal('wallet_balance', 10, 2)->default(0);
            $table->decimal('pending_earnings', 10, 2)->default(0);
            
            // Location Tracking
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_available')->default(false);
            $table->timestamp('last_location_update')->nullable();
            
            // Activity Tracking
            $table->timestamp('last_ride_at')->nullable();
            $table->timestamp('last_online_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('status');
            $table->index('is_available');
            $table->index('rating');
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};