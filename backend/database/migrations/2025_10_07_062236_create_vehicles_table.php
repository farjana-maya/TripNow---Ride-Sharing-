<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained()->onDelete('cascade');
            $table->string('vehicle_number');
            $table->string('vehicle_model');
            $table->string('vehicle_brand')->nullable();
            $table->year('vehicle_year')->nullable();
            $table->string('vehicle_color')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->integer('seating_capacity')->default(4);
            $table->string('registration_document')->nullable();
            $table->string('insurance_document')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->string('fitness_certificate')->nullable();
            $table->date('fitness_expiry')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
