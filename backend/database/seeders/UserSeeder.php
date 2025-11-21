<?php

// FILE: database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin (already exists, so skip if present)
        if (!User::where('username', 'admin')->exists()) {
            User::create([
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'phone' => '01674423462',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        // Create riders - commented out for now
        /*
        $riders = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '01712345671'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'phone' => '01712345672'],
            ['name' => 'Mike Johnson', 'email' => 'mike@example.com', 'phone' => '01712345673'],
            ['name' => 'Sarah Williams', 'email' => 'sarah@example.com', 'phone' => '01712345674'],
            ['name' => 'David Brown', 'email' => 'david@example.com', 'phone' => '01712345675'],
            ['name' => 'Emily Davis', 'email' => 'emily@example.com', 'phone' => '01712345676'],
            ['name' => 'Robert Miller', 'email' => 'robert@example.com', 'phone' => '01712345677'],
            ['name' => 'Lisa Wilson', 'email' => 'lisa@example.com', 'phone' => '01712345678'],
            ['name' => 'James Moore', 'email' => 'james@example.com', 'phone' => '01712345679'],
            ['name' => 'Mary Taylor', 'email' => 'mary@example.com', 'phone' => '01712345680'],
        ];

        foreach ($riders as $rider) {
            User::create([
                'name' => $rider['name'],
                'email' => $rider['email'],
                'phone' => $rider['phone'],
                'password' => Hash::make('password'),
                'role' => 'user',
            ]);
        }
        */

        // Create driver users - commented out for now
        /*
        $drivers = [
            ['name' => 'Ahmed Ali', 'email' => 'ahmed@driver.com', 'phone' => '01812345681'],
            ['name' => 'Kamal Hassan', 'email' => 'kamal@driver.com', 'phone' => '01812345682'],
            ['name' => 'Rahim Khan', 'email' => 'rahim@driver.com', 'phone' => '01812345683'],
            ['name' => 'Farhan Ahmed', 'email' => 'farhan@driver.com', 'phone' => '01812345684'],
            ['name' => 'Shahid Islam', 'email' => 'shahid@driver.com', 'phone' => '01812345685'],
            ['name' => 'Rafiq Uddin', 'email' => 'rafiq@driver.com', 'phone' => '01812345686'],
            ['name' => 'Jamal Hossain', 'email' => 'jamal@driver.com', 'phone' => '01812345687'],
            ['name' => 'Habib Rahman', 'email' => 'habib@driver.com', 'phone' => '01812345688'],
        ];

        foreach ($drivers as $driver) {
            User::create([
                'name' => $driver['name'],
                'email' => $driver['email'],
                'phone' => $driver['phone'],
                'password' => Hash::make('password'),
                'role' => 'driver',
            ]);
        }
        */
    }
}
