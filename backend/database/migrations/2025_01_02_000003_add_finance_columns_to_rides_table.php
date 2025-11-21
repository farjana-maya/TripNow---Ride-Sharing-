<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('rides', function (Blueprint $table) {
            if (!Schema::hasColumn('rides', 'payment_method')) {
                $table->string('payment_method')->default('cash');
            }
            if (!Schema::hasColumn('rides', 'driver_paid')) {
                $table->boolean('driver_paid')->default(false);
            }
            if (!Schema::hasColumn('rides', 'refund_processed')) {
                $table->boolean('refund_processed')->default(false);
            }
            if (!Schema::hasColumn('rides', 'commission_rate')) {
                $table->decimal('commission_rate', 5, 2)->default(10.00);
            }
            if (!Schema::hasColumn('rides', 'commission_amount')) {
                $table->decimal('commission_amount', 10, 2)->nullable();
            }
            if (!Schema::hasColumn('rides', 'fare')) {
                $table->decimal('fare', 10, 2)->default(0);
            }
        });
    }

    public function down()
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'driver_paid', 
                'refund_processed',
                'commission_rate',
                'commission_amount'
            ]);
        });
    }
};