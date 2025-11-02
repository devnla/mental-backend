<?php

namespace App\Helpers;

use Illuminate\Http\Request;

class DeviceHelper
{
    /**
     * Get device name from User-Agent header
     */
    public static function getDeviceName(Request $request): string
    {
        $userAgent = $request->userAgent() ?? 'Unknown Device';

        // Extract browser and platform information
        $deviceName = self::parseUserAgent($userAgent);

        return $deviceName;
    }

    /**
     * Parse User-Agent string to get a readable device name
     */
    private static function parseUserAgent(string $userAgent): string
    {
        // Mobile devices
        if (preg_match('/iPhone/', $userAgent)) {
            return 'iPhone';
        }
        if (preg_match('/iPad/', $userAgent)) {
            return 'iPad';
        }
        if (preg_match('/Android/', $userAgent)) {
            if (preg_match('/Mobile/', $userAgent)) {
                return 'Android Phone';
            }

            return 'Android Tablet';
        }

        // Desktop browsers
        $browsers = [
            'Edge' => 'Microsoft Edge',
            'Edg' => 'Microsoft Edge',
            'Chrome' => 'Chrome',
            'Safari' => 'Safari',
            'Firefox' => 'Firefox',
            'Opera' => 'Opera',
        ];

        foreach ($browsers as $key => $name) {
            if (preg_match("/{$key}/", $userAgent)) {
                // Get platform
                if (preg_match('/Windows/', $userAgent)) {
                    return "{$name} on Windows";
                }
                if (preg_match('/Macintosh|Mac OS X/', $userAgent)) {
                    return "{$name} on Mac";
                }
                if (preg_match('/Linux/', $userAgent)) {
                    return "{$name} on Linux";
                }

                return $name;
            }
        }

        // Fallback to shortened user agent
        return substr($userAgent, 0, 50);
    }
}
