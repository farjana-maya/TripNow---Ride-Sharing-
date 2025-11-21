<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ride_assignments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id');
            $table->unsignedBigInteger('driver_id');
            $table->string('status', 50)->default('assigned');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreignKey('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreignKey('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['ride_id', 'driver_id'], 'idx_ride_driver');
            $table->index(['status'], 'idx_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ride_assignments');
    }
};
