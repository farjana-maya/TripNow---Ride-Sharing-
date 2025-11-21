<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->after('role');
            $table->text('blocked_reason')->nullable()->after('status');
            $table->timestamp('blocked_at')->nullable()->after('blocked_reason');
            $table->foreignId('blocked_by')->nullable()->constrained('users')->onDelete('set null')->after('blocked_at');
            $table->foreignId('referred_by')->nullable()->constrained('users')->onDelete('set null')->after('blocked_by');
            $table->string('referral_code')->unique()->nullable()->after('referred_by');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['blocked_by']);
            $table->dropForeign(['referred_by']);
            $table->dropColumn([
                'status',
                'blocked_reason', 
                'blocked_at',
                'blocked_by',
                'referred_by',
                'referral_code'
            ]);
        });
    }
};