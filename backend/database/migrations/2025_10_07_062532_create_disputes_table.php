<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->string('dispute_number')->unique();
            $table->foreignId('ride_id')->constrained()->onDelete('cascade');
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('reported_against')->nullable()->constrained('users')->onDelete('set null');
            $table->string('dispute_type')->nullable();
            $table->string('subject');
            $table->text('description');
            $table->string('evidence')->nullable();
            $table->enum('status', ['open', 'in_review', 'resolved'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('resolution')->nullable();
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
