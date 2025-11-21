<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rider_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rider_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ride_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', ['complaint', 'suggestion', 'compliment', 'general']);
            $table->string('subject');
            $table->text('message');
            $table->integer('rating')->nullable();
            $table->enum('status', ['pending', 'responded', 'resolved', 'closed'])->default('pending');
            $table->text('admin_response')->nullable();
            $table->foreignId('responded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('rider_feedback');
    }
};