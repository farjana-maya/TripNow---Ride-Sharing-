<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('role')->nullable(); // admin, driver, user - for role-based notifications
            $table->string('type'); // ride, driver, payment, system, alert
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Additional data like ride_id, driver_id, etc.
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->string('action_url')->nullable(); // Link to specific page
            $table->timestamps();
            
            $table->index(['user_id', 'is_read']);
            $table->index('role');
            $table->index('type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};