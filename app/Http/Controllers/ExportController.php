<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ExportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, string $type): StreamedResponse
    {
        $user = $request->user();

        return match ($type) {
            'customers' => $this->exportCustomers($user),
            default => throw new NotFoundHttpException('Invalid export type'),
        };
    }

    private function exportCustomers(User $user): StreamedResponse
    {
        $filename = 'customers-export-'.now()->format('Y-m-d').'.csv';

        $customers = \App\Models\Customer::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        return response()->stream(function () use ($customers) {
            $handle = fopen('php://output', 'w');

            // Write CSV header
            fputcsv($handle, ['Customer ID', 'Name', 'Email', 'Type', 'Created At', 'Updated At']);

            // Write data rows
            foreach ($customers as $customer) {
                fputcsv($handle, [
                    $customer->customer_number,
                    $customer->name,
                    $customer->email,
                    $customer->type,
                    $customer->created_at->format('Y-m-d H:i'),
                    $customer->updated_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}
